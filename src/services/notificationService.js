import prisma from '../lib/prisma';
import {
  NotFoundException,
  BadRequestException,
} from '../errors/customException.js';

// 알림 조회
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

// 읽음 표시하기
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

// 알림 생성 함수
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

// 변경사항 알림
export const notifyChangeEvent = async (
  userId,
  entityType,
  entityId,
  changeType
) => {
  const content = `${entityType}이(가) ${changeType}되었습니다.`;
  return createNotification(userId, 'CHANGE', content, entityId);
};

// 챌린지 상태 변경 알림
export const notifyChallengeStatusChange = async (
  userId,
  challengeId,
  newStatus
) => {
  const content = `신청하신 챌린지의 상태가 ${newStatus}(으)로 변경되었습니다.`;
  return createNotification(
    userId,
    'CHALLENGE_STATUS',
    content,
    null,
    challengeId
  );
};

// 새 작업물 알림
export const notifyNewWork = async (userId, challengeId, workId) => {
  const content = `신청하신 챌린지에 새로운 작업물이 추가되었습니다.`;
  return createNotification(
    userId,
    'NEW_WORK',
    content,
    null,
    challengeId,
    workId
  );
};

// 새 피드백 알림
export const notifyNewFeedback = async (userId, workId, feedbackId) => {
  const content = `작업물에 새로운 피드백이 추가되었습니다.`;
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

// 마감 알림
export const notifyDeadline = async (userId, challengeId) => {
  const content = `신청하신 챌린지가 마감되었습니다.`;
  return createNotification(userId, 'DEADLINE', content, null, challengeId);
};

// 관리자 챌린지 액션 알림
export const notifyAdminChallengeAction = async (
  userId,
  challengeId,
  action,
  reason
) => {
  const content = `관리자가 챌린지를 ${action}했습니다. 사유: ${reason}`;
  return createNotification(userId, 'ADMIN_ACTION', content, null, challengeId);
};

// 관리자 피드백 액션 알림
export const notifyAdminFeedbackAction = async (userId, feedbackId, action) => {
  const content = `관리자가 피드백을 ${action}했습니다.`;
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