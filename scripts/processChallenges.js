import prisma from '../src/lib/prisma.js';
import { notifyDeadline } from '../src/services/notificationService.js';
import { updateUserGrade } from '../src/services/userServices.js';

async function processChallenges() {
  const now = new Date();

  const challengesToClose = await prisma.challenge.findMany({
    where: {
      deadline: {
        lt: now,
      },
      progress: false,
    },
    include: {
      participations: true,
      works: {
        include: {
          likes: true,
        },
      },
    },
  });

  for (const challenge of challengesToClose) {
    // 챌린지 progress를 true로 업데이트
    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { progress: true },
    });

    // 참가자들에게 마감 알림 전송
    for (const participation of challenge.participations) {
      await notifyDeadline(participation.userId, challenge.id);
    }

    // 가장 많은 좋아요 수 찾기 [추가!!]
    const maxLikes = Math.max(
      ...challenge.works.map((work) => work.likes.length)
    );

    // 가장 많은 좋아요를 받은 모든 작품 찾기 [추가!!]
    const bestWorks = challenge.works.filter(
      (work) => work.likes.length === maxLikes
    );

    // 베스트 작품 작성자들의 bestCount 증가
    for (const bestWork of bestWorks) {
      await prisma.user.update({
        where: { id: bestWork.userId },
        data: { bestCount: { increment: 1 } },
      });
    }

    // 참가자들의 등급 업데이트
    for (const participation of challenge.participations) {
      await updateUserGrade(participation.userId);
    }
  }
}

processChallenges()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
