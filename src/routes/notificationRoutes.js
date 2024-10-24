import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: 알림 관련 API
 */

/**
 * @swagger
 * /api/notifications/users/{userId}/notifications:
 *   get:
 *     tags: [Notification]
 *     summary: 알림 조회
 *     security:
 *       - bearerAuth: []
 *     description: 유저 아이디에 따른 알림 조회합니다.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: 유저 ID
 *         schema:
 *           type: integer
 *       - name: includeRead
 *         in: query
 *         required: true
 *         description: 읽음 항목
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
 *       401:
 *         description: 권한이 없음
 *       404:
 *         description: 알림 없음
 *       500:
 *         description: 서버 오류
 */

// 알림 조회
router.get(
  '/users/:userId/notifications',
  authenticateAccessToken,
  notificationController.getNotifications
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     tags:
 *       - Notification
 *     summary: 알림 읽음 처리
 *     security:
 *       - bearerAuth: []
 *     description: 특정 알림을 읽음 상태로 변경합니다
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 알림 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 알림이 읽음 처리되었습니다
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 알림을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

// 알림 읽음 처리
router.put(
  '/:id/read',
  authenticateAccessToken,
  notificationController.markAsRead
);

export default router;

// 특정 사용자의 알림을 조회
// includeRead 쿼리 파라미터로 읽은 알림 포함 여부를 제어 가능
// GET /api/users/:userId/notifications?includeRead=false:

// 특정 알림을 읽음처리
// PUT /api/notifications/:id/read:

// 사용 예시 : challengeService.js 내부
//
// import * as notificationService from './notificationService';
//
// const updateChallengeStatus = async (challengeId, newStatus) => {
//
//  (로직 본문..)
//
//   await notificationService.createNotification(
//     userId,
//     'CHALLENGE_STATUS',
//     `챌린지 상태가 ${newStatus}로 변경되었습니다.`,
//     null,
//     challengeId
//   );
// };
//
// 형태로 사용 가능
