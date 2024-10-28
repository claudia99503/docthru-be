import express from 'express';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';
import { validateProfileData } from '../validationSchemas/profileSchema.js';
import {
  getProfile,
  createProfile,
  updateProfile,
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/:userId', getProfile);

router.post('/:userId', authenticateAccessToken, createProfile);

router.put(
  '/:userId',
  authenticateAccessToken,
  validateProfileData,
  updateProfile
);

export default router;
