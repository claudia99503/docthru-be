import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getChallengeDeadline() {
  try {
    const now = new Date();
    const challenges = await prisma.challenge.findMany({
      where: {
        deadline: {
          lt: now,
        },
        progress: false,
      },
      data: {
        progress: true,
      },
    });
    return challenges;
  } catch (error) {
    throw error;
  }
}
