import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../configs/config.js';
import { UnauthorizedException } from '../errors/customException.js';

export const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedException('액세스 토큰이 없습니다.'));
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(new UnauthorizedException('유효하지 않은 토큰입니다.'));
    }
    req.user = user;
    next();
  });
};
