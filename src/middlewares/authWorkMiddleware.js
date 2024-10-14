import { UnauthorizedException } from '../errors/customException.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authWorkAction = async (req, res, next) => {
  const user = req.user;
  const { challengeId: workId } = req.params;

  const workInfo = await prisma.work.findFirst({
    where: {
      id: Number(workId),
    },
  });

  console.log('user :', user);
  console.log('workInfo :', workInfo.userId);
  // if (user.id !== workInfo.userId || user.UserRole !== ADMIN) {
  //   throw new UnauthorizedException('접근 권한이 없습니다');
  // }

  next();
};
