import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '../errors/customException.js';

const prisma = new PrismaClient();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

export const registerUser = async (nickname, email, password) => {
  if (!nickname || !email || !password) {
    throw new BadRequestException(
      '닉네임, 이메일, 비밀번호는 필수 입력 항목입니다.'
    );
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

  return user;
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new BadRequestException('이메일과 비밀번호는 필수 입력 항목입니다.');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedException(
      '이메일 또는 비밀번호가 일치하지 않습니다.'
    );
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken, userId: user.id };
};

export const logoutUser = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

export const verifyRefreshToken = async (refreshToken) => {
  const user = await prisma.user.findFirst({ where: { refreshToken } });
  if (!user) {
    throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
  }
  return user;
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
    prisma.participate.findMany({
      where: {
        userId,
        challenge: { progress: true },
      },
      include: { challenge: true },
      skip,
      take: parsedLimit,
    }),
    prisma.participate.count({
      where: {
        userId,
        challenge: { progress: true },
      },
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
    prisma.participate.findMany({
      where: {
        userId,
        challenge: { progress: false },
      },
      include: { challenge: true },
      skip,
      take: parsedLimit,
    }),
    prisma.participate.count({
      where: {
        userId,
        challenge: { progress: false },
      },
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

  return user;
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

  return user;
};
