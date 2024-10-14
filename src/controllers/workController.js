import * as workService from '../services/workServices.js';

//좋아요순으로 정렬 후 limit 5개씩 정렬
export const worksList = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.user;

    console.log(userId);

    const { page = 1, limit = 5 } = req.query;
    const worksWithIsLiked = await workService.getWorksWithLikes({
      challengeId,
      userId,
      page,
      limit,
    });
    res.status(200).json(worksWithIsLiked);
  } catch (error) {
    next(error);
  }
};

// 작업물 상세조회
export const works = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    console.log(userId);

    const workDetail = await workService.getWorkDetail({ workId, userId });
    res.status(200).json(workDetail);
  } catch (error) {
    next(error);
  }
};

// 챌린지 아이디에 따른 작업물 작성
export const postWork = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { description } = req.body;
    const { userId } = req.user;

    const newWork = await workService.createWork({
      challengeId,
      description,
      userId,
    });
    res.status(201).json({ newWork });
  } catch (error) {
    next(error);
  }
};

// 작업물 수정
export const editWork = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { description } = req.body;

    const updatedWork = await workService.updatedWork({ workId, description });
    res.status(201).json({ updatedWork });
  } catch (error) {
    next(error);
  }
};

//작업물 삭제하면 participate에서도 삭제
export const deleteWork = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    await workService.deleteWork({ workId, userId });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

//작업물에 좋아요
export const likeWork = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    await workService.likeWork({ workId, userId });
    res.status(200).json({ message: '좋아요가 추가됐습니다.' });
  } catch (error) {
    next(error);
  }
};

//작업물 좋아요 취소
export const likeCancelWork = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { userId } = req.user;

    await workService.likeCancelWork({ workId, userId });
    res.status(200).json({ message: '좋아요가 취소됐습니다.' });
  } catch (error) {
    next(error);
  }
};

//작업물 피드백 조회
export const feedbacksWork = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { page = 1, limit = 3 } = req.query;
    const feedbackData = await workService.getFeedbacks({
      workId,
      page,
      limit,
    });
    res.status(200).json(feedbackData);
  } catch (error) {
    next(error);
  }
};
