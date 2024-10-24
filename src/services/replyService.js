import prisma from '../lib/prisma.js';
import * as notificationService from './notificationService.js';
import {
  NotFoundException,
  UnprocessableEntityException,
  ForbiddenException,
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
    throw new UnprocessableEntityException('챌린지가 마감됐습니다.');
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
      throw new UnprocessableEntityException('챌린지가 마감됐습니다.');
    }
  }

  if (userInfo.id === replyInfo.userId || userInfo.role === 'ADMIN') {
    return;
  }

  throw new ForbiddenException('접근 권한이 없습니다.');
};

export const postReplyByFeedbackId = async ({
  feedbackId,
  content,
  userId,
}) => {
  try {
    const reply = await prisma.reply.create({
      data: {
        content: content,
        userId: Number(userId),
        feedbackId: Number(feedbackId),
      },
    });

    const feedback = await getFeedbackById(feedbackId);

    if (feedback.userId !== userId) {
      notificationService.notifyNewReply(
        [feedback.userId],
        userId,
        feedback.work.challengeId,
        feedback.work.challenge.title,
        feedback.workId,
        feedback.id,
        reply.id
      );
    }

    if (feedback.work.challenge.userId !== userId) {
      notificationService.notifyNewReply(
        [feedback.work.challenge.userId],
        userId,
        feedback.work.challengeId,
        feedback.work.challenge.title,
        feedback.workId,
        feedback.id,
        reply.id
      );
    }

    return reply;
  } catch (error) {
    console.error('Error in postReplyByFeedbackId:', error);
    throw error;
  }
};

export const updateReplyById = async ({ replyId, content, userId }) => {
  await validateReplyAccess(userId, replyId);

  const reply = await prisma.reply.update({
    where: { id: Number(replyId) },
    data: { content },
  });

  const updatedReply = await getReplyById(replyId);
  notificationService.notifyContentChange(
    [updatedReply.userId],
    userId,
    'REPLY',
    updatedReply.feedback.work.challenge.title,
    '수정',
    updatedReply.feedback.work.challengeId,
    updatedReply.feedback.workId,
    replyId
  );

  return reply;
};

export const deleteReplyById = async ({ replyId, userId }) => {
  await validateReplyAccess(userId, replyId);

  const replyToDelete = await getReplyById(replyId);

  await prisma.reply.delete({
    where: { id: Number(replyId) },
  });

  notificationService.notifyContentChange(
    [replyToDelete.userId],
    userId,
    'REPLY',
    replyToDelete.feedback.work.challenge.title,
    '삭제',
    replyToDelete.feedback.work.challengeId,
    replyToDelete.feedback.workId,
    replyId
  );
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

export const getReplies = async ({ feedbackId, cursorId, limit, userId }) => {
  const replies = await prisma.reply.findMany({
    where: {
      feedbackId: Number(feedbackId),
      ...(cursorId && {
        id: { lt: Number(cursorId) },
      }),
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: Number(limit + 1),
    include: {
      user: {
        select: {
          nickname: true,
          grade: true,
        },
      },
    },
  });

  const feedback = await prisma.feedback.findUnique({
    where: { id: Number(feedbackId) },
    include: {
      work: {
        include: {
          challenge: {
            select: {
              progress: true,
            },
          },
        },
      },
    },
  });

  const userInfo = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  const isEditable = feedback.work.challenge.progress
    ? userInfo.role === 'ADMIN'
    : userInfo.role === 'ADMIN' || feedback.userId === userId;

  const hasNext = replies.length > limit;
  const nextCursor = hasNext ? replies[limit - 1].id : null;

  return {
    list: replies.slice(0, limit).map((reply) => ({
      ...reply,
      isEditable,
    })),
    meta: { hasNext, nextCursor },
  };
};
