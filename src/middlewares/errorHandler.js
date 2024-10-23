import { CommonException } from '../errors/commonException.js';

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof CommonException) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        subCode: err.subCode,
        message: err.message,
        identifier: err.identifier,
        reason: err.reason,
        occurredAt: err.occurredAt,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다.',
    },
  });
};

export default errorHandler;
