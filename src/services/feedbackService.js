import prisma from '../lib/prisma.js';
import * as notificationService from './notificationService.js';

export const createFeedback = async ({ workId, content, userId }) => {
  const feedback = await prisma.feedback.create({
    data: {
      content: content,
      userId: Number(userId),
      workId: Number(workId),
    },
  });

  const workInfo = await prisma.work.findUnique({
    where: { id: Number(workId) },
  });

  //작업물 작성자한테 알림
  await notificationService.notifyNewFeedback(
    Number(workInfo.userId),
    Number(workId),
    Number(feedback.id)
  );

  return feedback;
};

export const updateFeedback = async ({ feedbackId, content, userId }) => {
  const feedback = await prisma.feedback.update({
    where: { id: Number(feedbackId) },
    data: { content },
  });

  await notifyAdminAboutFeedback(userId, feedbackId, '수정 ');

  return feedback;
};

export const deleteFeedback = async ({ feedbackId, userId }) => {
  await notifyAdminAboutFeedback(userId, feedbackId, '삭제');

  await prisma.feedback.delete({
    where: { id: Number(feedbackId) },
  });
};

const notifyAdminAboutFeedback = async (userId, feedbackId, type) => {
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
      'FEEDBACK',
      challengeInfo.title,
      type === '삭제' ? '삭제' : '수정',
      Number(feedbackId),
      new Date()
    );
  }
};
