import * as feedbackService from '../services/feedbackService.js';

export const getFeedbacksWorkById = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { workId } = req.params;
    const { cursorId = null, limit = 3 } = req.query;

    const feedbackData = await feedbackService.getFeedbacksWorkById({
      workId,
      cursorId,
      limit,
      userId,
    });
    return res.status(200).json(feedbackData);
  } catch (error) {
    next(error);
  }
};

// 피드백 작성
export const postFeedbackById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    await feedbackService.validateCreateFeedbackAccess(workId);

    const newFeedback = await feedbackService.postFeedbackById({
      workId,
      content,
      userId,
    });

    return res.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

// 피드백 수정
export const updateFeedbackById = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    await feedbackService.validateFeedbackAccess(userId, feedbackId);

    const updateFeedback = await feedbackService.updateFeedbackById({
      feedbackId,
      content,
      userId,
    });
    return res.status(201).json(updateFeedback);
  } catch (error) {
    next(error);
  }
};

// 피드백 삭제
export const deleteFeedbackById = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { userId } = req.user;

    await feedbackService.validateFeedbackAccess(userId, feedbackId);

    await feedbackService.deleteFeedbackById({ feedbackId, userId });

    return res.status(200).json({ message: '피드백이 삭제됐습니다.' });
  } catch (error) {
    next(error);
  }
};
