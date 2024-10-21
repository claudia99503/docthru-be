// replyController.js

import * as replyService from '../services/replyService.js';

// 대댓글 작성
export const postReplyById = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;

    await replyService.validateCreateReplyAccess({ userId, feedbackId });

    const newReply = await replyService.postReplyByFeedbackId({
      feedbackId,
      userId,
      content,
    });

    res.status(201).json(newReply);
  } catch (error) {
    next(error);
  }
};

// 대댓글 수정
export const updateReplyById = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;

    const updatedReply = await replyService.updateReplyById({
      replyId,
      userId,
      content,
    });

    res.status(200).json({ data: updatedReply });
  } catch (error) {
    next(error);
  }
};

// 대댓글 삭제
export const deleteReplyById = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const { userId } = req.user;

    await replyService.deleteReplyById({ replyId, userId });

    res.status(200).json({ message: '댓글 삭제가 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 대댓글 목록 조회
export const getRepliesByFeedbackId = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const replies = await replyService.getRepliesByFeedbackId(feedbackId);
    res.status(200).json({ data: replies });
  } catch (error) {
    next(error);
  }
};
