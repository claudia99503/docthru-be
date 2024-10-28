import prisma from '../src/lib/prisma.js';
import { createNotificationBatch } from '../src/services/notificationService.js';
import { updateUserGradeBatch } from '../src/services/userServices.js';

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
        participations: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                works: {
                  select: {
                    id: true,
                    challengeId: true,
                  },
                },
              },
            },
          },
        },
        works: {
          select: {
            userId: true,
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
      },
    });

    console.log(`${challengesToClose.length}개의 챌린지 처리 시작`);

    const challengeIds = challengesToClose.map((c) => c.id);
    const bestCountUpdates = new Map();
    const joinCountUpdates = new Set();
    const notifications = [];
    const gradeUpdates = new Set();

    challengesToClose.forEach((challenge) => {
      challenge.participations.forEach((participation) => {
        // 해당 챌린지에 대한 사용자의 작업 확인
        const userWorks = participation.user.works.filter(
          (work) => work.challengeId === challenge.id
        );

        notifications.push({
          userId: participation.userId,
          type: 'DEADLINE',
          content: `'${challenge.title}'이 마감되었어요 (${
            now.toISOString().split('T')[0]
          })`,
          challengeId: challenge.id,
          createdAt: now,
          isRead: false,
        });

        if (userWorks.length > 0) {
          joinCountUpdates.add(participation.userId);
        }

        gradeUpdates.add(participation.userId);
      });

      const maxLikes = Math.max(
        ...challenge.works.map((w) => w._count.likes),
        0
      );

      challenge.works.forEach((work) => {
        if (work._count.likes === maxLikes && maxLikes > 0) {
          bestCountUpdates.set(
            work.userId,
            (bestCountUpdates.get(work.userId) || 0) + 1
          );
        }
      });
    });

    await prisma.$transaction(async (tx) => {
      await tx.challenge.updateMany({
        where: { id: { in: challengeIds } },
        data: { progress: true },
      });

      if (bestCountUpdates.size > 0) {
        await Promise.all(
          Array.from(bestCountUpdates).map(([userId, increment]) =>
            tx.user.update({
              where: { id: userId },
              data: { bestCount: { increment } },
            })
          )
        );
      }

      if (joinCountUpdates.size > 0) {
        await tx.user.updateMany({
          where: { id: { in: Array.from(joinCountUpdates) } },
          data: { joinCount: { increment: 1 } },
        });
      }

      await createNotificationBatch(notifications);
    });

    if (gradeUpdates.size > 0) {
      await updateUserGradeBatch(Array.from(gradeUpdates));
      console.log(`${gradeUpdates.size}명의 유저 등급 검사 완료`);
    }

    console.log('모든 챌린지 처리 완료');
  } catch (error) {
    console.error('챌린지 처리 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

processChallenges();
