import prisma from '../lib/prisma.js';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';
import {
  notifyChallengeStatusChange,
  notifyContentChange,
  notifyMultipleUsers,
} from './notificationService.js';

export const ChallengeService = {
  getChallenges: async ({
    page,
    limit,
    sortBy,
    sortOrder,
    field,
    docType,
    progress,
  }) => {
    const skip = (page - 1) * limit;

    // 필터 조건 설정
    const filterConditions = {
      status: 'ACCEPTED',
    };

    if (field && field.length > 0) {
      filterConditions.field = { in: field };
    }

    if (docType) {
      filterConditions.docType = docType;
    }

    if (progress !== undefined) {
      filterConditions.progress = progress;
    }

    // 챌린지 목록 조회입니다~
    const list = await prisma.challenge.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      where: filterConditions,
    });

    // 전체 챌린지 수 조회입니다!
    const totalCount = await prisma.challenge.count({
      where: filterConditions,
    });

    // 총 페이지 수 계산입니다!
    const totalPages = Math.ceil(totalCount / limit);

    // 리턴값입니다~
    return {
      list,
      meta: {
        currentPage: page,
        totalCount,
        totalPages,
      },
    };
  },

  getChallengeById: async (challengeId) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: {
        user: {
          select: {
            nickname: true,
            grade: true,
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }
    // User 정보를 Writer로 가공하여 반환
    const { User, ...rest } = challenge;
    const processedChallenge = {
      ...rest,
      writer: User
        ? {
            nickname: User.nickname,
            grade: User.grade,
          }
        : null,
    };

    return processedChallenge;
  },

  getCurrentUser: async (userId) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
  },

  updateChallengeById: async (challengeId, updateData, adminUserId) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: { user: true },
    });

    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: updateData,
    });

    const changedFields = [];
    if (updateData.title && updateData.title !== challenge.title) {
      changedFields.push('제목');
    }
    if (
      updateData.description &&
      updateData.description !== challenge.description
    ) {
      changedFields.push('설명');
    }
    if (updateData.deadline && updateData.deadline !== challenge.deadline) {
      changedFields.push('마감일');
    }

    if (changedFields.length > 0) {
      const changeMessage = `다음 항목이 변경되었습니다: ${changedFields.join(
        ', '
      )}`;

      await notifyContentChange(
        challenge.userId,
        adminUserId,
        'CHALLENGE',
        challenge.title,
        '수정',
        new Date(),
        challengeId,
        null,
        null,
        changeMessage
      );
    }

    return updatedChallenge;
  },

  updateChallengeStatus: async (
    challengeId,
    newStatus,
    reason,
    adminUserId
  ) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: { user: true },
    });

    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: { status: newStatus },
    });

    await notifyChallengeStatusChange(
      challenge.userId,
      adminUserId,
      challengeId,
      challenge.title,
      newStatus,
      new Date()
    );

    if (reason) {
      const reasonContent = `상태 변경 사유: ${reason}`;
      await notifyContentChange(
        challenge.userId,
        adminUserId,
        'CHALLENGE',
        challenge.title,
        newStatus,
        new Date(),
        challengeId,
        null,
        null,
        reasonContent
      );
    }

    return updatedChallenge;
  },

  getChallengesUrl: async (challengeId) => {
    const challenges = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      select: {
        docUrl: true,
      },
    });
    if (!challenges) {
      throw new NotFoundException('챌린지가 없습니다.');
    }
    return challenges;
  },

  postChallengeParticipate: async (challengeId, userId) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: {
        participations: true,
      },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }
    if (challenge.progress === true) {
      throw new BadRequestException('마감 된 챌린지 입니다.');
    }
    const isAlreadyParticipating = challenge.participations.some(
      (participations) => participations.userId === userId
    );
    if (isAlreadyParticipating) {
      throw new BadRequestException('이미 챌린저에 참여하고 있습니다.');
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('사용자가 없습니다.');
    }
    if (challenge.participants >= challenge.maxParticipants) {
      throw new BadRequestException('참여 자리가 없음');
    }

    const data = {
      challengeId: parseInt(challengeId, 10),
      userId,
    };
    const Participation = await prisma.participation.create({ data });

    await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: { participants: { increment: 1 } },
    });

    // 챌린지 참여 알림 생성
    await notifyContentChange(
      userId,
      userId, // 본인의 액션이므로 actorId도 userId로
      'CHALLENGE',
      challenge.title,
      '참여',
      new Date(),
      challengeId
    );

    return Participation;
  },

  hardDeleteChallengeById: async (challengeId, userId) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: { user: true },
    });

    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    if (challenge.userId !== userId) {
      throw new ForbiddenException(
        '본인이 신청한 챌린지만 취소할 수 있습니다.'
      );
    }

    if (challenge.status !== 'WAITING') {
      throw new BadRequestException('대기 상태의 챌린지만 취소할 수 있습니다.');
    }

    await prisma.challenge.delete({
      where: { id: parseInt(challengeId, 10) },
    });

    await notifyContentChange(
      challenge.userId,
      userId,
      'CHALLENGE',
      challenge.title,
      '취소',
      new Date(),
      challengeId
    );

    return { message: '챌린지가 성공적으로 취소되었습니다.' };
  },
};
