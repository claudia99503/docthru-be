import * as userServices from '../services/userServices.js';
import { cleanupUserRefreshToken } from '../services/userServices.js';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '../errors/customException.js';
import {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_MAX_AGE,
} from '../configs/config.js';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';

const sendRefreshToken = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: parseInt(REFRESH_TOKEN_MAX_AGE, 10),
    path: '/',
  };

  if (isProduction) {
    cookieOptions.domain = '.vercel.app';
  }

  res.cookie('refreshToken', token, cookieOptions);
};

export const register = async (req, res, next) => {
  const { nickname, email, password } = req.body;
  try {
    const { accessToken, refreshToken, userId } =
      await userServices.registerUser(nickname, email, password);
    sendRefreshToken(res, refreshToken);
    res.status(201).json({
      message: '회원가입 성공',
      accessToken,
      userId,
    });
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
    res.json({
      message: '로그인 성공',
      accessToken,
      userId,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        path: '/',
        domain: isProduction ? '.vercel.app' : undefined,
      });
      return res.json({ message: '로그아웃 성공' });
    }

    let userId;
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      userId = decoded.userId;
    } catch (error) {
      // 토큰이 유효하지 않아도 쿠키는 삭제
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        path: '/',
        domain: isProduction ? '.vercel.app' : undefined,
      });
      return res.json({ message: '로그아웃 성공' });
    }

    await cleanupUserRefreshToken(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
      domain: isProduction ? '.vercel.app' : undefined,
    });
    res.json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(
      UnauthorizedException.missingToken('리프레시 토큰이 없습니다.')
    );
  }

  try {
    const { accessToken, newRefreshToken, userId } =
      await userServices.refreshTokens(refreshToken);
    sendRefreshToken(res, newRefreshToken);
    res.json({ accessToken, userId });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        UnauthorizedException.tokenExpired('리프레시 토큰이 만료되었습니다.')
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        UnauthorizedException.invalidToken('유효하지 않은 리프레시 토큰입니다.')
      );
    }
    next(new InternalServerErrorException('토큰 갱신 중 오류가 발생했습니다.'));
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw UnauthorizedException.missingToken('액세스 토큰이 없습니다.');
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw UnauthorizedException.tokenExpired('토큰이 만료되었습니다.');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw UnauthorizedException.invalidToken('유효하지 않은 토큰입니다.');
      } else {
        throw new InternalServerErrorException(
          '토큰 검증 중 오류가 발생했습니다.'
        );
      }
    }

    const user = await userServices.getCurrentUser(decodedToken.userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    res.json(user);
  } catch (error) {
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

export const patchUserData = async (req, res, next) => {
  const { userId } = req.user;
  const { nickname, imageUrl } = req.body;
  try {
    const updatedUser = await userServices.patchUserData(
      userId,
      nickname,
      imageUrl
    );
    const data = {
      nickname: updatedUser.nickname,
      image: updatedUser.image,
    };
    res.json(data);
  } catch (error) {
    next(error);
  }
};
