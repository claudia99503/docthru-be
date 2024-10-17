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
      include: {
        participations: true,
        works: { include: { likes: true } },
      },
    });

    console.log(`마감할 챌린지 ${challengesToClose.length}개 처리 시작`);

    const challengeUpdates = [];
    const userUpdates = [];
    const notifications = [];
    const gradeUpdates = [];

    for (const challenge of challengesToClose) {
      challengeUpdates.push({ id: challenge.id, progress: true });

      const participantIds = challenge.participations.map((p) => p.userId);
      notifications.push({
        participantIds,
        challengeId: challenge.id,
        title: challenge.title,
        now,
      });

      const maxLikes = Math.max(
        ...challenge.works.map((work) => work.likes.length)
      );
      const bestWorks = challenge.works.filter(
        (work) => work.likes.length === maxLikes
      );

      for (const work of bestWorks) {
        userUpdates.push({ id: work.userId, increment: 1 });
      }

      gradeUpdates.push(...participantIds);
    }

    await prisma.$transaction(async (tx) => {
      await tx.challenge.updateMany({
        where: { id: { in: challengeUpdates.map((c) => c.id) } },
        data: { progress: true },
      });

      for (const update of userUpdates) {
        await tx.user.update({
          where: { id: update.id },
          data: { bestCount: { increment: update.increment } },
        });
      }
    });

    for (const notif of notifications) {
      await notifyMultipleUsers(
        notif.participantIds,
        notifyDeadline,
        null,
        notif.challengeId,
        notif.title,
        notif.now
      );
    }

    const uniqueUserIds = Array.from(new Set(gradeUpdates));
    let successCount = 0;
    let failCount = 0;
    let noChangeCount = 0;

    for (const userId of uniqueUserIds) {
      try {
        const initialGrade = await prisma.user.findUnique({
          where: { id: userId },
          select: { grade: true },
        });

        await updateUserGrade(userId);

        const updatedGrade = await prisma.user.findUnique({
          where: { id: userId },
          select: { grade: true },
        });

        if (initialGrade.grade !== updatedGrade.grade) {
          successCount++;
        } else {
          noChangeCount++;
        }
      } catch (error) {
        console.error(`Failed to update grade for user ${userId}:`, error);
        failCount++;
      }
    }

    console.log(`${uniqueUserIds.length}명의 유저 등급 검사 완료`);
    console.log(
      `등급 상승: ${successCount}, 변경 없음: ${noChangeCount}, 처리 실패: ${failCount}`
    );
    console.log('모든 챌린지 처리 완료');
  } catch (error) {
    console.error('챌린지 처리 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma 연결 종료');
  }
}

processChallenges();
