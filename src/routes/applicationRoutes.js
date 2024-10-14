import express from 'express';
import {
  createApplication,
  getApplications,
  deleteApplication,
  updateApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

// *** 인증 미들웨어 (예시로 추가, 실제 인증 미들웨어를 사용하세요) ***
const isAuthenticated = (req, res, next) => {
  // 실제 인증 로직으로 대체하세요
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: '로그인이 필요합니다.' });
  }
};

// *** 관리자 권한 확인 미들웨어 추가 ***
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res
      .status(403)
      .json({ message: '접근 권한이 없습니다. 관리자만 접근 가능합니다.' });
  }
};

// 신청 생성 라우트 (일반 유저 접근 가능)
router.post(
  '/challenges/:challengeId/applications',
  isAuthenticated,
  createApplication
);

// 신청 목록 조회 라우트 (관리자만 접근 가능)
router.get('/applications', isAuthenticated, isAdmin, getApplications);

// 신청 삭제 라우트 (관리자만 접근 가능)
router.delete(
  '/applications/:applicationId',
  isAuthenticated,
  isAdmin,
  deleteApplication
);

// 신청 업데이트 라우트 (관리자만 접근 가능)
router.put(
  '/applications/:applicationId',
  isAuthenticated,
  isAdmin,
  updateApplication
);

export default router;
