// replyService.js

import prisma from '../lib/prisma.js';
import * as notificationService from './notificationService.js';
import {
  UnauthorizedException,
  NotFoundException,
} from '../errors/customException.js';

export const validateCreateReplyAccess = async ({ userId, feedbackId }) => {
  const feedbackInfo = await prisma.feedback.findUnique({
    where: { id: Number(feedbackId) },
    include: {
      work: {
        include: {
          challenge: true,
        },
      },
    },
  });

  if (!feedbackInfo) {
    throw new NotFoundException('등록된 피드백이 없습니다.');
  }

  const challengeInfo = feedbackInfo.work.challenge;

  if (!challengeInfo) {
    throw new NotFoundException('등록된 챌린지가 없습니다.');
  }

  if (challengeInfo.progress) {
    throw new UnauthorizedException('챌린지가 마감됐습니다.');
  }
};

export const validateReplyAccess = async (userId, replyId) => {
  const [userInfo, replyInfo] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: Number(userId) },
    }),
    prisma.reply.findFirst({
      where: { id: Number(replyId) },
      include: {
        feedback: {
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
        },
      },
    }),
  ]);

  if (!replyInfo) {
    throw new NotFoundException('등록된 대댓글이 없습니다.');
  }

  const challengeInfo = replyInfo.feedback.work.challenge;

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

  if (userInfo.id === replyInfo.userId || userInfo.role === 'ADMIN') {
    return;
  }

  throw new UnauthorizedException('접근 권한이 없습니다.');
};

export const postReplyByFeedbackId = async ({
  feedbackId,
  content,
  userId,
}) => {
  console.log(
    `Attempting to create reply for feedback ${feedbackId} by user ${userId}`
  );

  return prisma.$transaction(async (prismaTransaction) => {
    try {
      const reply = await prismaTransaction.reply.create({
        data: {
          content: content,
          userId: Number(userId),
          feedbackId: Number(feedbackId),
        },
      });
      console.log(`Reply created: ${JSON.stringify(reply)}`);

      const feedback = await getFeedbackById(feedbackId);
      console.log(
        `Sending notification for new reply: ${JSON.stringify(feedback)}`
      );

      // 피드백 작성자에게 알림 보내기 (자신의 피드백에 대댓글을 단 경우 제외)
      if (feedback.userId !== userId) {
        await notificationService.notifyNewReply(
          feedback.userId,
          userId,
          feedback.work.challengeId,
          feedback.work.challenge.title,
          feedback.workId,
          feedback.id,
          reply.id
        );
        console.log('Notification sent to feedback author successfully');
      }

      // 챌린지 작성자에게 알림 보내기 (자신의 챌린지에 대댓글을 단 경우 제외)
      if (feedback.work.challenge.userId !== userId) {
        await notificationService.notifyNewReply(
          feedback.userId,
          userId,
          feedback.work.challengeId,
          feedback.work.challenge.title,
          feedback.workId,
          feedback.id,
          reply.id
        );
        console.log('Notification sent to challenge author successfully');
      }

      return reply;
    } catch (error) {
      console.error('Error in postReplyByFeedbackId:', error);
      throw error;
    }
  });
};

export const updateReplyById = async ({ replyId, content, userId }) => {
  await validateReplyAccess(userId, replyId);

  const reply = await prisma.reply.update({
    where: { id: Number(replyId) },
    data: { content },
  });

  // 관련 사용자들에게 알림 보내기
  const updatedReply = await getReplyById(replyId);
  const notificationRecipients = [
    updatedReply.feedback.userId, // 피드백 작성자
    updatedReply.feedback.work.challenge.userId, // 챌린지 작성자
  ].filter((id) => id !== userId); // 자신을 제외

  for (const recipientId of notificationRecipients) {
    await notificationService.notifyContentChange(
      recipientId,
      userId,
      'REPLY',
      updatedReply.feedback.work.challenge.title,
      '수정',
      updatedReply.feedback.work.challengeId,
      updatedReply.feedback.workId,
      replyId
    );
  }

  return reply;
};

export const deleteReplyById = async ({ replyId, userId }) => {
  await validateReplyAccess(userId, replyId);

  const replyToDelete = await getReplyById(replyId);

  await prisma.reply.delete({
    where: { id: Number(replyId) },
  });

  // 관련 사용자들에게 알림 보내기
  const notificationRecipients = [
    replyToDelete.feedback.userId, // 피드백 작성자
    replyToDelete.feedback.work.challenge.userId, // 챌린지 작성자
  ].filter((id) => id !== userId); // 자신을 제외

  for (const recipientId of notificationRecipients) {
    await notificationService.notifyContentChange(
      recipientId,
      userId,
      'REPLY',
      replyToDelete.feedback.work.challenge.title,
      '삭제',
      replyToDelete.feedback.work.challengeId,
      replyToDelete.feedback.workId,
      replyId
    );
  }
};

export const getRepliesByFeedbackId = async (feedbackId) => {
  const replies = await prisma.reply.findMany({
    where: { feedbackId: Number(feedbackId) },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });

  return replies;
};

export const getFeedbackById = async (feedbackId) => {
  const feedback = await prisma.feedback.findUnique({
    where: { id: Number(feedbackId) },
    include: {
      user: true,
      work: {
        include: {
          challenge: true,
        },
      },
    },
  });

  if (!feedback) {
    throw new NotFoundException('등록된 피드백이 없습니다.');
  }

  return feedback;
};

export const getReplyById = async (replyId) => {
  const reply = await prisma.reply.findUnique({
    where: { id: Number(replyId) },
    include: {
      user: true,
      feedback: {
        include: {
          work: {
            include: {
              challenge: true,
            },
          },
        },
      },
    },
  });

  if (!reply) {
    throw new NotFoundException('등록된 대댓글이 없습니다.');
  }

  return reply;
};
