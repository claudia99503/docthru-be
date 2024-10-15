import express from 'express';
import * as workController from '../controllers/workController.js';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';
import {
  authWorkAction,
  authCreateWorkAction,
} from '../middlewares/authWorkMiddleware.js';

const router = express.Router();

// router.use(authenticateAccessToken);
// router.use(authWorkAction); 본인, 어드민만 수정, 삭제되게끔
// router.use(authCreateWorkAction); 작성할 때 챌린지 참가 인원인지, 이미 글을 쓴 사람인지 체크

// 챌린지에 참가한 인원인지 권한 설정
router.post(
  '/:challengeId/post',
  authenticateAccessToken,
  authCreateWorkAction,
  workController.postWork
);

router.post('/:workId/likes', workController.likeWork);

router.post('/:workId/feedbacks', feedbackController.postFeedback);

//본인, 어드민 계정만 수정되게끔
router.patch(
  '/:workId/edit',
  authenticateAccessToken,
  authWorkAction,
  workController.editWork
);

//본인, 어드민 계정만 수정되게끔
router.delete('/:workId/delete', workController.deleteWork);

router.delete('/:workId/likes', workController.likeCancelWork);

router.get(
  '/list/:challengeId',
  authenticateAccessToken,
  workController.worksList
);
router.get('/:workId', workController.works);
router.get('/:workId/feedbacks', workController.feedbacksWork);

export default router;
