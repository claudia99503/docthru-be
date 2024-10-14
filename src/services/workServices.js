import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWorksWithLikes = async ({
  challengeId,
  userId,
  page,
  limit,
}) => {
  //마감하면 베스트 게시물 조회
  // const challengeDeadlineBoolean = await challengeDeadline(challengeId);

  // if (!!challengeDeadlineBoolean.progress) {
  //   const bestWorks = await bestWorksList(challengeId);

  //   console.log(bestWorks);
  // }

  const offset = (page - 1) * limit;

  let sortOrder = [
    { likeCount: 'desc' },
    { lastModifiedAt: 'desc' },
    { id: 'desc' },
  ];

  const works = await prisma.work.findMany({
    where: {
      challengeId: Number(challengeId),
    },
    orderBy: sortOrder,
    skip: offset,
    take: Number(limit),
    include: {
      likes: {
        select: {
          userId: true,
          workId: true,
        },
      },
    },
  });

  const total = await prisma.work.count({
    where: {
      challengeId: Number(challengeId),
    },
  });

  const worksWithIsLiked = works.map((work) => {
    const isLiked = userId
      ? work.likes.some(
          (like) => like.userId === userId && like.workId === work.id
        )
      : false;

    return {
      ...work,
      isLiked,
    };
  });

  return {
    totalPages: Math.ceil(total / limit),
    total,
    worksWithIsLiked,
  };
};

export const getWorkDetail = async ({ userId, workId }) => {
  const works = await prisma.work.findUnique({
    where: {
      id: Number(workId),
    },
    include: {
      challenge: {
        select: {
          title: true,
          field: true,
          docType: true,
        },
      },
      user: {
        select: {
          nickName: true,
        },
      },
    },
  });

  const likedId = await prisma.like.findFirst({
    where: {
      workId: Number(workId),
      userId: Number(userId),
    },
  });

  const isLike = likedId ? true : false;

  return { works, isLike };
};

export const createWork = async ({ challengeId, description, userId }) => {
  const works = await prisma.work.create({
    data: {
      description: description,
      userId: Number(userId),
      challengeId: Number(challengeId),
      isSubmitted: true,
    },
  });
  return works;
};

export const updatedWork = async ({ workId, description }) => {
  const works = await prisma.work.update({
    where: { id: Number(workId) },
    data: {
      description: description,
    },
  });
  return works;
};

export const deleteWork = async ({ workId, userId }) => {
  const participate = await prisma.participate.findFirst({
    where: {
      userId: Number(userId),
    },
  });

  await prisma.$transaction(async (prisma) => {
    await prisma.work.delete({
      where: {
        id: Number(workId),
      },
    });

    await prisma.participate.delete({
      where: {
        id: Number(participate.id),
      },
    });
  });
};

export const likeWork = async ({ workId, userId }) => {
  const challengeDeadlineBoolean = await challengeDeadlineWithWorkId(workId);

  if (!!!challengeDeadlineBoolean.progress) {
    await prisma.$transaction([
      prisma.like.create({
        data: {
          workId: Number(workId),
          userId: Number(userId),
        },
      }),
      prisma.work.update({
        where: { id: Number(workId) },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  } else {
    throw new Error('챌린지가 마감됐습니다.');
  }
};

export const likeCancelWork = async ({ workId, userId }) => {
  const challengeDeadlineBoolean = await challengeDeadlineWithWorkId(workId);

  if (!!!challengeDeadlineBoolean.progress) {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: Number(userId),
        workId: Number(workId),
      },
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        }),
        prisma.work.update({
          where: { id: Number(workId) },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);
    } else {
      throw new Error('좋아요가 존재하지 않습니다.');
    }
  } else {
    throw new Error('챌린지가 마감됐습니다.');
  }
};

export const getFeedbacks = async ({ workId, page, limit }) => {
  const offset = (page - 1) * limit;

  const feedbacks = await prisma.feedback.findMany({
    where: { workId: Number(workId) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    skip: offset,
    take: Number(limit),
    include: {
      user: {
        select: {
          nickName: true,
          grade: true,
        },
      },
    },
  });

  const total = await prisma.feedback.count({
    where: {
      workId: Number(workId),
    },
  });

  return { total, totalPages: Math.ceil(total / limit), feedbacks };
};

const challengeDeadlineWithWorkId = async (workId) => {
  const workInfo = await prisma.work.findFirst({
    where: {
      id: Number(workId),
    },
  });

  const challengeInfo = await prisma.challenge.findFirst({
    where: {
      id: Number(workInfo.challengeId),
    },
  });

  return challengeInfo;
};

const challengeDeadline = async (challengeId) => {
  const challengeInfo = await prisma.challenge.findFirst({
    where: {
      id: Number(challengeId),
    },
  });

  return challengeInfo;
};

const bestWorksList = async (challengeId) => {
  let sortOrder = [
    { likeCount: 'desc' },
    { lastModifiedAt: 'desc' },
    { id: 'desc' },
  ];

  const workList = await prisma.work.findMany({
    where: {
      challengeId: Number(challengeId),
    },
    orderBy: sortOrder,
  });

  const workLikeCount = workList.map((work) => {
    return work.likeCount;
  });

  const NumberLikeCount = Math.max(workLikeCount);

  // const bestWorkList = await prisma.work.findMany({
  //   where: {
  //     likeCount: Number(workLikeCount),
  //   },
  // });

  console.log(NumberLikeCount);
};
