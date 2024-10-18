import prisma from '../lib/prisma.js';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '../errors/customException.js';
import * as notificationService from './notificationService.js';

export const getWorksListById = async ({
  challengeId,
  userId,
  page,
  limit,
}) => {
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
    include: { likes: true, user: true },
  });

  const worksList = works.map((work) => {
    const isLiked = work.likes.some((like) => like.userId === userId);
    return {
      ...work,
      isLiked,
    };
  });

  const data = worksList.map((workList) => ({
    id: workList.id,
    userId: workList.userId,
    nickname: workList.user.nickname,
    grade: workList.user.grade,
    challengeId: workList.challengeId,
    content: workList.content,
    lastModifiedAt: workList.lastModifiedAt,
    likeCount: workList.likeCount,
    isLiked: workList.isLiked,
  }));

  //마감하면 베스트 게시물 조회
  const bestWorks = await bestWorksList({ challengeId, userId, sortOrder });

  const totalCount = await prisma.work.count({
    where: {
      challengeId: Number(challengeId),
    },
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    meta: { totalPages, totalCount, currentPage: Number(page) },
    bestList: bestWorks,
    list: data,
  };
};

export const getWorkById = async ({ userId, workId }) => {
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
          nickname: true,
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

  return {
    userId: works.id,
    nickname: works.user.nickname,
    content: works.content,
    lastModifiedAt: works.lastModifiedAt,
    likeCount: works.likeCount,
    isLike,
    challenge: {
      id: works.challengeId,
      title: works.challenge.title,
      field: works.challenge.field,
      docType: works.challenge.docType,
    },
  };
};

export const postWorkById = async ({ challengeId, content, userId }) => {
  if (!content) {
    throw new BadRequestException('내용 입력은 필수입니다.');
  }

  const works = await prisma.work.create({
    data: {
      content: content,
      userId: Number(userId),
      challengeId: Number(challengeId),
      isSubmitted: true,
    },
    select: {
      id: true,
      userId: true,
      challengeId: true,
      content: true,
      lastModifiedAt: true,
    },
  });

  await notifyCreateAboutWork(userId, challengeId, works);

  return works;
};

export const updateWorkById = async ({ workId, content, userId }) => {
  if (!content) {
    throw new BadRequestException('내용 입력은 필수입니다.');
  }

  const works = await prisma.work.update({
    where: { id: Number(workId) },
    data: {
      content: content,
    },
    select: {
      id: true,
      userId: true,
      challengeId: true,
      content: true,
      lastModifiedAt: true,
    },
  });

  await notifyAdminAboutWork(userId, workId, '수정');

  return works;
};

export const deleteWorkById = async ({ workId, userId }) => {
  const workInfo = await notifyAdminAboutWork(userId, workId, '삭제');

  const participateInfo = await prisma.participation.findFirst({
    where: {
      userId: Number(workInfo.userId),
    },
  });

  await prisma.$transaction(async (prisma) => {
    await prisma.work.delete({
      where: {
        id: Number(workId),
      },
    });

    await prisma.participation.delete({
      where: {
        id: Number(participateInfo.id),
      },
    });

    await prisma.challenge.update({
      where: {
        id: Number(participateInfo.challengeId),
      },
      data: { participants: { decrement: 1 } },
    });
  });
};

export const likeWorkById = async ({ workId, userId }) => {
  const challengeDeadlineBoolean = await challengeDeadline(workId);

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
    throw new BadRequestException('챌린지가 마감됐습니다.');
  }
};

export const likeCancelWorkById = async ({ workId, userId }) => {
  const challengeDeadlineBoolean = await challengeDeadline(workId);

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
      throw new ForbiddenException('좋아요가 존재하지 않습니다.');
    }
  } else {
    throw new BadRequestException('챌린지가 마감됐습니다.');
  }
};

//커서 기반
export const getFeedbacksWorkById = async ({ workId, cursorId, limit }) => {
  const feedbacks = await prisma.feedback.findMany({
    where: { workId: Number(workId) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    ...(cursorId && { cursor: { id: Number(cursorId) } }),
    take: Number(limit + 1),
    include: {
      user: {
        select: {
          nickname: true,
          grade: true,
        },
      },
    },
  });

  const nextCursor = feedbacks.slice(limit)[0]?.id || null;

  const hasNext = feedbacks.length > limit ? true : false;
  const list = feedbacks.slice(0, limit);

  return { meta: { hasNext, nextCursor }, list };
};

const challengeDeadline = async (workId) => {
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

const bestWorksList = async ({ challengeId, userId, sortOrder }) => {
  const challengeInfo = await prisma.challenge.findUnique({
    where: {
      id: Number(challengeId),
    },
  });

  if (!!challengeInfo.progress) {
    const workList = await prisma.work.findMany({
      where: {
        challengeId: Number(challengeId),
      },
      orderBy: sortOrder,
    });

    const maxLikes = Math.max(...workList.map((work) => work.likeCount));

    if (maxLikes === 0) {
      return [];
    }

    const bestWorks = await prisma.work.findMany({
      where: {
        challengeId: Number(challengeId),
        likeCount: Number(maxLikes),
      },
      orderBy: sortOrder,
      include: { likes: true, user: true },
    });

    const bestWorkList = bestWorks.map((work) => {
      const isLiked = work.likes?.some((like) => like.userId === userId);
      return {
        ...work,
        isLiked,
      };
    });

    const data = bestWorkList.map((bestWork) => ({
      id: bestWork.id,
      userId: bestWork.userId,
      nickname: bestWork.user.nickname,
      grade: bestWork.user.grade,
      challengeId: bestWork.challengeId,
      content: bestWork.content,
      lastModifiedAt: bestWork.lastModifiedAt,
      likeCount: bestWork.likeCount,
      isLiked: bestWork.isLiked,
    }));

    return data;
  } else {
    return;
  }
};

const notifyCreateAboutWork = async (userId, challengeId, works) => {
  const challengeInfo = await prisma.challenge.findUnique({
    where: { id: Number(challengeId) },
  });

  await notificationService.notifyNewWork(
    Number(challengeInfo.userId),
    Number(userId),
    Number(challengeId),
    challengeInfo.title,
    Number(works.id),
    new Date()
  );
};

const notifyAdminAboutWork = async (userId, workId, action) => {
  const [userInfo, workInfo] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: Number(userId) },
    }),
    prisma.work.findUnique({
      where: { id: Number(workId) },
      include: { challenge: true },
    }),
  ]);

  if (userInfo && userInfo.role === 'ADMIN') {
    await notificationService.notifyContentChange(
      Number(workInfo.userId),
      Number(userId),
      'WORK',
      workInfo.challenge.title,
      action === '삭제' ? '삭제' : '수정',
      null,
      Number(workId),
      null,
      new Date()
    );
  }

  return workInfo;
};

export const checkWorkAuthorization = async (userId, workId) => {
  const workInfo = await prisma.work.findUnique({
    where: { id: Number(workId) },
  });

  if (!workInfo) {
    throw new NotFoundException('등록된 작업물이 없습니다.');
  }

  const userInfo = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!userInfo) {
    throw new UnauthorizedException('사용자 정보가 없습니다.');
  }

  const challengeInfo = await prisma.challenge.findUnique({
    where: { id: Number(workInfo.challengeId) },
  });

  if (challengeInfo.progress) {
    if (userInfo.role === 'ADMIN') {
      return true; // Admin can access even if challenge is closed
    } else {
      throw new UnauthorizedException('챌린지가 마감됐습니다.');
    }
  }

  if (userInfo.id === workInfo.userId || userInfo.role === 'ADMIN') {
    return;
  }

  throw new UnauthorizedException('접근 권한이 없습니다.');
};

export const checkCreateWorkAuthorization = async (userId, challengeId) => {
  const challengeInfo = await prisma.challenge.findUnique({
    where: { id: Number(challengeId) },
    include: {
      participations: true,
      works: true,
    },
  });

  if (!challengeInfo) {
    throw new NotFoundException('등록된 챌린지가 없습니다.');
  }

  const userInfo = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!userInfo) {
    throw new UnauthorizedException('사용자 정보가 없습니다.');
  }

  if (challengeInfo.progress) {
    throw new UnauthorizedException('챌린지가 마감됐습니다.');
  }

  const isParticipating = challengeInfo.participations.some(
    (participation) => participation.userId === userInfo.id
  );

  if (!isParticipating) {
    throw new UnauthorizedException('신청한 회원만 쓸 수 있습니다.');
  }

  const hasSubmittedWork = challengeInfo.works.some(
    (work) => work.userId === userInfo.id
  );

  if (hasSubmittedWork) {
    throw new BadRequestException('이미 작업물을 등록했습니다.');
  }

  return; // User can create work
};
