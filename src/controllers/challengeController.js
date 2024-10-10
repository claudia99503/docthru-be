import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getChallenges(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const take = parseInt(req.query.take) || 10;
    const skip = (page - 1) * take;
    const orderByField = req.query.orderByField || 'id';
    const orderByDir = req.query.orderByDir || 'asc';
    const challenges = await prisma.challenge.findMany({
      skip,
      take,
      orderBy: { [orderByField]: orderByDir },
      where: {
        applications: {
          some: {
            status: 'ACCEPTED',
          },
        },
      },
    });

    return res.status(200).json(challenges);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function getChallengeById(req, res) {
  try {
    const { challengeId } = req.params;
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      include: {
        applications: {
          include: {
            user: {
              select: {
                nickName: true,
                grade: true,
              },
            },
          },
        },
      },
    });

    const dataFilter = {
      id: challenge.id,
      title: challenge.title,
      field: challenge.field,
      docType: challenge.docType,
      description: challenge.description,
      docUrl: challenge.docUrl,
      deadline: challenge.deadline,
      progress: challenge.progress,
      participates: challenge.participates,
      maxParticipates: challenge.maxParticipates,
      applications: challenge.applications.map((app) => ({
        id: app.id,
        userId: app.userId,
        nickName: app.user.nickName,
        grade: app.user.grade,
      })),
    };

    return res.status(200).json(dataFilter);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function patchChallengeById(req, res) {
  const { role } = req.user;

  if (role !== 'ADMIN') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  try {
    const { challengeId } = req.params;
    const {
      title,
      field,
      docType,
      description,
      docUrl,
      deadline,
      progress,
      participates,
      maxParticipates,
    } = req.body;

    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId, 10) },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!challenge) {
      return res
        .status(404)
        .json({ message: '챌린지를 찾을 수 없습니다.' });
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: parseInt(challengeId, 10) },
      data: {
        title: title || challenge.title,
        field: field || challenge.field,
        docType: docType || challenge.docType,
        description: description || challenge.description,
        docUrl: docUrl || challenge.docUrl,
        deadline: deadline || challenge.deadline,
        progress: progress || challenge.progress,
        participates: participates || challenge.participates,
        maxParticipates: maxParticipates || challenge.maxParticipates,
      },
    });

    return res.status(200).json(updatedChallenge);
  } catch (error) {
    return res.status(500).json(error);
  }
}
