import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from '../configs/config.js';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '../errors/customException.js';
import {
  isValidEmail,
  isValidPassword,
  validateUserInput,
} from '../utils/authValidation.js';

// 토큰 생성 유틸리티 함수
const generateToken = (userId, secret, expiresIn) =>
  jwt.sign({ userId }, secret, { expiresIn });

export const registerUser = async (nickname, email, password) => {
  const validationErrors = validateUserInput(nickname, email, password);
  if (validationErrors.length > 0) {
    throw new BadRequestException(validationErrors.join(', '));
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ nickname }, { email }] },
  });
  if (existingUser) {
    throw new ConflictException('이미 존재하는 닉네임 또는 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { nickname, email, password: hashedPassword },
  });

  const accessToken = generateToken(user.id, ACCESS_TOKEN_SECRET, TOKEN_EXPIRY);
  const refreshToken = generateToken(
    user.id,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY
  );

  await updateRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, userId: user.id };
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new BadRequestException('이메일과 비밀번호는 필수 입력 항목입니다.');
  }

  if (!isValidEmail(email) || !isValidPassword(password)) {
    throw new BadRequestException(
      '이메일 또는 비밀번호 형식이 올바르지 않습니다.'
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException(
        '이메일 또는 비밀번호가 일치하지 않습니다.'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException(
        '이메일 또는 비밀번호가 일치하지 않습니다.'
      );
    }

    const accessToken = generateToken(
      user.id,
      ACCESS_TOKEN_SECRET,
      TOKEN_EXPIRY
    );
    const refreshToken = generateToken(
      user.id,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY
    );

    await updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, userId: user.id };
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    console.error('Login error:', error);
    throw new Error('로그인 처리 중 오류가 발생했습니다.');
  }
};

export const logoutUser = async (userId) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new Error('로그아웃 처리 중 오류가 발생했습니다.');
  }
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw UnauthorizedException.invalidToken(
        '유효하지 않은 리프레시 토큰입니다.'
      );
    }
    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw UnauthorizedException.tokenExpired(
        '리프레시 토큰이 만료되었습니다.'
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw UnauthorizedException.invalidToken(
        '유효하지 않은 리프레시 토큰입니다.'
      );
    }
    throw error;
  }
};

export const refreshTokens = async (currentRefreshToken) => {
  return await prisma.$transaction(async (tx) => {
    let decoded;
    try {
      decoded = jwt.verify(currentRefreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // 만료된 토큰은 DB에서도 제거
        await cleanupUserRefreshToken(decoded?.userId);
        throw UnauthorizedException.tokenExpired('만료된 리프레시 토큰입니다.');
      }
      throw UnauthorizedException.invalidToken(
        '유효하지 않은 리프레시 토큰입니다.'
      );
    }

    const user = await tx.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        refreshToken: true,
        tokenUpdatedAt: true, // 새로운 필드 추가
      },
    });

    // 저장된 토큰과 불일치하거나 사용자가 없는 경우
    if (!user || user.refreshToken !== currentRefreshToken) {
      await cleanupUserRefreshToken(decoded.userId);
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    // 토큰 갱신 최소 간격 체크 (예: 1분)
    const MIN_REFRESH_INTERVAL = 60 * 1000;
    if (
      user.tokenUpdatedAt &&
      Date.now() - user.tokenUpdatedAt.getTime() < MIN_REFRESH_INTERVAL
    ) {
      return {
        accessToken: generateToken(user.id, ACCESS_TOKEN_SECRET, TOKEN_EXPIRY),
        newRefreshToken: currentRefreshToken,
        userId: user.id,
      };
    }

    const accessToken = generateToken(
      user.id,
      ACCESS_TOKEN_SECRET,
      TOKEN_EXPIRY
    );
    const newRefreshToken = generateToken(
      user.id,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY
    );

    await tx.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
        tokenUpdatedAt: new Date(),
      },
    });

    return { accessToken, newRefreshToken, userId: user.id };
  });
};

export const cleanupUserRefreshToken = async (userId) => {
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
      tokenUpdatedAt: null,
    },
  });
};

export const patchUserData = async (userId, nickname, imageUrl) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { nickname, image: imageUrl },
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    throw error;
  }
};

export const updateRefreshToken = async (userId, newRefreshToken) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: newRefreshToken },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    throw error;
  }
};

const getPaginationData = (page, limit) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  const skip = (parsedPage - 1) * parsedLimit;
  return { parsedPage, parsedLimit, skip };
};

export const getOngoingChallenges = async (userId, page, limit, search) => {
  const { parsedPage, parsedLimit, skip } = getPaginationData(page, limit);

  const whereCondition = {
    userId,
    challenge: {
      progress: false,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    },
  };

  const [ongoingChallenges, totalCount] = await Promise.all([
    prisma.Participation.findMany({
      where: whereCondition,
      include: { challenge: true },
      skip,
      take: parsedLimit,
    }),
    prisma.Participation.count({
      where: whereCondition,
    }),
  ]);

  return {
    list: ongoingChallenges,
    meta: {
      currentPage: parsedPage,
      pageSize: parsedLimit,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
    },
  };
};

export const getCompletedChallenges = async (userId, page, limit, search) => {
  const { parsedPage, parsedLimit, skip } = getPaginationData(page, limit);

  const whereCondition = {
    userId,
    challenge: {
      progress: true,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    },
  };

  const [completedChallenges, totalCount] = await Promise.all([
    prisma.Participation.findMany({
      where: whereCondition,
      include: { challenge: true },
      skip,
      take: parsedLimit,
    }),
    prisma.Participation.count({
      where: whereCondition,
    }),
  ]);

  return {
    list: completedChallenges,
    meta: {
      currentPage: parsedPage,
      pageSize: parsedLimit,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
    },
  };
};

export const getAppliedChallenges = async (
  userId,
  status,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  searchTerm = '',
  page,
  limit
) => {
  const { parsedPage, parsedLimit, skip } = getPaginationData(page, limit);

  const whereClause = { userId };
  if (status) {
    whereClause.status = status;
  }

  if (searchTerm) {
    whereClause.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const orderBy = {};
  if (sortBy === 'createdAt' || sortBy === 'deadline') {
    orderBy[sortBy] = sortOrder;
  }
  if (sortBy !== 'createdAt') {
    orderBy.createdAt = 'desc';
  }

  const [appliedChallenges, totalCount] = await prisma.$transaction([
    prisma.challenge.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: parsedLimit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        deadline: true,
      },
    }),
    prisma.challenge.count({ where: whereClause }),
  ]);

  return {
    challenges: appliedChallenges.map(
      ({ createdAt, deadline, ...challenge }) => ({
        ...challenge,
        createdAt: createdAt.toISOString(),
        deadline: deadline.toISOString(),
      })
    ),
    meta: {
      currentPage: parsedPage,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
    },
  };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      email: true,
      role: true,
      grade: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundException('사용자를 찾을 수 없습니다.');
  }

  return {
    ...user,
    createdAt: user.createdAt,
  };
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      participations: true,
    },
  });

  const challengeList = await Promise.all(
    user.participations.map(async (participation) => {
      const challenge = await prisma.challenge.findUnique({
        where: { id: Number(participation.challengeId) },
      });
      return {
        challenge,
      };
    })
  );

  const data = {
    id: user.id,
    nickname: user.nickname,
    role: user.role,
    grade: user.grade,
    createdAt: user.createdAt,
    challengeList,
  };

  if (!user) {
    throw new NotFoundException('사용자를 찾을 수 없습니다.');
  }

  return {
    ...data,
  };
};

export const updateUserGradeBatch = async (userIds) => {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      grade: true,
      bestCount: true,
      participations: {
        select: {
          challenge: {
            select: {
              progress: true,
            },
          },
        },
      },
    },
  });

  const updatedUsers = users.map((user) => {
    const challengeParticipationCount = user.participations.filter(
      (participation) => participation.challenge.progress
    ).length;

    const bestCount = user.bestCount;
    let newGrade = 'NORMAL';

    if (
      bestCount >= 10 ||
      challengeParticipationCount >= 10 ||
      (challengeParticipationCount >= 5 && bestCount >= 5)
    ) {
      newGrade = 'EXPERT';
    }

    return {
      id: user.id,
      currentGrade: user.grade,
      newGrade: newGrade,
    };
  });

  const usersToUpdate = updatedUsers.filter(
    (user) => user.currentGrade !== user.newGrade
  );

  if (usersToUpdate.length > 0) {
    await prisma.user.updateMany({
      where: { id: { in: usersToUpdate.map((user) => user.id) } },
      data: { grade: 'EXPERT' },
    });
  }

  return updatedUsers;
};

export const findUserByRefreshToken = async (refreshToken) => {
  const user = await prisma.user.findFirst({
    where: { refreshToken: refreshToken },
  });
  return user;
};
