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
