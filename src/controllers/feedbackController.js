import * as feedbackService from '../services/feedbackService.js';

// 피드백 작성
export const postFeedbackById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    const newFeedback = await feedbackService.postFeedbackById({
      workId,
      content,
      userId,
    });

    res.status(201).json(newFeedback);
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

    const updateFeedback = await feedbackService.updateFeedbackById({
      feedbackId,
      content,
      userId,
    });
    res.status(201).json(updateFeedback);
  } catch (error) {
    next(error);
  }
};

//피드백삭제
export const deleteFeedbackById = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { userId } = req.user;

    await feedbackService.deleteFeedbackById({ feedbackId, userId });

    res.status(200).json({ message: '피드백이 삭제됐습니다.' });
  } catch (error) {
    next(error);
  }
};
