import { PrismaClient } from '@prisma/client';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '../errors/customException.js';

const prisma = new PrismaClient();

export const authWorkAction = async (req, res, next) => {
  const user = req.user;
  const { workId } = req.params;

  try {
    const workInfo = await prisma.work.findUnique({
      where: { id: Number(workId) },
    });

    if (!workInfo) {
      return next(new NotFoundException('등록된 작업물이 없습니다.'));
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: Number(user.userId) },
    });

    if (!userInfo) {
      return next(new UnauthorizedException('사용자 정보가 없습니다.'));
    }

    if (userInfo.id === workInfo.userId || userInfo.role === 'ADMIN') {
      return next();
    }

    return next(new UnauthorizedException('접근 권한이 없습니다.'));
  } catch (error) {
    next(error);
  }
};

export const authCreateWorkAction = async (req, res, next) => {
  const user = req.user;
  const { challengeId } = req.params;

  try {
    const challengeInfo = await prisma.challenge.findUnique({
      where: { id: Number(challengeId) },
      include: {
        participations: true,
        works: true,
      },
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

    const isParticipating = challengeInfo.participations.some(
      (participation) => participation.userId === userInfo.id
    );

    if (!isParticipating) {
      return next(new UnauthorizedException('신청한 회원만 쓸 수 있습니다.'));
    }

    const hasSubmittedWork = challengeInfo.works.some(
      (work) => work.userId === userInfo.id
    );

    if (hasSubmittedWork) {
      return next(new BadRequestException('이미 작업물을 등록했습니다.'));
    }

    return next();
  } catch (error) {
    next(error);
  }

  if (!userInfo) {
    next(new UnauthorizedException('사용자 정보가 없습니다'));
  }

  const isParticipating = challengeInfo.participations.some(
    (participation) => participation.userId === userInfo.id
  );

  if (!isParticipating) {
    next(new UnauthorizedException('신청한 회원만 쓸 수 있습니다.'));
  }

  const hasSubmittedWork = challengeInfo.works.some(
    (work) => work.userId === userInfo.id
  );

  if (hasSubmittedWork) {
    next(new BadRequestException('이미 작업물을 등록했습니다.'));
  }

  next();
};
