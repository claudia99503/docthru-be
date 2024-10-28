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
                works: {
                  where: {
                    challengeId: {
                      equals: prisma.challenge.fields.id,
                    },
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

        if (participation.user.works.length > 0) {
          joinCountUpdates.add(participation.userId);
        }

        gradeUpdates.add(participation.userId);
      });

      const maxLikes = Math.max(
        ...challenge.works.map((w) => w._count.likes),
        0
      );
      challenge.works.forEach((work) => {
        if (work._count.likes === maxLikes) {
          bestCountUpdates.set(
            work.userId,
            (bestCountUpdates.get(work.userId) || 0) + 1
          );
        }
      });
    });

    await prisma.$transaction(async (tx) => {
      // 챌린지 상태 업데이트
      await tx.challenge.updateMany({
        where: { id: { in: challengeIds } },
        data: { progress: true },
      });

      // 베스트 작품 카운트 업데이트
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

      // 참여 카운트 업데이트
      if (joinCountUpdates.size > 0) {
        await tx.user.updateMany({
          where: { id: { in: Array.from(joinCountUpdates) } },
          data: { joinCount: { increment: 1 } },
        });
      }

      // 알림 생성
      await createNotificationBatch(notifications);
    });

    // 유저 등급 업데이트
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
