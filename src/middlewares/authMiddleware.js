import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../errors/customException.js';

const { ACCESS_TOKEN_SECRET } = process.env;

export const authenticateAccessToken = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new UnauthorizedException('접근 토큰이 없습니다');
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      throw new UnauthorizedException('유효하지 않은 접근 토큰입니다.');
    }
    req.user = user;
    next();
  });
};
