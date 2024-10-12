import { PrismaClient } from '@prisma/client';
import express from 'express';
import * as workController from '../controllers/workController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/:challengeId/post', workController.postWork);
router.post('/:workId/likes', workController.likeWork);

router.patch('/list/:workId', workController.editWork);

router.delete('/:workId/delete', workController.deleteWork);
router.delete('/:workId/likesCancel', workController.likeCancelWork);

router.get('/list/:challengeId', workController.worksList);
router.get('/:workId', workController.works);
router.get('/:workId/feedbacks', workController.feedbacksWork);

export default router;
