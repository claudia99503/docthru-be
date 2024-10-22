// replyRoutes.js

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

export default router;
