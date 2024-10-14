import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { getCurrentUser } from '../services/userServices.js';
import {
  ForbiddenException,
  NotFoundException,
} from '../errors/customException.js';

export async function getChallenges(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.orderByField || 'id';
    const sortOrder = req.query.orderByDir || 'asc';
    const challenges = await prisma.challenge.findMany({
      skip,
      take : limit,
      orderBy: { [sortBy]: sortOrder },
      where: {
        applications: {
          some: {
            status: 'ACCEPTED',
          },
        },
      },
    });

    return res.status(200).json({challenges});
  } catch (error) {
    next(error);
  }
}

export async function getChallengeById(req, res, next) {
  try {
    const { challengeId } = req.params;
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: {
        applications: {
          include: {
            user: {
              select: {
                nickName: true,
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
      participates: challenge.participates,
      maxParticipates: challenge.maxParticipates,
      applications: challenge.applications.map((app) => ({
        id: app.id,
        userId: app.userId,
        nickName: app.user.nickName,
        grade: app.user.grade,
        appliedAt: app.appliedAt,
      })),
    };

    return res.status(200).json(dataFilter);
  } catch (error) {
    next(error);
  }
}

export async function patchChallengeById(req, res, next) {
  const userId = req.user.userId;
  const { role } = await getCurrentUser(userId);

  if (role !== 'ADMIN') {
    return next(new ForbiddenException());
  }
  try {
    const { challengeId } = req.params;
    const {
      title,
      field,
      docType,
      description,
      docUrl,
      deadline,
      progress,
      participates,
      maxParticipates,
    } = req.body;

    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: {
        title: title || challenge.title,
        field: field || challenge.field,
        docType: docType || challenge.docType,
        description: description || challenge.description,
        docUrl: docUrl || challenge.docUrl,
        deadline: deadline || challenge.deadline,
        progress: progress || challenge.progress,
        participates: participates || challenge.participates,
        maxParticipates: maxParticipates || challenge.maxParticipates,
      },
    });

    return res.status(200).json(updatedChallenge);
  } catch (error) {
    next(error);
  }
}

export async function deleteChallengeById(req, res, next) {
  const userId = req.user.userId;
  const { role } = await getCurrentUser(userId);

  if (role !== 'ADMIN') {
    return next(new ForbiddenException());
  }

  try {
    const { challengeId } = req.params;
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }

    const deletedApplications = await prisma.application.updateMany({
      where: { challengeId: parseInt(challengeId, 10) },
      data: {
        status: 'DELETED',
      },
    });

    return res.sendStatus(204, deletedApplications);
  } catch (error) {
    next(error);
  }
}

export async function getChallengesUrl(req, res, next) {
  try {
    const challenges = await prisma.challenge.findUnique({
      where: { id: parseInt(req.params.challengeId, 10) },
      select: {
        docUrl: true,
      },
    });
    if (!challenges) {
      throw new NotFoundException('챌린지가 없습니다.');
    }
    return res.status(200).json(challenges);
  } catch (error) {
    next(error);
  }
}

export async function postChallengeParticipate(req, res, next) {
  try {
    const { challengeId } = req.params;
    const { userId } = req.user;
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
    });
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다.');
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('사용자가 없습니다.');
    }
    const data = {
      challengeId: parseInt(challengeId, 10),
      userId,
    };
    const participate = await prisma.participate.create({ data });
    return res.status(201).json(participate);
  } catch (error) {
    next(error);
  }
}
