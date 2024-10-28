import { body, param } from 'express-validator';
import { BadRequestException } from '../errors/customException.js';
import { validationResult } from 'express-validator';

export const validateProfileData = [
  body('bio')
    .optional({ nullable: true })
    .isString()
    .withMessage('자기소개는 문자열이어야 합니다.'),

  body('location')
    .optional({ nullable: true })
    .isString()
    .withMessage('위치는 문자열이어야 합니다.'),

  body('career')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('경력은 0 이상의 숫자여야 합니다.'),

  body('position')
    .optional({ nullable: true })
    .isString()
    .withMessage('직무는 문자열이어야 합니다.'),

  body('skills')
    .optional({ nullable: true })
    .isArray()
    .withMessage('기술 스택은 배열이어야 합니다.')
    .custom((value) => {
      if (value === null) return true;
      if (!Array.isArray(value)) return false;
      return value.every(
        (item) => typeof item === 'string' && item.trim().length > 0
      );
    })
    .withMessage('기술 스택의 각 항목은 비어있지 않은 문자열이어야 합니다.'),

  body('preferredFields')
    .optional({ nullable: true })
    .isArray()
    .withMessage('선호 분야는 배열이어야 합니다.')
    .custom((value) => {
      if (value === null) return true;
      if (!Array.isArray(value)) return false;
      return value.every(
        (item) => typeof item === 'string' && item.trim().length > 0
      );
    })
    .withMessage('선호 분야의 각 항목은 비어있지 않은 문자열이어야 합니다.'),

  body('githubUrl')
    .optional({ nullable: true })
    .custom((value) => {
      if (!value) return true;
      try {
        new URL(value);
        return value.includes('github.com');
      } catch (e) {
        return false;
      }
    })
    .withMessage('유효한 GitHub URL이 필요합니다.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(
        '입력값이 유효하지 않습니다.',
        errors.array()
      );
    }
    next();
  },
];
