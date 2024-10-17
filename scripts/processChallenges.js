import prisma from '../src/lib/prisma.js';
import {
  notifyDeadline,
  notifyMultipleUsers,
} from '../src/services/notificationService.js';
import { updateUserGrade } from '../src/services/userServices.js';

async function processChallenges() {
  const now = new Date();

  try {
    const challengesToClose = await prisma.challenge.findMany({
      where: {
        deadline: { lt: now },
        progress: false,
      },
      select: {
        id: true,
        title: true,
        participations: { select: { userId: true } },
        works: {
          select: {
            userId: true,
            _count: { select: { likes: true } },
          },
        },
      },
    });

    console.log(`${challengesToClose.length}개의 챌린지 처리 시작`);

    const challengeIds = challengesToClose.map((c) => c.id);
    const userUpdates = new Map();
    const notifications = [];
    const gradeUpdates = new Set();

    challengesToClose.forEach((challenge) => {
      const participantIds = challenge.participations.map((p) => p.userId);
      notifications.push({
        participantIds,
        challengeId: challenge.id,
        title: challenge.title,
        now,
      });

      gradeUpdates.add(...participantIds);

      const maxLikes = Math.max(...challenge.works.map((w) => w._count.likes));
      challenge.works.forEach((work) => {
        if (work._count.likes === maxLikes) {
          userUpdates.set(work.userId, (userUpdates.get(work.userId) || 0) + 1);
        }
      });
    });

    await prisma.$transaction(async (tx) => {
      await tx.challenge.updateMany({
        where: { id: { in: challengeIds } },
        data: { progress: true },
      });

      await Promise.all(
        Array.from(userUpdates).map(([userId, increment]) =>
          tx.user.update({
            where: { id: userId },
            data: { bestCount: { increment } },
          })
        )
      );
    });

    await Promise.all(
      notifications.map((notif) =>
        notifyMultipleUsers(
          notif.participantIds,
          notifyDeadline,
          null,
          notif.challengeId,
          notif.title,
          notif.now
        )
      )
    );

    const gradeUpdateResults = await Promise.allSettled(
      Array.from(gradeUpdates).map(async (userId) => {
        const initialGrade = await prisma.user.findUnique({
          where: { id: userId },
          select: { grade: true },
        });
        const newGrade = await updateUserGrade(userId);
        return { userId, initialGrade: initialGrade.grade, newGrade };
      })
    );

    const gradeStats = gradeUpdateResults.reduce(
      (acc, result) => {
        if (result.status === 'fulfilled') {
          if (result.value.initialGrade !== result.value.newGrade) {
            acc.successCount++;
          } else {
            acc.noChangeCount++;
          }
        } else {
          acc.failCount++;
        }
        return acc;
      },
      { successCount: 0, noChangeCount: 0, failCount: 0 }
    );

    console.log(`${gradeUpdates.size}명의 유저 등급 검사 완료`);
    console.log(
      `등급 상승: ${gradeStats.successCount}, 변경 없음: ${gradeStats.noChangeCount}, 처리 실패: ${gradeStats.failCount}`
    );
    console.log('모든 챌린지 처리 완료');
  } catch (error) {
    console.error('챌린지 처리 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

processChallenges();
