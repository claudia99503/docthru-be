import prisma from '../lib/prisma.js';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';

// 유틸리티 함수
const formatDate = (date) => date.toISOString().split('T')[0];

// 알림 템플릿
const notificationTemplates = {
  CHALLENGE_STATUS: (challengeName, status, date) =>
    `'${challengeName}'이 ${status}되었어요 (${formatDate(date)})`,
  NEW_WORK: (challengeName, date) =>
    `'${challengeName}'에 작업물이 추가되었어요 (${formatDate(date)})`,
  NEW_FEEDBACK: (challengeName, date) =>
    `'${challengeName}'에 도전한 작업물에 피드백이 추가되었어요 (${formatDate(
      date
    )})`,
  DEADLINE: (challengeName, date) =>
    `'${challengeName}'이 마감되었어요 (${formatDate(date)})`,
  CONTENT_CHANGE: (entityType, challengeName, action, date) => {
    switch (entityType) {
      case 'CHALLENGE':
        return `'${challengeName}'이 ${action}되었어요 (${formatDate(date)})`;
      case 'WORK':
        return `'${challengeName}'에 도전한 작업물이 ${action}되었어요 (${formatDate(
          date
        )})`;
      case 'FEEDBACK':
        return `'${challengeName}'의 작업물에 작성한 피드백이 ${action}되었어요 (${formatDate(
          date
        )})`;
      default:
        return `관련 내용이 ${action}되었어요 (${formatDate(date)})`;
    }
  },
};

// 에러 핸들링 래퍼 함수
const asyncErrorHandler =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('작업 중 오류가 발생했습니다.');
    }
  };

// 알림 생성 함수
const createTypedNotification = async (
  userId,
  actorId,
  type,
  content,
  challengeId = null,
  workId = null,
  feedbackId = null
) => {
  // 자신의 액션에 대해서는 알림을 생성하지 않음
  if (userId === actorId) {
    return null;
  }

  return prisma.notification.create({
    data: { userId, type, content, challengeId, workId, feedbackId },
  });
};

export const getNotifications = asyncErrorHandler(
  async (userId, includeRead = false) => {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(includeRead ? {} : { isRead: false }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
);

export const markNotificationAsRead = asyncErrorHandler(async (id) => {
  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  if (!notification) {
    throw new NotFoundException('해당 알림을 찾을 수 없습니다.');
  }
  return notification;
});

// 챌린지 상태 변경 알림
export const notifyChallengeStatusChange = asyncErrorHandler(
  async (
    userId,
    actorId,
    challengeId,
    challengeName,
    newStatus,
    date = new Date()
  ) => {
    const content = notificationTemplates.CHALLENGE_STATUS(
      challengeName,
      newStatus,
      date
    );
    return createTypedNotification(
      userId,
      actorId,
      'CHALLENGE_STATUS',
      content,
      challengeId
    );
  }
);

// 새 작업물 추가 알림
export const notifyNewWork = asyncErrorHandler(
  async (
    userId,
    actorId,
    challengeId,
    challengeName,
    workId,
    date = new Date()
  ) => {
    const content = notificationTemplates.NEW_WORK(challengeName, date);
    return createTypedNotification(
      userId,
      actorId,
      'NEW_WORK',
      content,
      challengeId,
      workId
    );
  }
);

// 새 피드백 추가 알림
export const notifyNewFeedback = asyncErrorHandler(
  async (
    userId,
    actorId,
    challengeId,
    challengeName,
    workId,
    feedbackId,
    date = new Date()
  ) => {
    const content = notificationTemplates.NEW_FEEDBACK(challengeName, date);
    return createTypedNotification(
      userId,
      actorId,
      'NEW_FEEDBACK',
      content,
      challengeId,
      workId,
      feedbackId
    );
  }
);

// 챌린지 마감 알림
export const notifyDeadline = asyncErrorHandler(
  async (userId, actorId, challengeId, challengeName, date = new Date()) => {
    const content = notificationTemplates.DEADLINE(challengeName, date);
    return createTypedNotification(
      userId,
      actorId,
      'DEADLINE',
      content,
      challengeId
    );
  }
);

// 콘텐츠 변경 알림 (챌린지, 작업물, 피드백)
export const notifyContentChange = asyncErrorHandler(
  async (
    userId,
    actorId,
    entityType,
    challengeName,
    action,
    challengeId = null,
    workId = null,
    feedbackId = null,
    date = new Date()
  ) => {
    const content = notificationTemplates.CONTENT_CHANGE(
      entityType,
      challengeName,
      action,
      date
    );
    return createTypedNotification(
      userId,
      actorId,
      'CHANGE',
      content,
      challengeId,
      workId,
      feedbackId
    );
  }
);

// 여러 사용자에게 알림을 보내는 유틸리티 함수
export const notifyMultipleUsers = asyncErrorHandler(
  async (userIds, notificationFunction, ...args) => {
    const notifications = await Promise.all(
      userIds.map((userId) => notificationFunction(userId, ...args))
    );
    return notifications.filter((notification) => notification !== null);
  }
);
