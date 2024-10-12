import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWorksWithLikes = async (challengeId, userId, page, limit) => {
  const offset = (page - 1) * limit;

  const works = await prisma.work.findMany({
    where: {
      challengeId: Number(challengeId),
    },
    orderBy: [
      { likeCount: 'desc' },
      { lastModifiedAt: 'desc' },
      { id: 'desc' },
    ],
    skip: offset,
    take: 5,
    include: {
      like: true, // likes 관계를 포함
    },
  });

  const total = await prisma.work.count({
    where: {
      challengeId: Number(challengeId),
    },
  });

  const likes = await prisma.like.findMany({
    where: {
      workId: Number(1), // 특정 workId에 대한 likes 조회
    },
  });
  console.log(likes);

  // const worksWithIsLiked = works.map((work) => {
  //   const isLiked = userId
  //     ? work.like.some(
  //         (isLike) => isLike.userId === userId && isLike.workId === work.id
  //       )
  //     : false;

  //   return {
  //     ...work,
  //     isLiked,
  //   };
  // });

  // console.log(works[0].like);

  return {
    totalPages: Math.ceil(total / limit),
    total,
    works,
    // worksWithIsLiked,
  };
};

export const getWorkDetail = async (userId, workId) => {
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

export const createWork = async (challengeId, description, userId) => {
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

export const updatedWork = async (workId, description) => {
  const works = await prisma.work.update({
    where: { id: Number(workId) },
    data: {
      description: description,
    },
  });
  return works;
};

export const deleteWork = async (workId, userId) => {
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

export const likeWork = async (workId, userId) => {
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
};

export const likeCancelWork = async (workId, userId) => {
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
};

export const getFeedbacks = async (workId, page, limit) => {
  const offset = (page - 1) * limit;

  const feedbacks = await prisma.feedback.findMany({
    where: { workId: Number(workId) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    skip: offset,
    take: 3,
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
