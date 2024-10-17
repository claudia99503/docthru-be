import prisma from '../src/lib/prisma.js';
import {
  notifyDeadline,
  notifyMultipleUsers,
} from '../src/services/notificationService.js';
import { updateUserGrade } from '../src/services/userServices.js';

async function processChallenges() {
  const now = new Date();

  const challengesToClose = await prisma.challenge.findMany({
    where: {
      deadline: { lt: now },
      progress: false,
    },
    include: {
      participations: true,
      works: { include: { likes: true } },
    },
  });

  console.log(`Processing ${challengesToClose.length} challenges to close.`);

  for (const challenge of challengesToClose) {
    try {
      await prisma.$transaction(async (prisma) => {
        // 챌린지 progress를 true로 업데이트
        await prisma.challenge.update({
          where: { id: challenge.id },
          data: { progress: true },
        });

        // 참가자들에게 마감 알림 전송
        const participantIds = challenge.participations.map((p) => p.userId);
        await notifyMultipleUsers(
          participantIds,
          notifyDeadline,
          null, // actorId는 시스템 액션이므로 null
          challenge.id,
          challenge.title,
          now
        );

        // 가장 많은 좋아요 수 찾기
        const maxLikes = Math.max(
          ...challenge.works.map((work) => work.likes.length)
        );

        // 가장 많은 좋아요를 받은 모든 작품 찾기
        const bestWorks = challenge.works.filter(
          (work) => work.likes.length === maxLikes
        );

        // 베스트 작품 작성자들의 bestCount 증가
        await Promise.all(
          bestWorks.map((work) =>
            prisma.user.update({
              where: { id: work.userId },
              data: { bestCount: { increment: 1 } },
            })
          )
        );

        // 참가자들의 등급 업데이트
        await Promise.all(
          challenge.participations.map((participation) =>
            updateUserGrade(participation.userId)
          )
        );
      });

      console.log(`${challenge.id} 번 챌린지 성공`);
    } catch (error) {
      console.error(`${challenge.id} 실패 :`, error);
    }
  }
}

processChallenges()
  .catch((error) => {
    console.error('Error in processChallenges:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected.');
  });
