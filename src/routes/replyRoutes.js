// replyRoutes.js

import express from 'express';
import * as replyController from '../controllers/replyController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

//본인, 어드민 계정만 수정되게끔
router.patch(
  '/:replyId',
  authenticateAccessToken,
  replyController.updateReplyById
);

//본인, 어드민 계정만 삭제되게끔
router.delete(
  '/:replyId',
  authenticateAccessToken,
  replyController.deleteReplyById
);

export default router;
