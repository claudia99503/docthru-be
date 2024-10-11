import express from 'express';
import {
  getChallenges,
  getChallengeById,
  patchChallengeById,
  deleteChallengeById,
} from '../controllers/challengeController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:challengeId', getChallengeById);
router.patch('/:challengeId', authenticateAccessToken, patchChallengeById);
router.delete('/:challengeId', authenticateAccessToken, deleteChallengeById);

export default router;
