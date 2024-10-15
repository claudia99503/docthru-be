import * as notificationService from '../services/notificationService';
import { BadRequestException } from '../errors/customException.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const includeRead = req.query.includeRead === 'true';
    if (isNaN(userId)) {
      throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
    }
    const notifications = await notificationService.getNotifications(
      userId,
      includeRead
    );
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.id);
    if (isNaN(notificationId)) {
      throw new BadRequestException('유효하지 않은 알림 ID입니다.');
    }
    const updatedNotification =
      await notificationService.markNotificationAsRead(notificationId);
    res.json(updatedNotification);
  } catch (error) {
    next(error);
  }
};
