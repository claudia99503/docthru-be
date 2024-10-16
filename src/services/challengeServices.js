import { PrismaClient } from '@prisma/client';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';

const prisma = new PrismaClient();

export const ChallengeService = {
  getChallenges: async ({ page, limit, sortBy, sortOrder }) => {
    const skip = (page - 1) * limit;
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
    return list;
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

    const dataFilter = {
      id: challenge.id,
      title: challenge.title,
      field: challenge.field,
      docType: challenge.docType,
      description: challenge.description,
      docUrl: challenge.docUrl,
      deadline: challenge.deadline,
      progress: challenge.progress,
      participants: challenge.participants,
      maxParticipants: challenge.maxParticipants,
      writer: challenge.applications.map((app) => ({
        id: app.id,
        userId: app.userId,
        nickname: app.user.nickname,
        grade: app.user.grade,
        appliedAt: app.appliedAt,
      })),
    };

    return dataFilter;
  },
  getCurrentUser: async (userId) => {
    // Implement the logic to get the current user's role and other details
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
  },

  updateChallengeById: async (challengeId, updateData) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: {
        title: updateData.title || challenge.title,
        field: updateData.field || challenge.field,
        docType: updateData.docType || challenge.docType,
        description: updateData.description || challenge.description,
        docUrl: updateData.docUrl || challenge.docUrl,
        deadline: updateData.deadline || challenge.deadline,
        progress: updateData.progress || challenge.progress,
        participants: updateData.participants || challenge.participants,
        maxParticipants:
          updateData.maxParticipants || challenge.maxParticipants,
      },
    });

    return updatedChallenge;
  },
  deleteChallengeById: async (challengeId) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    await prisma.application.updateMany({
      where: { challengeId: parseInt(challengeId, 10) },
      data: {
        status: 'DELETED',
      },
    });
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
    if (challenge.participants > challenge.maxParticipants) {
      throw new BadRequestException('참여 자리가 없음');
    }

    const data = {
      challengeId: parseInt(challengeId, 10),
      userId,
    };
    const participations = await prisma.participations.create({ data });

    await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: { participants: { increment: 1 } },
    });
    return participations;
  },
};
