import * as ApplicationService from '../services/applicationService.js';

// 신규 챌린지 신청 (일반 사용자용)
export const createApplication = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const applicationData = req.body;

    const newApplication = await ApplicationService.createApplication(
      userId,
      applicationData
    );

    res
      .status(201)
      .json({ message: '신청이 성공적으로 완료되었습니다.', newApplication });
  } catch (error) {
    next(error);
  }
};

// 내가 신청한 챌린지 목록 조회 (취소된 신청 제외, 페이지네이션 적용)
export const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page, limit, status, sortBy, sortOrder, search } = req.query;

    const result = await ApplicationService.getUserApplications(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      sortBy,
      sortOrder,
      search,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 내가 신청한 챌린지 상세 조회 (상태에 관계없이 신청 상태 표시)
export const getMyApplicationById = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.userId;

    const application = await ApplicationService.getUserApplicationById(
      userId,
      applicationId
    );

    if (!application) {
      return res.status(404).json({ message: '신청을 찾을 수 없습니다.' });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// 관리자 전용 - 모든 챌린지 신청 목록 조회 (페이지네이션 적용)
export const getAdminApplications = async (req, res, next) => {
  try {
    const { page, limit, status, sortBy, sortOrder, search } = req.query;

    const result = await ApplicationService.getAdminApplications({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      sortBy,
      sortOrder,
      search,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 관리자 전용 - 특정 신청 상세 조회 및 상태 변경 가능
export const getAdminApplicationById = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await ApplicationService.getAdminApplicationById(
      applicationId
    );

    if (!application) {
      return res.status(404).json({ message: '신청을 찾을 수 없습니다.' });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// 신청 상태 업데이트 (승인, 거절, 삭제 - 어드민 전용)
export const updateApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, message } = req.body;

    const updatedApplication = await ApplicationService.updateApplication(
      applicationId,
      status,
      message
    );

    res.status(200).json({
      message: '신청 상태가 성공적으로 업데이트되었습니다.',
      updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// 신청 취소 (일반 사용자 - WAITING 상태에서만 가능, 전체 목록에서 제외)
export const cancelApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const cancelledApplication = await ApplicationService.cancelApplication(
      applicationId
    );

    res.status(200).json({
      message: '신청이 성공적으로 취소되었습니다.',
      cancelledApplication,
    });
  } catch (error) {
    next(error);
  }
};

// 신청 수정 (어드민 전용)
export const updateApplicationDetails = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const updateData = req.body;

    const updatedApplication =
      await ApplicationService.updateApplicationDetails(
        applicationId,
        updateData
      );

    res.status(200).json({
      message: '신청이 성공적으로 수정되었습니다.',
      updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};
