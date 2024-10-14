// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // 신청 생성 서비스 함수
// export const createApplication = async ({ userId, challengeId }) => {
//   return prisma.application.create({
//     data: {
//       userId,
//       challengeId,
//     },
//   });
// };

// 신청 목록 조회 서비스 함수
export const getApplications = async () => {
  return prisma.application.findMany({
    include: {
      user: true,
      challenge: true,
    },
  });
};

// 신청 삭제 서비스 함수
export const deleteApplication = async (applicationId) => {
  return prisma.application.delete({
    where: { id: applicationId },
  });
};

// 신청 업데이트 서비스 함수
export const updateApplication = async (
  applicationId,
  status,
  invalidationComment
) => {
  return prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      invalidationComment,
      invalidatedAt: status === 'REJECTED' ? new Date() : null,
    },
  });
};
