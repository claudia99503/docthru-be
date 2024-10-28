import prisma from '../lib/prisma.js';
import {
  BadRequestException,
  NotFoundException,
} from '../errors/customException.js';

const createDefaultProfile = async (userId) => {
  return await prisma.profile.create({
    data: {
      userId: parseInt(userId),
      bio: null,
      location: null,
      career: null,
      position: null,
      skills: [],
      preferredFields: [],
      githubUrl: null,
    },
  });
};

export const getProfile = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId: parseInt(userId) },
    include: {
      user: {
        include: {
          participations: true,
        },
      },
    },
  });

  if (!profile) {
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userExists) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    return await createDefaultProfile(userId);
  }

  const challengeList = await Promise.all(
    profile.user.participations.map(async (participation) => {
      const challenge = await prisma.challenge.findUnique({
        where: { id: Number(participation.challengeId) },
      });
      return {
        ...challenge,
      };
    })
  );

  const data = {
    id: profile.id,
    userId: profile.userId,
    bio: profile.bio,
    location: profile.location,
    career: profile.career,
    position: profile.position,
    skills: profile.skills,
    preferredFields: profile.preferredFields,
    githubUrl: profile.githubUrl,
    createdAt: profile.createdAt,
    updatedAt: profile.challengeList,
    user: {
      nickname: profile.user.nickname,
      image: profile.user.image,
      email: profile.user.email,
      grade: profile.user.grade,
      createdAt: profile.user.createdAt,
    },
    list: challengeList,
  };

  return data;
};

export const createProfile = async (userId) => {
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: parseInt(userId) },
  });

  if (existingProfile) {
    throw new BadRequestException('이미 프로필이 존재합니다.');
  }

  const userExists = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!userExists) {
    throw new NotFoundException('존재하지 않는 사용자입니다.');
  }

  return await createDefaultProfile(userId);
};

export const updateProfile = async (userId, profileData) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) {
    throw new NotFoundException('존재하지 않는 사용자입니다.');
  }

  const {
    bio,
    location,
    career,
    position,
    skills,
    preferredFields,
    githubUrl,
  } = profileData;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: parseInt(userId) },
      update: {
        bio,
        location,
        career,
        position,
        skills,
        preferredFields,
        githubUrl,
      },
      create: {
        userId: parseInt(userId),
        bio,
        location,
        career,
        position,
        skills: skills || [],
        preferredFields: preferredFields || [],
        githubUrl,
      },
    });

    return profile;
  } catch (error) {
    if (error.code === 'P2003') {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    throw error;
  }
};
