import prisma from '../lib/prisma.js';
import { ForbiddenException } from '../errors/customException.js';
import { ChallengeService } from '../services/challengeServices.js';

export async function getChallenges(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.orderByField || 'id';
    const sortOrder = req.query.orderByDir || 'asc';
    const field = req.query.field ? req.query.field.split(',') : undefined;
    const docType = req.query.docType || undefined;
    const progress = req.query.progress
      ? req.query.progress === 'true'
      : undefined;
    const keyword = req.query.keyword || undefined;

    const result = await ChallengeService.getChallenges({
      page,
      limit,
      sortBy,
      sortOrder,
      field,
      docType,
      progress,
      keyword,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getApplication(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder || 'asc';
    const keyword = req.query.keyword;
    const userId = req.user.userId;
    const { role } = await ChallengeService.getCurrentUser(userId);

    if (role !== 'ADMIN') {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    const sortOptions = {};
    if (
      sortBy === 'status' ||
      sortBy === 'updatedAt' ||
      sortBy === 'deadline'
    ) {
      sortOptions[sortBy] = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const keywordConditions = {};
    if (keyword) {
      keywordConditions.title = {
        contains: keyword,
        mode: 'insensitive',
      };
    }
    if (sortBy === 'status' && req.query.sortOrder) {
      keywordConditions.status = {
        equals: req.query.sortOrder,
      };
    }

    const challenge = await prisma.challenge.findMany({
      where: keywordConditions,
      skip,
      take,
      orderBy: sortOptions,
    });

    const totalCount = await prisma.challenge.count({
      where: keywordConditions,
    });

    return res.status(200).json({
      challenge,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    next(error);
  }
}

export const createChallenge = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const data = req.body;

    const newChallenge = await prisma.challenge.create({
      data: {
        ...data,
        userId,
        userId,
      },
    });
    return res
      .status(201)
      .json({ message: '신청이 성공적으로 완료되었습니다.', newChallenge });
  } catch (error) {
    next(error);
  }
};

export async function getChallengeById(req, res, next) {
  try {
    const { challengeId } = req.params;
    const { userId } = req.user;
    const { role } = await ChallengeService.getCurrentUser(userId);
    const challenge = await ChallengeService.getChallengeById(
      challengeId,
      userId
    );

    if (role === 'ADMIN') {
      challenge.isAdmin = true;
    } else {
      challenge.isAdmin = false;
    }
    return res.status(200).json(challenge);
  } catch (error) {
    next(error);
  }
}

export async function patchChallengeById(req, res, next) {
  try {
    const adminUserId = req.user.userId;
    const { role } = await ChallengeService.getCurrentUser(adminUserId);

    if (role !== 'ADMIN') {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    const { challengeId } = req.params;
    const updateData = req.body;

    const updatedChallenge = await ChallengeService.updateChallengeById(
      challengeId,
      updateData,
      adminUserId
    );

    return res.status(200).json(updatedChallenge);
  } catch (error) {
    next(error);
  }
}

/**
 * @swagger
 * /challenges/{challengeId}/status:
 *   patch:
 *     summary: 챌린지 상태 업데이트
 *     description: 관리자가 챌린지의 상태를 업데이트합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 챌린지 ID
 *         schema:
 *           type: string
 *       - in: body
 *         name: statusData
 *         description: 새로운 상태 및 사유
 *         schema:
 *           type: object
 *           properties:
 *             newStatus:
 *               type: string
 *               enum: [ACTIVE, INACTIVE, DELETED]
 *             reason:
 *               type: string
 *     responses:
 *       200:
 *         description: 업데이트된 챌린지 정보
 *       403:
 *         description: 관리자 권한 부족
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function updateChallengeStatus(req, res, next) {
  try {
    const adminUserId = req.user.userId;
    const { role } = await ChallengeService.getCurrentUser(adminUserId);

    if (role !== 'ADMIN') {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    const { challengeId } = req.params;
    const { newStatus } = req.body;

    const updatedChallenge = await ChallengeService.updateChallengeStatus(
      challengeId,
      newStatus,
      adminUserId
    );

    return res.status(200).json(updatedChallenge);
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
    const participation = await ChallengeService.postChallengeParticipate(
      challengeId,
      userId
    );
    return res.status(201).json(participation);
  } catch (error) {
    next(error);
  }
}

export async function deleteChallengeParticipation(req, res, next) {
  try {
    const { challengeId } = req.params;
    const { userId } = req.user;
    const result = await ChallengeService.deleteChallengeParticipation(
      challengeId,
      userId
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function cancelChallenge(req, res, next) {
  try {
    const userId = req.user.userId;
    const { challengeId } = req.params;

    const result = await ChallengeService.hardDeleteChallengeById(
      challengeId,
      userId
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
