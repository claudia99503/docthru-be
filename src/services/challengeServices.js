import prisma from '../lib/prisma.js';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '../errors/customException.js';
import {
  notifyChallengeStatusChange,
  notifyContentChange,
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
    keyword,
  }) => {
    const skip = (page - 1) * limit;

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
    if (keyword) {
      filterConditions.title = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    const list = await prisma.challenge.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      where: filterConditions,
    });

    const totalCount = await prisma.challenge.count({
      where: filterConditions,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      list,
      meta: {
        currentPage: page,
        totalCount,
        totalPages,
      },
    };
  },

  getChallengeById: async (challengeId, userId) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: {
        user: {
          select: {
            nickname: true,
            grade: true,
            image: true,
          },
        },
        participations: {
          select: {
            userId: true,
          },
        },
        works: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }
    const isParticipated = challenge.participations.some(
      (participations) => participations.userId === userId
    );
    const { user, works, ...rest } = challenge;
    const processedChallenge = {
      ...rest,
      writer: user
        ? {
            nickname: user.nickname,
            grade: user.grade,
            image: user.image,
          }
        : null,
      isParticipated,
      workId: works.length > 0 ? works[0].id : null,
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

      notifyContentChange(
        [challenge.userId],
        adminUserId,
        'CHALLENGE',
        challenge.title,
        '수정',
        challengeId,
        null,
        null,
        new Date(),
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

    notifyChallengeStatusChange(
      [challenge.userId],
      adminUserId,
      challengeId,
      challenge.title,
      newStatus,
      new Date()
    );

    if (reason) {
      const reasonContent = `상태 변경 사유: ${reason}`;
      notifyContentChange(
        [challenge.userId],
        adminUserId,
        'CHALLENGE',
        challenge.title,
        newStatus,
        challengeId,
        null,
        null,
        new Date(),
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

    notifyContentChange(
      [userId],
      userId,
      'CHALLENGE',
      challenge.title,
      '참여',
      challengeId,
      null,
      null,
      new Date()
    );

    return Participation;
  },
  deleteChallengeParticipation: async (challengeId, userId) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: { participations: true },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }
    const participation = challenge.participations.find(
      (participations) => participations.userId === userId
    );
    if (!participation) {
      throw new NotFoundException('참여자가 없음');
    }
    await prisma.participation.delete({
      where: { id: participation.id },
    });
    await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: { participants: { decrement: 1 } },
    });

    return participation;
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

    notifyContentChange(
      [challenge.userId],
      userId,
      'CHALLENGE',
      challenge.title,
      '취소',
      challengeId,
      null,
      null,
      new Date()
    );

    return { message: '챌린지가 성공적으로 취소되었습니다.' };
  },
};

export default ChallengeService;
