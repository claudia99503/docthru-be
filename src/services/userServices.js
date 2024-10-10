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

export const registerUser = async (nickName, email, password) => {
  if (!nickName || !email || !password) {
    throw new BadRequestException(
      '닉네임, 이메일, 비밀번호는 필수 입력 항목입니다.'
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ nickName }, { email }] },
  });
  if (existingUser) {
    throw new ConflictException('이미 존재하는 닉네임 또는 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { nickName, email, password: hashedPassword },
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

export const getOngoingChallenges = async (userId) => {
  const ongoingChallenges = await prisma.participate.findMany({
    where: {
      userId,
      challenge: { progress: true },
    },
    include: { challenge: true },
  });

  if (ongoingChallenges.length === 0) {
    throw new NotFoundException('진행 중인 챌린지가 없습니다.');
  }

  return ongoingChallenges;
};

export const getCompletedChallenges = async (userId) => {
  const completedChallenges = await prisma.participate.findMany({
    where: {
      userId,
      challenge: { progress: false },
    },
    include: { challenge: true },
  });

  if (completedChallenges.length === 0) {
    throw new NotFoundException('완료된 챌린지가 없습니다.');
  }

  return completedChallenges;
};

export const getAppliedChallenges = async (userId) => {
  const appliedChallenges = await prisma.application.findMany({
    where: { userId },
    include: { challenge: true },
  });

  if (appliedChallenges.length === 0) {
    throw new NotFoundException('신청한 챌린지가 없습니다.');
  }

  return appliedChallenges;
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickName: true,
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
      nickName: true,
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
