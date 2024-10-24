import express from 'express';
import * as replyController from '../controllers/replyController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reply
 *   description: 대댓글 관련 API
 */

/**
 * @swagger
 * /api/replies/{replyId}:
 *   patch:
 *     tags: [Reply]
 *     summary: 대댓글 아이디에 따른 수정
 *     security:
 *       - bearerAuth: []
 *     description: 대댓글 아이디에 따른 대댓글을 수정합니다.
 *     parameters:
 *       - name: replyId
 *         in: path
 *         required: true
 *         description: 대댓글 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 대댓글 내용
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: 대댓글 수정 성공
 *       401:
 *         description: 권한이 없음
 *       404:
 *         description: 대댓글이 없음
 *       500:
 *         description: 서버 오류
 */
//본인, 어드민 계정만 수정되게끔
router.patch(
  '/:replyId',
  authenticateAccessToken,
  replyController.updateReplyById
);

/**
 * @swagger
 * /api/replies/{replyId}:
 *   delete:
 *     tags: [Reply]
 *     summary: 대댓글 삭제
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: replyId
 *         in: path
 *         required: true
 *         description: 대댓글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 대댓글 삭제 성공
 *       401:
 *         description: 권한이 없음
 *       404:
 *         description: 대댓글을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

//본인, 어드민 계정만 삭제되게끔
router.delete(
  '/:replyId',
  authenticateAccessToken,
  replyController.deleteReplyById
);

/**
 * @swagger
 * /api/replies/{feedbackId}:
 *   get:
 *     tags:
 *       - Reply
 *     summary: 특정 피드백의 답글 목록 조회
 *     security:
 *       - bearerAuth: []
 *     description: 특정 피드백의 답글 목록을 cursor 기반 페이지네이션으로 조회합니다
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         description: 피드백 ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: cursorId
 *         required: false
 *         description: 마지막으로 받은 답글의 ID (페이지네이션)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         description: 한 번에 가져올 답글 개수
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       userId:
 *                         type: integer
 *                       feedbackId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           nickname:
 *                             type: string
 *                           grade:
 *                             type: string
 *                       isEditable:
 *                         type: boolean
 *                 meta:
 *                   type: object
 *                   properties:
 *                     hasNext:
 *                       type: boolean
 *                     nextCursor:
 *                       type: integer
 *                       nullable: true
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 피드백을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:feedbackId', authenticateAccessToken, replyController.getReplies);

export default router;
