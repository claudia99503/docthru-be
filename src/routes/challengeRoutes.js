import express from 'express';
import {
  getChallenges,
  getChallengeById,
  patchChallengeById,
  deleteChallengeById,
  getChallengesUrl,
  postChallengeParticipate,
} from '../controllers/challengeController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:challengeId', authenticateAccessToken, getChallengeById);
router.patch('/:challengeId', authenticateAccessToken, patchChallengeById);
router.delete('/:challengeId', authenticateAccessToken, deleteChallengeById);
router.get('/:challengeId/original', getChallengesUrl);
router.post(
  '/:challengeId/participations',
  authenticateAccessToken,
  postChallengeParticipate
);

export default router;
