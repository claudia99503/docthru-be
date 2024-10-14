import * as userServices from '../services/userServices.js';
import {
  NotAllowedMethodException,
  UnauthorizedException,
} from '../errors/customException.js';
import jwt from 'jsonwebtoken';

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

// 회원가입
export const register = async (req, res, next) => {
  try {
    const { nickName, email, password } = req.body;

    const user = await userServices.registerUser(nickName, email, password);
    res.status(201).json({ message: '회원가입 성공', userId: user.id });
  } catch (error) {
    next(error);
  }
};

// 로그인
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, userId } = await userServices.loginUser(
      email,
      password
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    // refreshToken만 쿠키로 설정
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // accessToken은 응답 본문에 포함
    res.json({ message: '로그인 성공', accessToken, userId });
  } catch (error) {
    next(error);
  }
};

// 로그아웃
export const logout = async (req, res, next) => {
  if (req.method !== 'POST') {
    return next(new NotAllowedMethodException());
  }

  try {
    await userServices.logoutUser(req.user.userId);
    res.clearCookie('refreshToken');
    res.json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
};

// 토큰 갱신
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedException('리프레시 토큰이 없습니다.');
  }

  try {
    const user = await userServices.verifyRefreshToken(refreshToken);
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
      }

      const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
      });

      res.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};

// 진행중 챌린지 조회
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
// 완료된 챌린지 조회
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

// 신청한 챌린지 조회
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

    const appliedChallenges = await userServices.getAppliedChallenges(
      userId,
      status,
      sortBy || 'appliedAt',
      sortOrder || 'desc',
      search || ''
    );

    const statusMap = {
      WAITING: '승인대기',
      ACCEPTED: '신청승인',
      REJECTED: '신청거절',
    };

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

// 현재 유저 정보 조회
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await userServices.getCurrentUser(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// 특정 유저 정보 조회 (권한 조건 걸어야할수도?)
export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return next(new NotAllowedMethodException('허용되지 않는 메소드입니다'));
  }

  try {
    const user = await userServices.getUserById(Number(id));
    res.json(user);
  } catch (error) {
    next(error);
  }
};
