import prisma from '../lib/prisma.js';

export const createFeedback = async ({ workId, content, userId }) => {
  const feedback = await prisma.feedback.create({
    data: {
      content: content,
      userId: Number(userId),
      workId: Number(workId),
    },
  });

  return feedback;
};

export const updateFeedback = async ({ feedbackId, content }) => {
  const feedback = await prisma.feedback.update({
    where: { id: Number(feedbackId) },
    data: {
      content: content,
    },
  });
  return feedback;
};

export const deleteFeedback = async ({ feedbackId }) => {
  await prisma.feedback.delete({
    where: {
      id: Number(feedbackId),
    },
  });
};
