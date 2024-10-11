import * as authService from '../services/userServices.js';
import { NotAllowedMethodException } from '../errors/customException.js';

// 회원가입
export const register = async (req, res, next) => {
  try {
    const { nickName, email, password } = req.body;

    const user = await authService.registerUser(nickName, email, password);
    res.status(201).json({ message: '회원가입 성공', userId: user.id });
  } catch (error) {
    next(error);
  }
};

import * as authService from '../services/userServices.js';
import {
  NotAllowedMethodException,
  UnauthorizedException,
} from '../errors/customException.js';
import jwt from 'jsonwebtoken';

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

// 로그인
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, userId } = await authService.loginUser(
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
    await authService.logoutUser(req.user.userId);
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
    const user = await authService.verifyRefreshToken(refreshToken);
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
    const ongoingChallenges = await authService.getOngoingChallenges(userId);
    res.json(ongoingChallenges);
  } catch (error) {
    next(error);
  }
};

// 완료된 챌린지 조회
export const getCompletedChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const completedChallenges = await authService.getCompletedChallenges(
      userId
    );
    res.json(completedChallenges);
  } catch (error) {
    next(error);
  }
};

// 신청한 챌린지 조회
export const getAppliedChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const appliedChallenges = await authService.getAppliedChallenges(userId);
    res.json(appliedChallenges);
  } catch (error) {
    next(error);
  }
};

// 현재 유저 정보 조회
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await authService.getCurrentUser(userId);
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
    const user = await authService.getUserById(Number(id));
    res.json(user);
  } catch (error) {
    next(error);
  }
};
