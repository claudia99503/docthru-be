import prisma from '../lib/prisma.js';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';

// 유틸리티 함수
const formatDate = (date) => date.toISOString().split('T')[0];

// 알림 템플릿 (기존과 동일한 형태입니다~)
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

// 에러 핸들링 래퍼 함수 (기존과 동일)
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

// 트랜잭션을 사용한 벌크 삽입
const createNotificationsInTransaction = async (notifications) => {
  return prisma.$transaction(async (prisma) => {
    return prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });
  });
};

// 알림 생성 함수 (수정됨)
const createTypedNotification = (
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

  return {
    userId,
    type,
    content,
    challengeId,
    workId,
    feedbackId,
    createdAt: new Date(),
    isRead: false,
  };
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

// 여러 사용자에게 알림을 보내는 유틸리티 함수 (수정됨)
export const notifyMultipleUsers = asyncErrorHandler(
  async (userIds, notificationFunction, ...args) => {
    const notifications = userIds
      .map((userId) => notificationFunction(userId, ...args))
      .filter((notification) => notification !== null);

    if (notifications.length > 0) {
      await createNotificationsInTransaction(notifications);
    }

    return notifications;
  }
);

// 기존의 알림 함수들 (약간 수정됨)
export const notifyChallengeStatusChange = (
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
};

export const notifyNewWork = (
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
};

export const notifyNewFeedback = (
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
};

export const notifyDeadline = (
  userId,
  actorId,
  challengeId,
  challengeName,
  date = new Date()
) => {
  const content = notificationTemplates.DEADLINE(challengeName, date);
  return createTypedNotification(
    userId,
    actorId,
    'DEADLINE',
    content,
    challengeId
  );
};

export const notifyContentChange = (
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
};
