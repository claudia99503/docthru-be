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

export const validateUpdateReplyAccess = async (userId, replyId) => {
  await validateReplyAccess(userId, replyId, 'update');
};

export const validateDeleteReplyAccess = async (userId, replyId) => {
  await validateReplyAccess(userId, replyId, 'delete');
};

const validateReplyAccess = async (userId, replyId, action) => {
  if (action === 'create') {
    return;
  } else {
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
  }
};

export const postReplyByFeedbackId = async ({
  feedbackId,
  content,
  userId,
}) => {
  const reply = await prisma.reply.create({
    data: {
      content: content,
      userId: Number(userId),
      feedbackId: Number(feedbackId),
    },
  });

  await notifyCreateAboutReply(userId, feedbackId, reply);

  return reply;
};

export const updateReplyById = async ({ replyId, content, userId }) => {
  const reply = await prisma.reply.update({
    where: { id: Number(replyId) },
    data: { content },
  });

  await notifyAdminAboutReply(userId, replyId, '수정');

  return reply;
};

export const deleteReplyById = async ({ replyId, userId }) => {
  await notifyAdminAboutReply(userId, replyId, '삭제');

  await prisma.reply.delete({
    where: { id: Number(replyId) },
  });
};

const notifyCreateAboutReply = async (userId, feedbackId, reply) => {
  const feedbackInfo = await prisma.feedback.findUnique({
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

  if (!feedbackInfo) {
    throw new NotFoundException('해당 피드백이 존재하지 않습니다.');
  }

  const challengeInfo = feedbackInfo.work.challenge;

  if (!challengeInfo) {
    throw new NotFoundException('등록된 챌린지가 없습니다.');
  }

  await notificationService.notifyNewReply(
    Number(feedbackInfo.userId),
    Number(userId),
    Number(challengeInfo.id),
    challengeInfo.title,
    Number(feedbackInfo.workId),
    Number(reply.id),
    new Date()
  );
};

const notifyAdminAboutReply = async (userId, replyId, action) => {
  const [userInfo, replyInfo] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: Number(userId) },
    }),
    prisma.reply.findUnique({
      where: { id: Number(replyId) },
      include: { user: true, feedback: true },
    }),
  ]);

  if (!replyInfo) {
    throw new NotFoundException('등록된 대댓글이 없습니다.');
  }

  const challengeInfo = await prisma.challenge.findUnique({
    where: { id: Number(replyInfo.feedback.work.challengeId) },
  });

  if (!challengeInfo) {
    throw new NotFoundException('등록된 챌린지가 없습니다.');
  }

  if (userInfo && userInfo.role === 'ADMIN') {
    await notificationService.notifyContentChange(
      Number(replyInfo.user.id),
      Number(userId),
      'REPLY',
      challengeInfo.title,
      action === '삭제' ? '삭제' : '수정',
      null,
      null,
      Number(replyId)
    );
  }
};
