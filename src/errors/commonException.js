export class CommonException extends Error {
  constructor({
    status = 500,
    code = 'UNKNOWN_ERROR',
    message = '예상 외 에러가 발생했습니다',
    identifier,
    subCode,
    reason,
    origin,
    occurredAt = new Date().toISOString(),
  } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.subCode = subCode;
    this.identifier = identifier;
    this.reason = reason;
    this.origin = origin;
    this.occurredAt = occurredAt;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVICE_UNAVAILABLE: 503,
};

export const ExceptionCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DATA_INTEGRITY_ERROR: 'DATA_INTEGRITY_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR',
};

export const ExceptionIdentifier = {
  USER_ERROR: 'USER_ERROR',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  INPUT_ERROR: 'INPUT_ERROR',
  RESOURCE_ERROR: 'RESOURCE_ERROR',
  EXTERNAL_DEPENDENCY_ERROR: 'EXTERNAL_DEPENDENCY_ERROR',
  PERFORMANCE_ERROR: 'PERFORMANCE_ERROR',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
};
