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
      applications: {
        some: {
          status: 'ACCEPTED',
        },
      },
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
        applications: {
          include: {
            user: {
              select: {
                nickname: true,
                grade: true,
              },
            },
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    return challenge;
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
      include: {
        owner: true,
        participants: true,
      },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: updateData,
    });

    const changeDate = new Date();

    // 챌린지 소유자에게 수정 알림 생성
    await notifyContentChange(
      challenge.owner.id,
      adminUserId,
      'CHALLENGE',
      updatedChallenge.title,
      '수정',
      changeDate,
      challengeId
    );

    // 챌린지 참가자들에게도 알림 생성
    const participantIds = challenge.participants.map((p) => p.userId);
    await notifyMultipleUsers(
      participantIds,
      notifyContentChange,
      adminUserId,
      'CHALLENGE',
      updatedChallenge.title,
      '수정',
      changeDate,
      challengeId
    );

    return updatedChallenge;
  },

  updateChallengeStatus: async (
    challengeId,
    newStatus,
    reason = '',
    adminUserId
  ) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: { applications: true },
    });

    if (!challenge) {
      throw new NotFoundException('챌린지를 찾을 수 없습니다.');
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: { status: newStatus },
    });

    const changeDate = new Date();

    // 모든 신청자에게 알림 전송
    const applicantIds = challenge.applications.map((a) => a.userId);
    await notifyMultipleUsers(
      applicantIds,
      notifyChallengeStatusChange,
      adminUserId,
      challengeId,
      challenge.title,
      newStatus,
      changeDate
    );

    // 상태가 삭제됨일 경우 관련 애플리케이션도 업데이트
    if (newStatus === 'DELETED') {
      await prisma.application.updateMany({
        where: { challengeId: parseInt(challengeId, 10) },
        data: { status: 'DELETED', message: reason },
      });

      // 챌린지 삭제 알림 생성
      await notifyMultipleUsers(
        applicantIds,
        notifyContentChange,
        adminUserId,
        'CHALLENGE',
        challenge.title,
        '삭제',
        changeDate,
        challengeId
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
};
