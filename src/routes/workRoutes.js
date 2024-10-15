import express from 'express';
import * as workController from '../controllers/workController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';
import { authWorkAction } from '../middlewares/authWorkMiddleware.js';

const router = express.Router();

router.use(authenticateAccessToken);

// 챌린지에 참가한 인원인지 권한 설정
router.post('/:challengeId/post', workController.postWork);

router.post('/:workId/likes', workController.likeWork);

//본인, 어드민 계정만 수정되게끔
router.patch('/:workId/edit', authWorkAction, workController.editWork);

//본인, 어드민 계정만 수정되게끔
router.delete('/:workId/delete',authWorkAction, workController.deleteWork);

router.delete('/:workId/likes', workController.likeCancelWork);

router.get('/list/:challengeId', workController.worksList);
router.get('/:workId', workController.works);
router.get('/:workId/feedbacks', workController.feedbacksWork);

export default router;
