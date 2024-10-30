import prisma from '../lib/prisma.js';

export const ApplicationService = {
  // 신규 챌린지 신청 (일반 사용자)
  createApplication: async (
    userId,
    challengeId,
    { title, field, docType, description, docUrl, deadline, maxParticipants }
  ) => {
    // 새로운 챌린지를 생성
    const challenge = await prisma.challenge.create({
      data: {
        title,
        field,
        docType,
        description,
        docUrl,
        deadline: new Date(deadline),
        participants: 0,
        maxParticipants,
      },
    });

    // 바로 생성된 challenge의 id를 사용하여 application을 생성
    return prisma.application.create({
      data: {
        userId,
        challengeId: challenge.id, // 중복 선언 제거
        challenge: {
          connect: { id: challenge.id },
        },
      },
    });
  },

  // 사용자가 신청한 챌린지 목록 조회 (취소된 신청 제외, 페이지네이션 적용)
  getUserApplications: async (
    userId,
    {
      page = 1,
      limit = 10,
      status,
      sortBy = 'appliedAt',
      sortOrder = 'asc',
      search,
    }
  ) => {
    const skip = (page - 1) * limit;

    const whereConditions = {
      userId,
      isCancelled: false, // 취소된 신청은 목록에서 제외
    };

    if (status) {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions.title = {
        contains: search,
      };
    }

    const totalCount = await prisma.application.count({
      where: whereConditions,
    });

    const applications = await prisma.application.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        challenge: {
          select: {
            id: true,
            docType: true,
            field: true,
            title: true,
            maxParticipants: true,
            deadline: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      list: applications,
      meta: {
        currentPage: page,
        totalCount,
        totalPages,
      },
    };
  },

  // 사용자가 신청한 특정 챌린지 상세 조회
  getUserApplicationById: async (userId, applicationId) => {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId), userId: parseInt(userId) },
      include: {
        challenge: {
          select: {
            id: true,
            docType: true,
            field: true,
            title: true,
            description: true,
            docUrl: true,
            maxParticipants: true,
            deadline: true,
          },
        },
        user: {
          select: { nickname: true, image: true },
        },
      },
    });

    if (!application) return null;

    const result = {
      id: application.id,
      docType: application.challenge.docType,
      field: application.challenge.field,
      title: application.challenge.title,
      description: application.challenge.description,
      docUrl: application.challenge.docUrl,
      maxParticipants: application.challenge.maxParticipants,
      applicationDate: application.createdAt,
      deadline: application.challenge.deadline,
      status: application.status,
    };

    if (application.status === 'DELETED' || application.status === 'REJECTED') {
      result.adminInfo = {
        adminNickname: application.user.nickname,
        reason: application.message,
        updatedAt: application.updatedAt,
      };
    }

    return result;
  },

  // 관리자용 전체 신청 목록 조회 (페이지네이션 적용)
  getAdminApplications: async ({
    page = 1,
    limit = 10,
    status,
    sortBy = 'appliedAt',
    sortOrder = 'asc',
    search,
  }) => {
    const skip = (page - 1) * limit;

    const whereConditions = {};

    if (status) {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions.title = {
        contains: search,
      };
    }

    const totalCount = await prisma.application.count({
      where: whereConditions,
    });

    const applications = await prisma.application.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        challenge: {
          select: {
            id: true,
            docType: true,
            field: true,
            title: true,
            maxParticipants: true,
            deadline: true,
          },
        },
        user: {
          select: { nickname: true },
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      list: applications,
      meta: {
        currentPage: page,
        totalCount,
        totalPages,
      },
    };
  },

  // 관리자 전용 - 특정 신청 상세 조회 및 상태 변경 가능
  getAdminApplicationById: async (applicationId) => {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: {
        challenge: {
          select: {
            id: true,
            docType: true,
            field: true,
            title: true,
            description: true,
            docUrl: true,
            maxParticipants: true,
            deadline: true,
          },
        },
        user: {
          select: { nickname: true },
        },
      },
    });

    if (!application) return null;

    return {
      id: application.id,
      docType: application.challenge.docType,
      field: application.challenge.field,
      title: application.challenge.title,
      description: application.challenge.description,
      docUrl: application.challenge.docUrl,
      maxParticipants: application.challenge.maxParticipants,
      applicationDate: application.createdAt,
      deadline: application.challenge.deadline,
      status: application.status,
      adminInfo: application.user.nickname,
      reason:
        application.status === 'DELETED' || application.status === 'REJECTED'
          ? application.message
          : null,
      updatedAt: application.updatedAt,
    };
  },

  // 신청 상태 업데이트 (승인, 거절, 삭제 - 어드민 전용)
  updateApplication: async (applicationId, status, message) => {
    const updateData = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'DELETED' || status === 'REJECTED') {
      updateData.message = message; // 거절 또는 삭제일 때만 메시지 추가
    }

    return prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: updateData,
    });
  },

  // 신청 취소 (WAITING 상태일 때만 가능하며, 전체 목록 조회에서 제외)
  cancelApplication: async (applicationId) => {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
    });

    if (!application || application.status !== 'WAITING') {
      throw new Error('대기 중인 신청만 취소할 수 있습니다.');
    }

    return prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: {
        isCancelled: true,
      },
    });
  },

  // 신청 수정 (어드민 전용)
  updateApplicationDetails: async (applicationId, updateData) => {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
    });

    if (!application) {
      throw new Error('신청을 찾을 수 없습니다.');
    }

    return prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: {
        title: updateData.title || application.title,
        field: updateData.field || application.field,
        docType: updateData.docType || application.docType,
        description: updateData.description || application.description,
        docUrl: updateData.docUrl || application.docUrl,
        deadline: updateData.deadline || application.deadline,
        maxParticipants:
          updateData.maxParticipants || application.maxParticipants,
      },
    });
  },
};
