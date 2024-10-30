import express from 'express';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';
import { validateProfileData } from '../validationSchemas/profileSchema.js';
import {
  getProfile,
  createProfile,
  updateProfile,
} from '../controllers/profileController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: 사용자 프로필 관련 API
 */

/**
 * @swagger
 * /api/profiles/{userId}:
 *   get:
 *     tags: [Profile]
 *     summary: 사용자 프로필 조회
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 프로필 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: 존재하지 않는 사용자
 *
 *   post:
 *     tags: [Profile]
 *     summary: 프로필 생성
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       201:
 *         description: 프로필 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: 이미 프로필이 존재함
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 존재하지 않는 사용자
 *
 *   put:
 *     tags: [Profile]
 *     summary: 프로필 수정
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               career:
 *                 type: string
 *               position:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferredFields:
 *                 type: array
 *                 items:
 *                   type: string
 *               githubUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 존재하지 않는 사용자
 */

router.get('/:userId', getProfile);

router.post('/:userId', authenticateAccessToken, createProfile);

router.put(
  '/:userId',
  authenticateAccessToken,
  validateProfileData,
  updateProfile
);

export default router;
