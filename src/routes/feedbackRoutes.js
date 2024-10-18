import express from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

//본인, 어드민 계정만 수정되게끔
router.patch(
  '/:feedbackId',
  authenticateAccessToken,
  feedbackController.updateFeedbackById
);

//본인, 어드민 계정만 수정되게끔
router.delete(
  '/:feedbackId',
  authenticateAccessToken,
  feedbackController.deleteFeedbackById
);

export default router;
