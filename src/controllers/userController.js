import * as userServices from '../services/userServices.js';
import {
  BadRequestException,
  UnauthorizedException,
} from '../errors/customException.js';
import {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_MAX_AGE,
} from '../config.js';
import jwt from 'jsonwebtoken';

const sendRefreshToken = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: parseInt(REFRESH_TOKEN_MAX_AGE, 10),
  });
};

export const register = async (req, res, next) => {
  const { nickname, email, password } = req.body;
  try {
    const user = await userServices.registerUser(nickname, email, password);
    res.status(201).json({ message: '회원가입 성공', userId: user.id });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { accessToken, refreshToken, userId } = await userServices.loginUser(
      email,
      password
    );
    sendRefreshToken(res, refreshToken);
    res.json({ message: '로그인 성공', accessToken, userId });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    await userServices.logoutUser(req.user.userId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedException('리프레시 토큰이 없습니다.'));
  }

  try {
    const user = await userServices.verifyRefreshToken(refreshToken);

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

    await userServices.updateRefreshToken(user.id, newRefreshToken);
    sendRefreshToken(res, newRefreshToken);

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedException('리프레시 토큰이 만료되었습니다.'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.')
      );
    }
    next(error);
  }
};

export const getOngoingChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { page, limit } = req.query;
    const result = await userServices.getOngoingChallenges(userId, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCompletedChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { page, limit } = req.query;
    const result = await userServices.getCompletedChallenges(
      userId,
      page,
      limit
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAppliedChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { status, sortBy, sortOrder, search, page, limit } = req.query;

    const validStatuses = ['WAITING', 'ACCEPTED', 'REJECTED'];
    const validSortBy = ['appliedAt', 'deadline'];
    const validSortOrder = ['asc', 'desc'];

    if (status && !validStatuses.includes(status)) {
      throw new BadRequestException('유효하지 않은 상태값입니다.');
    }
    if (sortBy && !validSortBy.includes(sortBy)) {
      throw new BadRequestException('유효하지 않은 정렬 기준입니다.');
    }
    if (sortOrder && !validSortOrder.includes(sortOrder)) {
      throw new BadRequestException('유효하지 않은 정렬 순서입니다.');
    }

    const result = await userServices.getAppliedChallenges(
      userId,
      status,
      sortBy,
      sortOrder,
      search,
      page,
      limit
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userServices.getCurrentUser(req.user.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return next(new BadRequestException('유효하지 않은 사용자 ID입니다.'));
  }
  try {
    const user = await userServices.getUserById(Number(id));
    res.json(user);
  } catch (error) {
    next(error);
  }
};
