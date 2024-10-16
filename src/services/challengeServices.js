import prisma from '../lib/prisma.js';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';
import {
  notifyChallengeStatusChange,
  notifyContentChange,
} from './notificationService.js';

export const ChallengeService = {
  getChallenges: async ({ page, limit, sortBy, sortOrder }) => {
    const skip = (page - 1) * limit;

    // 챌린지 목록 조회입니다~
    const list = await prisma.challenge.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      where: {
        applications: {
          some: {
            status: 'ACCEPTED',
          },
        },
      },
    });

    // 전체 챌린지 수 조회입니다!
    const totalCount = await prisma.challenge.count({
      where: {
        applications: {
          some: {
            status: 'ACCEPTED',
          },
        },
      },
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

    // 챌린지 소유자에게 수정 알림 생성
    await notifyContentChange(
      challenge.owner.id,
      'CHALLENGE',
      updatedChallenge.title,
      '수정',
      new Date()
    );

    // 챌린지 참가자들에게도 알림 생성
    for (const participant of challenge.participants) {
      await notifyContentChange(
        participant.userId,
        'CHALLENGE',
        updatedChallenge.title,
        '수정',
        new Date()
      );
    }

    return updatedChallenge;
  },

  updateChallengeStatus: async (challengeId, newStatus, reason = '') => {
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
    for (const application of challenge.applications) {
      await notifyChallengeStatusChange(
        application.userId,
        challengeId,
        newStatus,
        changeDate
      );
    }

    // 상태가 삭제됨일 경우 관련 애플리케이션도 업데이트
    if (newStatus === 'DELETED') {
      await prisma.application.updateMany({
        where: { challengeId: parseInt(challengeId, 10) },
        data: { status: 'DELETED', message: reason },
      });

      // 챌린지 삭제 알림 생성
      for (const application of challenge.applications) {
        await notifyContentChange(
          application.userId,
          'CHALLENGE',
          challenge.title,
          '삭제',
          changeDate
        );
      }
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
      'CHALLENGE',
      challenge.title,
      '참여',
      new Date()
    );

    return Participation;
  },
};
