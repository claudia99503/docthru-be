import * as profileService from '../services/profileService.js';
import { ForbiddenException } from '../errors/customException.js';

export const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const profile = await profileService.getProfile(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== parseInt(userId)) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const profile = await profileService.createProfile(userId);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== parseInt(userId)) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const profile = await profileService.updateProfile(userId, req.body);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
