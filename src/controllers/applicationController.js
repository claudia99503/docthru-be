import * as applicationService from '../services/applicationService.js';
import prisma from '../lib/prisma';

// 신청 생성 함수 (일반 유저 접근 가능)
export const createApplication = async (req, res, next) => {
  try {
    const {
      title,
      field,
      docType,
      description,
      docUrl,
      deadline,
      maxParticipates,
    } = req.body;

    await Prisma.$transaction(async (prisma) => {
      const data = {
        title,
        field,
        docType,
        description,
        docUrl,
        deadline: new Date(deadline),
        participates: 0,
        maxParticipates,
      };
      const challenge = await prisma.challenge.create({ data });

      const challengeId = challenge.id;
      const userId = req.user.userId;
      await prisma.application.create({
        data: {
          userId,
          challengeId,
        },
      });
    });
    res.status(201).json(createApplication);
  } catch (error) {
    next(error);
  }
};

// 신청 목록 조회 함수 (관리자만 접근 가능)
export const getApplications = async (req, res, next) => {
  try {
    // *** 관리자 권한 확인 코드 추가 ***
    if (req.user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: '접근 권한이 없습니다. 관리자만 접근 가능합니다.' });
    }

    const applications = await applicationService.getApplications();
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// 신청 삭제 함수 (관리자만 접근 가능)
export const deleteApplication = async (req, res, next) => {
  try {
    // *** 관리자 권한 확인 코드 추가 ***
    if (req.user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: '접근 권한이 없습니다. 관리자만 접근 가능합니다.' });
    }

    const { applicationId } = req.params;
    await applicationService.deleteApplication(parseInt(applicationId));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// 신청 정보 업데이트 함수 (관리자만 접근 가능)
export const updateApplication = async (req, res, next) => {
  try {
    // *** 관리자 권한 확인 코드 추가 ***
    if (req.user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: '접근 권한이 없습니다. 관리자만 접근 가능합니다.' });
    }

    const { applicationId } = req.params;
    const { status, invalidationComment } = req.body;
    const updatedApplication = await applicationService.updateApplication(
      parseInt(applicationId),
      status,
      invalidationComment
    );
    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};
