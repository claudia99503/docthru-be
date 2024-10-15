import { PrismaClient } from '@prisma/client';
import {
  UnauthorizedException,
  NotFoundException,
} from '../errors/customException.js';

const prisma = new PrismaClient();

export const autFeedbackAction = async (req, res, next) => {
  const user = req.user;
  const { feedbackId } = req.params;

  const feedbackInfo = await prisma.feedback.findFirst({
    where: {
      id: Number(feedbackId),
    },
  });

  const userInfo = await prisma.user.findUnique({
    where: { id: Number(user.userId) },
  });

  if (!feedbackInfo) {
    next(new NotFoundException('등록된 피드백이 없습니다.'));
  }

  if (!userInfo) {
    next(new UnauthorizedException('사용자 정보가 없습니다'));
  }

  if (userInfo.id === feedbackInfo.userId || userInfo.role === 'ADMIN') {
    next();
  } else {
    next(new UnauthorizedException('접근 권한이 없습니다'));
  }
};
