import express from 'express';
import {
  getChallenges,
  getChallengeById,
  patchChallengeById,
} from '../controllers/challengeController.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:challengeId', getChallengeById);
router.patch('/:challengeId', patchChallengeById);

export default router;
