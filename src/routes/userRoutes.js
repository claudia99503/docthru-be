import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: 사용자 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       409:
 *         description: 잘못된 전송입니다
 */

router.post('/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: 사용자 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 로그인 실패
 */

router.post('/login', userController.login);

router.post('/token/refresh', userController.refreshToken);
router.post('/logout', userController.logout);
router.get('/me', userController.getCurrentUser);

router.use(authenticateAccessToken);

router.get('/:id', userController.getUserById);
router.get('/me/challenges/ongoing', userController.getOngoingChallenges);
router.get('/me/challenges/completed', userController.getCompletedChallenges);
router.get('/me/challenges/applications', userController.getAppliedChallenges);

export default router;
