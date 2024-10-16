import express from 'express';
import * as workController from '../controllers/workController.js';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';
import {
  authWorkAction,
  authCreateWorkAction,
} from '../middlewares/authWorkMiddleware.js';
import { authCreateFeedbackAction } from '../middlewares/authFeedbackMiddleware.js';

const router = express.Router();

// router.use(authenticateAccessToken); // 로그인 여부 확인
// router.use(authWorkAction); 본인, 어드민만 수정, 삭제되게끔
// router.use(authCreateWorkAction); 작성할 때 챌린지 참가 인원인지, 이미 글을 쓴 사람인지 체크

router.get(
  '/list/:challengeId',
  authenticateAccessToken,
  workController.worksList
);

router.get('/:workId', authenticateAccessToken, workController.works);

// 챌린지에 참가한 인원인지 권한 설정
router.post(
  '/:challengeId',
  authenticateAccessToken,
  authCreateWorkAction,
  workController.postWork
);

//본인, 어드민 계정만 수정되게끔
router.patch(
  '/:workId',
  authenticateAccessToken,
  authWorkAction,
  workController.editWork
);

//본인, 어드민 계정만 수정되게끔
router.delete(
  '/:workId',
  authenticateAccessToken,
  authWorkAction,
  workController.deleteWork
);

//좋아요
router.post('/:workId/likes', authenticateAccessToken, workController.likeWork);

router.delete(
  '/:workId/likes',
  authenticateAccessToken,
  workController.likeCancelWork
);

//피드백
router.get(
  '/:workId/feedbacks',
  authenticateAccessToken,
  workController.feedbacksWork
);

router.post(
  '/:workId/feedbacks',
  authenticateAccessToken,
  authCreateFeedbackAction,
  feedbackController.postFeedback
);

export default router;
