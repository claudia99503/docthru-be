import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/token/refresh', userController.refreshToken);

router.use(authenticateAccessToken); // 인증 문제 있을 경우 제거할것

router.post('/logout', userController.logout);
router.get('/me', userController.getCurrentUser);
router.get('/:id', userController.getUserById);

router.get('/me/challenges/ongoing', userController.getOngoingChallenges);
router.get('/me/challenges/completed', userController.getCompletedChallenges);
router.get('/me/challenges/applications', userController.getAppliedChallenges);

export default router;
