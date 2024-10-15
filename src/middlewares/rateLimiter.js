import rateLimit from 'express-rate-limit';
import { RateLimitExceededException } from '../errors/customException.js';

const createRateLimiter = (windowMs, max, errorMessage) => {
  return rateLimit({
    windowMs,
    max,
    handler: (req, res, next) => {
      next(new RateLimitExceededException(errorMessage));
    },
    skip: (req) => {
      // 특정유저나 IP에 대응해서 스킵설정가능
      return false;
    },
    keyGenerator: (req) => {
      // 레이트 리미터가 유저를 특정하는방법 (현재는 IP입니다, 수정가능~)
      return req.ip;
    },
  });
};

export const loginLimiter = createRateLimiter(
  15 * 60 * 1000, // 15분
  5, // 15분 동안 최대 5번의 요청 허용
  '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.'
);

export const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15분
  100, // 15분 동안 최대 100번의 요청 허용
  '요청량이 너무 많습니다. 잠시 후 다시 시도해주세요.'
);
