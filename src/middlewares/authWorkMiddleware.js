import { UnauthorizedException } from '../errors/customException.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authWorkAction = async (req, res, next) => {
  const user = req.user;
  const { workId } = req.params;

  const workInfo = await prisma.work.findFirst({
    where: {
      id: Number(workId),
    },
  });

  const userInfo = await prisma.user.findUnique({
    where: { id: Number(user.userId) },
  });

  if (userInfo.id === workInfo.userId || userInfo.role === 'ADMIN') {
    next();
  } else {
    throw new UnauthorizedException('접근 권한이 없습니다');
  }
};

export const authCreateWorkAction = async (req, res, next) => {
  const user = req.user;
  const { challengeId } = req.params;

  const challengeInfo = await prisma.challenge.findFirst({
    where: {
      id: Number(challengeId),
    },
    include: {
      participations: true,
      works: true,
    },
  });

  const userInfo = await prisma.user.findUnique({
    where: { id: Number(user.userId) },
  });

  if (!challengeInfo) {
    return res.status(404).json({ message: '챌린지를 찾을 수 없습니다.' });
  }

  if (!userInfo) {
    throw new UnauthorizedException('사용자 정보가 없습니다');
  }

  const isParticipating = challengeInfo.participations.some(
    (participation) => participation.userId === userInfo.id
  );

  if (!isParticipating) {
    throw new UnauthorizedException('접근 권한이 없습니다');
  }

  const hasSubmittedWork = challengeInfo.works.some(
    (work) => work.userId === userInfo.id
  );

  if (hasSubmittedWork) {
    return res.status(403).json({ message: '이미 작업을 제출하였습니다.' });
  }

  next();
};
