import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', userController.register);
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
