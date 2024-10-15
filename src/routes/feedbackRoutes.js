import express from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';
import {
  authWorkAction,
  authCreateWorkAction,
} from '../middlewares/authWorkMiddleware.js';

const router = express.Router();

//본인, 어드민 계정만 수정되게끔
router.put('/:feedbackId', feedbackController.editFeedback);

//본인, 어드민 계정만 수정되게끔
router.delete('/:feedbackId', feedbackController.deleteFeedback);

export default router;
