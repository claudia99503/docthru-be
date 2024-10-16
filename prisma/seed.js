import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const users = [
  {
    role: 'USER',
    grade: 'NORMAL',
    nickname: '테스트1',
    email: 'test1@example.com',
    password: '12341234',
  },
  {
    role: 'ADMIN',
    grade: 'EXPERT',
    nickname: '테스트2',
    email: 'test2@example.com',
    password: '12341234',
  },
  {
    role: 'USER',
    grade: 'EXPERT',
    nickname: '유저3',
    email: 'user3@example.com',
    password: 'password3',
  },
  {
    role: 'USER',
    grade: 'NORMAL',
    nickname: '유저4',
    email: 'user4@example.com',
    password: 'password4',
  },
  {
    role: 'ADMIN',
    grade: 'NORMAL',
    nickname: '관리자5',
    email: 'admin5@example.com',
    password: 'password5',
  },
  {
    role: 'USER',
    grade: 'EXPERT',
    nickname: '유저6',
    email: 'user6@example.com',
    password: '12345678',
  },
  {
    role: 'USER',
    grade: 'NORMAL',
    nickname: '테스트7',
    email: 'test7@example.com',
    password: '87654321',
  },
  {
    role: 'ADMIN',
    grade: 'EXPERT',
    nickname: '관리자8',
    email: 'admin8@example.com',
    password: 'adminpass8',
  },
  {
    role: 'USER',
    grade: 'NORMAL',
    nickname: '유저9',
    email: 'user9@example.com',
    password: 'userpass9',
  },
  {
    role: 'USER',
    grade: 'NORMAL',
    nickname: '테스트10',
    email: 'test10@example.com',
    password: 'testpass10',
  },
  {
    role: 'ADMIN',
    grade: 'EXPERT',
    nickname: '슈퍼유저11',
    email: 'superuser11@example.com',
    password: 'superpass11',
  },
  {
    role: 'USER',
    grade: 'EXPERT',
    nickname: '전문가12',
    email: 'expert12@example.com',
    password: 'expertpass12',
  },
  {
    role: 'USER',
    grade: 'NORMAL',
    nickname: '유저13',
    email: 'user13@example.com',
    password: 'password13',
  },
  {
    role: 'ADMIN',
    grade: 'NORMAL',
    nickname: '관리자14',
    email: 'admin14@example.com',
    password: 'adminpass14',
  },
  {
    role: 'USER',
    grade: 'EXPERT',
    nickname: '전문가15',
    email: 'expert15@example.com',
    password: 'expertpass15',
  },
];

const challenges = [
  {
    title: 'NEXTJS 문서 번역 챌린지',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: '번역 부탁 드립니다!',
    docUrl: 'https://www.example.com',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 5,
  },
  {
    title: 'API 가이드 번역 챌린지',
    field: 'API',
    docType: 'BLOG',
    description: 'API 사용 방법을 번역해 주세요.',
    docUrl: 'https://www.example.com/api',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    title: 'CAREER 관련 문서 번역 챌린지',
    field: 'CAREER',
    docType: 'OFFICIAL',
    description: '커리어 관련 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.example.com/career',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 8,
  },
  {
    title: 'MODERNJS 블로그 번역 챌린지',
    field: 'MODERNJS',
    docType: 'BLOG',
    description: '모던 자바스크립트에 대한 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.example.com/modernjs',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 7,
  },
  {
    title: 'WEB 기술 공식 문서 번역 챌린지',
    field: 'WEB',
    docType: 'OFFICIAL',
    description: '웹 기술 관련 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.example.com/web',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 6,
  },
  {
    title: 'NEXTJS 블로그 번역 챌린지',
    field: 'NEXTJS',
    docType: 'BLOG',
    description: 'NEXTJS 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.example.com/nextjs-blog',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 5,
  },
  {
    title: 'API 공식 문서 번역 챌린지',
    field: 'API',
    docType: 'OFFICIAL',
    description: 'API에 대한 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.example.com/api-official',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 9,
  },
  {
    title: 'CAREER 블로그 번역 챌린지',
    field: 'CAREER',
    docType: 'BLOG',
    description: '커리어 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.example.com/career-blog',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 4,
  },
  {
    title: 'MODERNJS 공식 문서 번역 챌린지',
    field: 'MODERNJS',
    docType: 'OFFICIAL',
    description: '모던 자바스크립트에 대한 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.example.com/modernjs-official',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 6,
  },
  {
    title: 'WEB 블로그 번역 챌린지',
    field: 'WEB',
    docType: 'BLOG',
    description: '웹 기술 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.example.com/web-blog',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 8,
  },
];

const applications = [
  {
    userId: 1,
    challengeId: 1,
    status: 'WAITING',
  },
  {
    userId: 2,
    challengeId: 2,
    status: 'ACCEPTED',
  },
  {
    userId: 3,
    challengeId: 3,
    status: 'REJECTED',
  },
  {
    userId: 4,
    challengeId: 4,
    status: 'DELETED',
  },
  {
    userId: 5,
    challengeId: 5,
    status: 'WAITING',
  },
  {
    userId: 6,
    challengeId: 6,
    status: 'ACCEPTED',
  },
  {
    userId: 7,
    challengeId: 7,
    status: 'REJECTED',
  },
  {
    userId: 8,
    challengeId: 8,
    status: 'DELETED',
  },
  {
    userId: 9,
    challengeId: 9,
    status: 'WAITING',
  },
  {
    userId: 10,
    challengeId: 10,
    status: 'ACCEPTED',
  },
];

const participants = [
  {
    userId: 1,
    challengeId: 1,
  },
  {
    userId: 2,
    challengeId: 2,
  },
  {
    userId: 3,
    challengeId: 3,
  },
  {
    userId: 4,
    challengeId: 4,
  },
  {
    userId: 5,
    challengeId: 5,
  },
  {
    userId: 6,
    challengeId: 6,
  },
  {
    userId: 7,
    challengeId: 7,
  },
  {
    userId: 8,
    challengeId: 8,
  },
  {
    userId: 9,
    challengeId: 9,
  },
  {
    userId: 10,
    challengeId: 10,
  },
];

const works = [
  {
    userId: 1,
    challengeId: 1,
    content: '번역1 내용 입니다.',
  },
  {
    userId: 2,
    challengeId: 2,
    content: '번역2 내용 입니다.',
  },
  {
    userId: 3,
    challengeId: 3,
    content: '번역3 내용 입니다.',
  },
  {
    userId: 4,
    challengeId: 4,
    content: '번역4 내용 입니다.',
  },
  {
    userId: 5,
    challengeId: 5,
    content: '번역5 내용 입니다.',
  },
  {
    userId: 6,
    challengeId: 6,
    content: '번역6 내용 입니다.',
  },
  {
    userId: 7,
    challengeId: 7,
    content: '번역7 내용 입니다.',
  },
  {
    userId: 8,
    challengeId: 8,
    content: '번역8 내용 입니다.',
  },
  {
    userId: 9,
    challengeId: 9,
    content: '번역9 내용 입니다.',
  },
  {
    userId: 10,
    challengeId: 10,
    content: '번역10 내용 입니다.',
  },
];

const likes = [
  {
    userId: 1,
    workId: 1,
  },
  {
    userId: 2,
    workId: 2,
  },
  {
    userId: 3,
    workId: 3,
  },
  {
    userId: 4,
    workId: 4,
  },
  {
    userId: 5,
    workId: 5,
  },
  {
    userId: 6,
    workId: 6,
  },
  {
    userId: 7,
    workId: 7,
  },
  {
    userId: 8,
    workId: 8,
  },
  {
    userId: 9,
    workId: 9,
  },
  {
    userId: 10,
    workId: 10,
  },
];
const feedbacks = [
  {
    userId: 1,
    workId: 1,
    content: '피드백1 드립니다.',
  },
  {
    userId: 2,
    workId: 2,
    content: '피드백2 드립니다.',
  },
  {
    userId: 3,
    workId: 3,
    content: '피드백3 드립니다.',
  },
  {
    userId: 4,
    workId: 4,
    content: '피드백4 드립니다.',
  },
  {
    userId: 5,
    workId: 5,
    content: '피드백5 드립니다.',
  },
  {
    userId: 6,
    workId: 6,
    content: '피드백6 드립니다.',
  },
  {
    userId: 7,
    workId: 7,
    content: '피드백7 드립니다.',
  },
  {
    userId: 8,
    workId: 8,
    content: '피드백8 드립니다.',
  },
  {
    userId: 9,
    workId: 9,
    content: '피드백9 드립니다.',
  },
  {
    userId: 10,
    workId: 10,
    content: '피드백10 드립니다.',
  },
];

async function main() {
  await prisma.user.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.work.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.participation.deleteMany();
  await prisma.like.deleteMany();
  await prisma.application.deleteMany();
  await prisma.user.createMany({
    data: users,
  });
  await prisma.challenge.createMany({
    data: challenges,
  });
  await prisma.application.createMany({
    data: applications,
  });
  await prisma.participation.createMany({
    data: participants,
  });
  await prisma.work.createMany({
    data: works,
  });
  await prisma.like.createMany({
    data: likes,
  });
  await prisma.feedback.createMany({
    data: feedbacks,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
