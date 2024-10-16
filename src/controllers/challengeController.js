import { ForbiddenException } from '../errors/customException.js';
import { ChallengeService } from '../services/challengeServices.js';

export async function getChallenges(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.orderByField || 'id';
    const sortOrder = req.query.orderByDir || 'asc';

    const list = await ChallengeService.getChallenges({
      page,
      limit,
      sortBy,
      sortOrder,
    });
    return res.status(200).json({ list });
  } catch (error) {
    next(error);
  }
}

export async function getChallengeById(req, res, next) {
  try {
    const { challengeId } = req.params;
    const challenge = await ChallengeService.getChallengeById(challengeId);

    return res.status(200).json(challenge);
  } catch (error) {
    next(error);
  }
}

export async function patchChallengeById(req, res, next) {
  try {
    const userId = req.user.userId;
    const { role } = await ChallengeService.getCurrentUser(userId);

    if (role !== 'ADMIN') {
      return next(new ForbiddenException());
    }

    const { challengeId } = req.params;
    const updateData = req.body;

    const updatedChallenge = await ChallengeService.updateChallengeById(
      challengeId,
      updateData
    );

    return res.status(200).json(updatedChallenge);
  } catch (error) {
    next(error);
  }
}

export async function updateChallengeStatus(req, res, next) {
  try {
    const userId = req.user.userId;
    const { role } = await ChallengeService.getCurrentUser(userId);

    if (role !== 'ADMIN') {
      return next(new ForbiddenException());
    }

    const { challengeId } = req.params;
    const { newStatus, reason } = req.body;

    const updatedChallenge = await ChallengeService.updateChallengeStatus(
      challengeId,
      newStatus,
      reason
    );

    return res.status(200).json(updatedChallenge);
  } catch (error) {
    next(error);
  }
}

export async function deleteChallengeById(req, res, next) {
  try {
    const userId = req.user.userId;
    const { role } = await ChallengeService.getCurrentUser(userId);
    const { reason } = req.body;

    if (role !== 'ADMIN') {
      return next(new ForbiddenException());
    }

    const { challengeId } = req.params;
    await ChallengeService.updateChallengeStatus(
      challengeId,
      'DELETED',
      reason
    );

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function getChallengesUrl(req, res, next) {
  try {
    const { challengeId } = req.params;
    const challenges = await ChallengeService.getChallengesUrl(challengeId);
    return res.status(200).json(challenges);
  } catch (error) {
    next(error);
  }
}

export async function postChallengeParticipate(req, res, next) {
  try {
    const { challengeId } = req.params;
    const { userId } = req.user;
    const Participation = await ChallengeService.postChallengeParticipate(
      challengeId,
      userId
    );
    return res.status(201).json(Participation);
  } catch (error) {
    next(error);
  }
}
