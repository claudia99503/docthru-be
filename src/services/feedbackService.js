import prisma from '../lib/prisma.js';
import * as notificationService from './notificationService.js';

export const postFeedbackById = async ({ workId, content, userId }) => {
  const feedback = await prisma.feedback.create({
    data: {
      content: content,
      userId: Number(userId),
      workId: Number(workId),
    },
  });

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
