import express from 'express';
import {
  getChallenges,
  getChallengeById,
  patchChallengeById,
} from '../controllers/challengeController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:challengeId', getChallengeById);
router.patch('/:challengeId', authenticateAccessToken, patchChallengeById);

export default router;
