import express from 'express';
import * as workController from '../controllers/workController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';
import {
  authWorkAction,
  authCreateWorkAction,
} from '../middlewares/authWorkMiddleware.js';

const router = express.Router();

// router.use(authenticateAccessToken);
// router.use(authWorkAction); 본인, 어드민만 수정, 삭제되게끔
// router.use(authCreateWorkAction); 작성할 때 챌린지 참가 인원인지 체크

// 워크 id에 userId가 있으면 접근 제한

// 챌린지에 참가한 인원인지 권한 설정
router.post(
  '/:challengeId/post',
  authenticateAccessToken,
  authCreateWorkAction,
  workController.postWork
);

router.post('/:workId/likes', workController.likeWork);

//본인, 어드민 계정만 수정되게끔
router.patch('/:workId/edit', workController.editWork);

//본인, 어드민 계정만 수정되게끔
router.delete('/:workId/delete', workController.deleteWork);

router.delete('/:workId/likes', workController.likeCancelWork);

router.get('/list/:challengeId', workController.worksList);
router.get('/:workId', workController.works);
router.get('/:workId/feedbacks', workController.feedbacksWork);

export default router;
