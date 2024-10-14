import express from 'express';
import * as workController from '../controllers/workController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/:challengeId/post',
  authenticateAccessToken,
  workController.postWork
);
router.post('/:workId/likes', authenticateAccessToken, workController.likeWork);

router.patch('/list/:workId', authenticateAccessToken, workController.editWork);

router.delete(
  '/:workId/delete',
  authenticateAccessToken,
  workController.deleteWork
);
router.delete(
  '/:workId/likes',
  authenticateAccessToken,
  workController.likeCancelWork
);

router.get(
  '/list/:challengeId',
  authenticateAccessToken,
  workController.worksList
);
router.get('/:workId', authenticateAccessToken, workController.works);
router.get(
  '/:workId/feedbacks',
  authenticateAccessToken,
  workController.feedbacksWork
);

export default router;
