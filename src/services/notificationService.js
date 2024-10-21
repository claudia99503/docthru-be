import prisma from '../lib/prisma.js';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';

const BATCH_SIZE = 100;

const formatDate = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
};

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
  NEW_REPLY: (challengeName, date) =>
    `'${challengeName}'의 피드백에 새로운 답글이 달렸어요 (${formatDate(
      date
    )})`,
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

export const createNotificationBatch = async (notifications) => {
  try {
    await prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });
    console.log(`${notifications.length} 개의 알림 생성 완료`);
  } catch (error) {
    console.error('알림 생성중 에러 :', error);
  }
};

const processNotifications = async (notifications) => {
  for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
    const batch = notifications.slice(i, i + BATCH_SIZE);
    await createNotificationBatch(batch);
  }
};

const notifyMultipleUsers = (notifications) => {
  setImmediate(() => processNotifications(notifications));
};

export const notifyChallengeStatusChange = (
  userIds,
  actorId,
  challengeId,
  challengeName,
  newStatus,
  date = new Date()
) => {
  const notifications = userIds
    .filter((userId) => userId !== actorId)
    .map((userId) => ({
      userId,
      type: 'CHALLENGE_STATUS',
      content: notificationTemplates.CHALLENGE_STATUS(
        challengeName,
        newStatus,
        date
      ),
      challengeId,
      createdAt: date,
      isRead: false,
    }));

  notifyMultipleUsers(notifications);
};

export const notifyNewWork = (
  userIds,
  actorId,
  challengeId,
  challengeName,
  workId,
  date = new Date()
) => {
  const notifications = userIds
    .filter((userId) => userId !== actorId)
    .map((userId) => ({
      userId,
      type: 'NEW_WORK',
      content: notificationTemplates.NEW_WORK(challengeName, date),
      challengeId,
      workId,
      createdAt: date,
      isRead: false,
    }));

  notifyMultipleUsers(notifications);
};

export const notifyNewReply = (
  userIds,
  actorId,
  challengeId,
  challengeName,
  workId,
  feedbackId,
  replyId,
  date = new Date()
) => {
  const notifications = userIds
    .filter((userId) => userId !== actorId)
    .map((userId) => ({
      userId,
      type: 'NEW_REPLY',
      content: notificationTemplates.NEW_REPLY(challengeName, date),
      challengeId,
      workId,
      feedbackId,
      createdAt: date,
      isRead: false,
    }));

  notifyMultipleUsers(notifications);
};

export const notifyNewFeedback = (
  userIds,
  actorId,
  challengeId,
  challengeName,
  workId,
  feedbackId,
  date = new Date()
) => {
  const notifications = userIds
    .filter((userId) => userId !== actorId)
    .map((userId) => ({
      userId,
      type: 'NEW_FEEDBACK',
      content: notificationTemplates.NEW_FEEDBACK(challengeName, date),
      challengeId,
      workId,
      feedbackId,
      createdAt: date,
      isRead: false,
    }));

  notifyMultipleUsers(notifications);
};

export const notifyDeadline = (
  userIds,
  actorId,
  challengeId,
  challengeName,
  date = new Date()
) => {
  const notifications = userIds
    .filter((userId) => userId !== actorId)
    .map((userId) => ({
      userId,
      type: 'DEADLINE',
      content: notificationTemplates.DEADLINE(challengeName, date),
      challengeId,
      createdAt: date,
      isRead: false,
    }));

  notifyMultipleUsers(notifications);
};

export const notifyContentChange = (
  userIds,
  actorId,
  entityType,
  challengeName,
  action,
  challengeId = null,
  workId = null,
  feedbackId = null,
  date = new Date()
) => {
  const notifications = userIds
    .filter((userId) => userId !== actorId)
    .map((userId) => ({
      userId,
      type: 'CHANGE',
      content: notificationTemplates.CONTENT_CHANGE(
        entityType,
        challengeName,
        action,
        date
      ),
      challengeId,
      workId,
      feedbackId,
      createdAt: date,
      isRead: false,
    }));

  notifyMultipleUsers(notifications);
};

export const getNotifications = async (userId, includeRead = false) => {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(includeRead ? {} : { isRead: false }),
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const markNotificationAsRead = async (id) => {
  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  if (!notification) {
    throw new NotFoundException('해당 알림을 찾을 수 없습니다.');
  }
  return notification;
};

export const markMultipleNotificationsAsRead = async (ids) => {
  try {
    await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { isRead: true },
    });
    return { message: `${ids.length}개의 알림을 읽음 처리했습니다.` };
  } catch (error) {
    console.error('읽음처리중 에러:', error);
    throw new BadRequestException('알림 읽음 처리 중 오류가 발생했습니다.');
  }
};
