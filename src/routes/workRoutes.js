import express from 'express';
import * as workController from '../controllers/workController.js';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.use(authenticateAccessToken); // 로그인 여부 확인
// router.use(authWorkAction); 본인, 어드민만 수정, 삭제되게끔
// router.use(authCreateWorkAction); 작성할 때 챌린지 참가 인원인지, 이미 글을 쓴 사람인지 체크

router.get(
  '/list/:challengeId',
  authenticateAccessToken,
  workController.getWorksListById
);

router.get('/:workId', authenticateAccessToken, workController.getWorkById);

// 챌린지에 참가한 인원인지 권한 설정
router.post(
  '/:challengeId',
  authenticateAccessToken,
  workController.postWorkById
);

//본인, 어드민 계정만 수정되게끔
router.patch(
  '/:workId',
  authenticateAccessToken,
  workController.updateWorkById
);

//본인, 어드민 계정만 수정되게끔
router.delete(
  '/:workId',
  authenticateAccessToken,
  workController.deleteWorkById
);

//좋아요
router.post(
  '/:workId/likes',
  authenticateAccessToken,
  workController.likeWorkById
);

router.delete(
  '/:workId/likes',
  authenticateAccessToken,
  workController.likeCancelWorkById
);

//피드백
router.get(
  '/:workId/feedbacks',
  authenticateAccessToken,
  workController.getFeedbacksWorkById
);

router.post(
  '/:workId/feedbacks',
  authenticateAccessToken,
  feedbackController.postFeedbackById
);

export default router;
