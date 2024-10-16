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
import { formatDate } from '../utils/dateUtils.js';

const applicationStatusConverter = (status) => {
  switch (status) {
    case 'WAITING':
      return '대기 중';
    case 'ACCEPTED':
      return '승인됨';
    case 'REJECTED':
      return '거절됨';
    default:
      return '알 수 없음';
  }
};

// 토큰 생성 유틸리티 함수
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
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
    if (error.code === 'P2000') {
      throw new BadRequestException('유효하지 않은 요청입니다');
    }
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
      where: { id: decoded.userId, refreshToken: refreshToken },
    });

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
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

export const getOngoingChallenges = async (userId, page, limit) => {
  const { parsedPage, parsedLimit, skip } = getPaginationData(page, limit);

  const [ongoingChallenges, totalCount] = await Promise.all([
    prisma.participations.findMany({
      where: { userId, challenge: { progress: true } },
      include: { challenge: true },
      skip,
      take: parsedLimit,
    }),
    prisma.participations.count({
      where: { userId, challenge: { progress: true } },
    }),
  ]);

  return {
    challenges: ongoingChallenges,
    meta: {
      currentPage: parsedPage,
      pageSize: parsedLimit,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
    },
  };
};

export const getCompletedChallenges = async (userId, page, limit) => {
  const { parsedPage, parsedLimit, skip } = getPaginationData(page, limit);

  const [completedChallenges, totalCount] = await Promise.all([
    prisma.participations.findMany({
      where: { userId, challenge: { progress: false } },
      include: { challenge: true },
      skip,
      take: parsedLimit,
    }),
    prisma.participations.count({
      where: { userId, challenge: { progress: false } },
    }),
  ]);

  return {
    challenges: completedChallenges,
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
  sortBy = 'appliedAt',
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
    whereClause.challenge = {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };
  }

  const orderBy = [];
  if (sortBy === 'appliedAt') {
    orderBy.push({ appliedAt: sortOrder });
  } else if (sortBy === 'deadline') {
    orderBy.push({ challenge: { deadline: sortOrder } });
  }
  if (sortBy !== 'appliedAt') {
    orderBy.push({ appliedAt: 'desc' });
  }

  const [appliedChallenges, totalCount] = await Promise.all([
    prisma.application.findMany({
      where: whereClause,
      orderBy,
      include: { challenge: true },
      skip,
      take: parsedLimit,
    }),
    prisma.application.count({ where: whereClause }),
  ]);

  return {
    challenges: appliedChallenges.map((app) => ({
      ...app,
      status: applicationStatusConverter(app.status),
      appliedAt: app.appliedAt.toISOString(),
      challenge: {
        ...app.challenge,
        deadline: app.challenge.deadline.toISOString(),
      },
    })),
    meta: {
      currentPage: parsedPage,
      pageSize: parsedLimit,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
      filter: { status, search: searchTerm },
      sort: { by: sortBy, order: sortOrder },
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
    createdAt: formatDate(user.createdAt),
  };
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      nickname: true,
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
    createdAt: formatDate(user.createdAt),
  };
};
