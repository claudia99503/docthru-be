import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../configs/config.js';
import {
  UnauthorizedException,
  BadRequestException,
} from '../errors/customException.js';
import { logoutUser } from '../services/userServices.js';

export const authenticateAccessToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return next(
      new UnauthorizedException.missingToken('액세스 토큰이 필요합니다.')
    );
  }
  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new UnauthorizedException.tokenExpired('토큰이 만료되었습니다.')
      );
    }
    try {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.userId) {
        await logoutUser(decodedToken.userId);
      }
    } catch (logoutError) {
      console.error('로그아웃 처리 중 오류 발생:', logoutError);
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
      domain: isProduction ? '.vercel.app' : undefined,
    });
    return next(
      new UnauthorizedException.invalidToken(
        '유효하지 않은 토큰입니다. 다시 로그인해주세요.'
      )
    );
  }
};
