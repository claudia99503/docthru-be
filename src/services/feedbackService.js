import prisma from '../lib/prisma.js';
import * as notificationService from './notificationService.js';

export const createFeedback = async ({ workId, content, userId }) => {
  const workInfo = await prisma.work.findUnique({
    where: { id: Number(workId) },
  });

  const feedback = await prisma.feedback.create({
    data: {
      content: content,
      userId: Number(userId),
      workId: Number(workId),
    },
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
  const [feedback, userInfo, feedbackInfo] = await prisma.$transaction([
    prisma.feedback.update({
      where: { id: Number(feedbackId) },
      data: { content },
    }),
    prisma.user.findUnique({
      where: { id: Number(userId) },
    }),
    prisma.feedback.findUnique({
      where: { id: Number(feedbackId) },
      include: { user: true },
    }),
  ]);

  //피드백 작성자한테 알림
  if (userInfo && userInfo.role === 'ADMIN') {
    await notificationService.notifyAdminFeedbackAction(
      Number(feedbackInfo.user.id),
      Number(feedbackId),
      '수정'
    );
  }

  return feedback;
};

export const deleteFeedback = async ({ feedbackId, userId }) => {
  const [userInfo, feedbackInfo] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: Number(userId) },
    }),
    prisma.feedback.findUnique({
      where: { id: Number(feedbackId) },
      include: { user: true },
    }),
  ]);

  //피드백 작성자한테 알림
  if (userInfo && userInfo.role === 'ADMIN') {
    await notificationService.notifyAdminFeedbackAction(
      Number(feedbackInfo.user.id),
      Number(feedbackId),
      '삭제'
    );
  }

  await prisma.feedback.delete({
    where: { id: Number(feedbackId) },
  });
};
