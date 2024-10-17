import prisma from '../src/lib/prisma.js';
import {
  notifyDeadline,
  notifyMultipleUsers,
} from '../src/services/notificationService.js';
import { updateUserGrade } from '../src/services/userServices.js';

const TRANSACTION_TIMEOUT = 60000; // 60초

async function processSingleChallenge(challenge, now) {
  try {
    await prisma.$transaction(
      async (tx) => {
        // 챌린지 progress를 true로 업데이트
        await tx.challenge.update({
          where: { id: challenge.id },
          data: { progress: true },
        });

        // 참가자들에게 마감 알림 전송
        const participantIds = challenge.participations.map((p) => p.userId);
        await notifyMultipleUsers(
          participantIds,
          notifyDeadline,
          null,
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
            tx.user.update({
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
      },
      {
        timeout: TRANSACTION_TIMEOUT,
      }
    );

    console.log(`챌린지 ID ${challenge.id} 처리 완료`);
  } catch (error) {
    console.error(`챌린지 ID ${challenge.id} 처리 실패:`, error);
    throw error;
  }
}

async function processChallenges() {
  const now = new Date();

  try {
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

    console.log(`마감할 챌린지 ${challengesToClose.length}개 처리 시작`);

    const BATCH_SIZE = 5;
    for (let i = 0; i < challengesToClose.length; i += BATCH_SIZE) {
      const batch = challengesToClose.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((challenge) => processSingleChallenge(challenge, now))
      );
    }

    console.log('모든 챌린지 처리 완료');
  } catch (error) {
    console.error('챌린지 처리 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma 연결 종료');
  }
}

processChallenges();
