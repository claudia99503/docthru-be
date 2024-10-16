import prisma from '../lib/prisma.js';
import {
  UnauthorizedException,
  NotFoundException,
} from '../errors/customException.js';

export const authFeedbackAction = async (req, res, next) => {
  const user = req.user;
  const { feedbackId } = req.params;

  try {
    const feedbackInfo = await prisma.feedback.findFirst({
      where: { id: Number(feedbackId) },
      include: { work: true },
    });

    if (!feedbackInfo) {
      return next(new NotFoundException('등록된 피드백이 없습니다.'));
    }

    const challengeInfo = await prisma.challenge.findFirst({
      where: { id: feedbackInfo.work.challengeId },
    });

    if (!challengeInfo) {
      return next(new NotFoundException('등록된 챌린지가 없습니다.'));
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: Number(user.userId) },
    });

    if (!userInfo) {
      return next(new UnauthorizedException('사용자 정보가 없습니다.'));
    }

    if (challengeInfo.progress) {
      if (userInfo.role === 'ADMIN') {
        return next();
      } else {
        return next(new UnauthorizedException('챌린지가 마감됐습니다.'));
      }
    }

    if (userInfo.id === feedbackInfo.userId || userInfo.role === 'ADMIN') {
      return next();
    }

    return next(new UnauthorizedException('접근 권한이 없습니다.'));
  } catch (error) {
    next(error);
  }
};

export const authCreateFeedbackAction = async (req, res, next) => {
  const { userId } = req.user;
  const { workId } = req.params;

  try {
    if (!userId) {
      return next(new UnauthorizedException('로그인이 필요합니다.'));
    }

    const workWithChallenge = await prisma.work.findUnique({
      where: { id: Number(workId) },
      include: {
        challenge: {
          include: {
            participations: true,
          },
        },
      },
    });

    const challengeInfo = workWithChallenge?.challenge;

    if (!workWithChallenge) {
      return next(new NotFoundException('등록된 작업물이 없습니다.'));
    }

    if (challengeInfo.progress) {
      return next(new UnauthorizedException('챌린지가 마감됐습니다.'));
    }

    return next();
  } catch (error) {
    next(error);
  }
};
