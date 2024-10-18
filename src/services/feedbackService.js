import prisma from '../lib/prisma.js';
import * as notificationService from './notificationService.js';
import {
  UnauthorizedException,
  NotFoundException,
} from '../errors/customException.js';

export const postFeedbackById = async ({ workId, content, userId }) => {
  const feedback = await prisma.feedback.create({
    data: {
      content: content,
      userId: Number(userId),
      workId: Number(workId),
    },
  });

  await notifyCreateAboutFeedback(userId, workId, feedback);

  return feedback;
};

export const updateFeedbackById = async ({ feedbackId, content, userId }) => {
  const feedback = await prisma.feedback.update({
    where: { id: Number(feedbackId) },
    data: { content },
  });

  await notifyAdminAboutFeedback(userId, feedbackId, '수정 ');

  return feedback;
};

export const deleteFeedbackById = async ({ feedbackId, userId }) => {
  await notifyAdminAboutFeedback(userId, feedbackId, '삭제');

  await prisma.feedback.delete({
    where: { id: Number(feedbackId) },
  });
};

const notifyCreateAboutFeedback = async (userId, workId, feedback) => {
  const workInfo = await prisma.work.findUnique({
    where: { id: Number(workId) },
    include: {
      challenge: true,
    },
  });

  //작업물 작성자한테 알림
  await notificationService.notifyNewFeedback(
    Number(workInfo.userId),
    Number(userId),
    Number(workInfo.challenge.id),
    workInfo.challenge.title,
    Number(workId),
    Number(feedback.id),
    new Date()
  );
};

const notifyAdminAboutFeedback = async (userId, feedbackId, action) => {
  const [userInfo, feedbackInfo] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: Number(userId) },
    }),
    prisma.feedback.findUnique({
      where: { id: Number(feedbackId) },
      include: { user: true, work: true },
    }),
  ]);

  const challengeInfo = await prisma.challenge.findUnique({
    where: { id: Number(feedbackInfo.work.challengeId) },
  });

  // 피드백 작성자한테 알림
  if (userInfo && userInfo.role === 'ADMIN') {
    await notificationService.notifyContentChange(
      Number(feedbackInfo.user.id),
      Number(userId),
      'FEEDBACK',
      challengeInfo.title,
      action === '삭제' ? '삭제' : '수정',
      null,
      null,
      Number(feedbackId)
    );
  }
};

export const validateFeedbackAccess = async (userId, feedbackId) => {
  const [userInfo, feedbackInfo] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: Number(userId) },
    }),
    prisma.feedback.findFirst({
      where: { id: Number(feedbackId) },
      include: {
        work: {
          include: {
            challenge: {
              include: {
                participations: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!feedbackInfo) {
    throw new NotFoundException('등록된 피드백이 없습니다.');
  }

  const challengeInfo = await feedbackInfo.work.challenge;

  if (!challengeInfo) {
    throw new NotFoundException('등록된 챌린지가 없습니다.');
  }

  if (challengeInfo.progress) {
    if (userInfo.role === 'ADMIN') {
      return;
    } else {
      throw new UnauthorizedException('챌린지가 마감됐습니다.');
    }
  }

  if (userInfo.id === feedbackInfo.userId || userInfo.role === 'ADMIN') {
    return;
  }

  throw new UnauthorizedException('접근 권한이 없습니다.');
};

export const validateCreateFeedbackAccess = async (workId) => {
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

  if (!workWithChallenge) {
    throw new NotFoundException('등록된 작업물이 없습니다.');
  }

  const challengeInfo = workWithChallenge.challenge;

  if (challengeInfo.progress) {
    throw new UnauthorizedException('챌린지가 마감됐습니다.');
  }

  return;
};
