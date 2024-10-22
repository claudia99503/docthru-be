import * as workService from '../services/workServices.js';

//좋아요순으로 정렬 후 limit 5개씩 정렬
export const getWorksListById = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.user;

    const { page = 1, limit = 5 } = req.query;
    const worksWithIsLiked = await workService.getWorksListById({
      challengeId,
      userId,
      page,
      limit,
    });
    return res.status(200).json(worksWithIsLiked);
  } catch (error) {
    next(error);
  }
};

// 작업물 상세조회
export const getWorkById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    const workDetail = await workService.getWorkById({ workId, userId });
    return res.status(200).json(workDetail);
  } catch (error) {
    next(error);
  }
};

// 챌린지 아이디에 따른 작업물 작성
export const postWorkById = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    await workService.checkCreateWorkAuthorization(userId, challengeId);

    const newWork = await workService.postWorkById({
      challengeId,
      content,
      userId,
    });
    return res.status(201).json(newWork);
  } catch (error) {
    next(error);
  }
};

// 작업물 수정
export const updateWorkById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    await workService.checkWorkAuthorization(userId, workId);

    const updatedWork = await workService.updateWorkById({
      workId,
      content,
      userId,
    });
    return res.status(201).json(updatedWork);
  } catch (error) {
    next(error);
  }
};

//작업물 삭제하면 participate에서도 삭제
export const deleteWorkById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    await workService.checkWorkAuthorization(userId, workId);

    await workService.deleteWorkById({ workId, userId });
    return res.status(200).json({ message: '작업물이 삭제됐습니다.' });
  } catch (error) {
    next(error);
  }
};

//작업물에 좋아요
export const likeWorkById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    await workService.likeWorkById({ workId, userId });
    return res.status(200).json({ message: '좋아요가 추가됐습니다.' });
  } catch (error) {
    next(error);
  }
};

//작업물 좋아요 취소
export const likeCancelWorkById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    await workService.likeCancelWorkById({ workId, userId });
    return res.status(200).json({ message: '좋아요가 취소됐습니다.' });
  } catch (error) {
    next(error);
  }
};
