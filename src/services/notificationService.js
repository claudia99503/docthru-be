import prisma from '../lib/prisma.js';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';

export const getNotifications = async (userId, includeRead = false) => {
  try {
    return await prisma.notification.findMany({
      where: {
        userId,
        ...(includeRead ? {} : { isRead: false }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    throw new BadRequestException('알림 조회 중 오류가 발생했습니다.');
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    if (!notification) {
      throw new NotFoundException('해당 알림을 찾을 수 없습니다.');
    }
    return notification;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new BadRequestException('알림 상태 업데이트 중 오류가 발생했습니다.');
  }
};

export const createNotification = async (
  userId,
  type,
  content,
  relatedId = null,
  challengeId = null,
  workId = null,
  feedbackId = null
) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        content,
        relatedId,
        challengeId,
        workId,
        feedbackId,
      },
    });
  } catch (error) {
    throw new BadRequestException('알림 생성 중 오류가 발생했습니다.');
  }
};

export const notifyChallengeStatusChange = async (
  userId,
  challengeId,
  newStatus,
  changeDate
) => {
  let content;
  switch (newStatus) {
    case 'ACCEPTED':
      content = `신청하신 챌린지가 승인되었습니다.`;
      break;
    case 'REJECTED':
      content = `신청하신 챌린지가 거절되었습니다.`;
      break;
    case 'DELETED':
      content = `신청하신 챌린지가 삭제되었습니다.`;
      break;
    default:
      content = `신청하신 챌린지의 상태가 변경되었습니다.`;
  }
  content += ` (변경일: ${changeDate.toISOString().split('T')[0]})`;

  return createNotification(
    userId,
    'CHALLENGE_STATUS',
    content,
    null,
    challengeId
  );
};

export const notifyNewWork = async (userId, challengeId, workId) => {
  const changeDate = new Date();
  const content = `신청하신 챌린지에 새로운 작업물이 추가되었습니다. (추가 날짜: ${
    changeDate.toISOString().split('T')[0]
  })`;
  return createNotification(
    userId,
    'NEW_WORK',
    content,
    null,
    challengeId,
    workId
  );
};

export const notifyNewFeedback = async (userId, workId, feedbackId) => {
  const changeDate = new Date();
  const content = `작업물에 새로운 피드백이 추가되었습니다. (추가 날짜: ${
    changeDate.toISOString().split('T')[0]
  })`;
  return createNotification(
    userId,
    'NEW_FEEDBACK',
    content,
    null,
    null,
    workId,
    feedbackId
  );
};

export const notifyDeadline = async (userId, challengeId) => {
  const changeDate = new Date();
  const content = `신청하신 챌린지가 마감되었습니다. (마감 날짜: ${
    changeDate.toISOString().split('T')[0]
  })`;
  return createNotification(userId, 'DEADLINE', content, null, challengeId);
};

export const notifyAdminChallengeAction = async (
  userId,
  challengeId,
  action,
  reason
) => {
  const changeDate = new Date();
  const content = `관리자가 챌린지를 ${action}했습니다. 사유: ${reason} (처리 날짜: ${
    changeDate.toISOString().split('T')[0]
  })`;
  return createNotification(userId, 'ADMIN_ACTION', content, null, challengeId);
};

export const notifyContentChange = async (
  userId,
  entityType,
  entityName,
  action,
  changeDate = new Date()
) => {
  let content;
  switch (entityType) {
    case 'WORK':
      content = `신청하신 챌린지 "${entityName}"의 도전 작업물이 ${action}되었습니다.`;
      break;
    case 'CHALLENGE':
      content = `신청하신 챌린지 "${entityName}"가 ${action}되었습니다.`;
      break;
    case 'FEEDBACK':
      content = `작성하신 피드백 "${entityName}"이 ${action}되었습니다.`;
      break;
    default:
      content = `관련 내용이 ${action}되었습니다.`;
  }
  content += ` (${action} 날짜: ${changeDate.toISOString().split('T')[0]})`;

  return createNotification(
    userId,
    'CONTENT_CHANGE',
    content,
    null,
    entityType === 'CHALLENGE' ? entityName : null,
    entityType === 'WORK' ? entityName : null,
    entityType === 'FEEDBACK' ? entityName : null
  );
};

export const notifyAdminFeedbackAction = async (userId, feedbackId, action) => {
  const changeDate = new Date();
  const content = `관리자가 피드백을 ${action}했습니다. (처리 날짜: ${
    changeDate.toISOString().split('T')[0]
  })`;
  return createNotification(
    userId,
    'ADMIN_ACTION',
    content,
    null,
    null,
    null,
    feedbackId
  );
};
