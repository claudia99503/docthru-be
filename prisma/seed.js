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
    docUrl: 'https://nextjs.org/docs',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 5,
  },
  {
    title: 'API 가이드 번역 챌린지',
    field: 'API',
    docType: 'BLOG',
    description: 'API 사용 방법을 번역해 주세요.',
    docUrl:
      'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    title: 'CAREER 관련 문서 번역 챌린지',
    field: 'CAREER',
    docType: 'OFFICIAL',
    description: '커리어 관련 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.careerbuilder.com/advice',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 8,
  },
  {
    title: 'MODERNJS 블로그 번역 챌린지',
    field: 'MODERNJS',
    docType: 'BLOG',
    description: '모던 자바스크립트에 대한 블로그 글을 번역해 주세요.',
    docUrl: 'https://exploringjs.com/impatient-js/',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 7,
  },
  {
    title: 'WEB 기술 공식 문서 번역 챌린지',
    field: 'WEB',
    docType: 'OFFICIAL',
    description: '웹 기술 관련 공식 문서를 번역해 주세요.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 6,
  },
  {
    title: 'NEXTJS 블로그 번역 챌린지',
    field: 'NEXTJS',
    docType: 'BLOG',
    description: 'NEXTJS 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://vercel.com/blog/introducing-nextjs',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 5,
  },
  {
    title: 'API 공식 문서 번역 챌린지',
    field: 'API',
    docType: 'OFFICIAL',
    description: 'API에 대한 공식 문서를 번역해 주세요.',
    docUrl: 'https://swagger.io/docs/',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 9,
  },
  {
    title: 'CAREER 블로그 번역 챌린지',
    field: 'CAREER',
    docType: 'BLOG',
    description: '커리어 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://hbr.org/topic/career-planning',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 4,
  },
  {
    title: 'MODERNJS 공식 문서 번역 챌린지',
    field: 'MODERNJS',
    docType: 'OFFICIAL',
    description: '모던 자바스크립트에 대한 공식 문서를 번역해 주세요.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 6,
  },
  {
    title: 'WEB 블로그 번역 챌린지',
    field: 'WEB',
    docType: 'BLOG',
    description: '웹 기술 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://web.dev/blog/',
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
    content:
      'NEXTJS 공식 문서에서 기본적인 개념과 페이지 구조에 대한 내용을 번역했습니다. 페이지 생성 방법과 라우팅에 대해 설명하고 있습니다. 이 문서는 Next.js의 주요 기능과 사용 예제를 통해 개발자가 쉽게 웹 애플리케이션을 구축할 수 있도록 돕고 있습니다. 또한 Next.js에서 제공하는 SSR(서버사이드 렌더링)과 SSG(정적 사이트 생성)의 차이점과 사용 시나리오를 명확하게 설명하고 있습니다. 이를 통해 개발자들이 적절한 상황에 맞게 기능을 선택해 사용할 수 있도록 안내하고 있습니다.',
  },
  {
    userId: 2,
    challengeId: 2,
    content:
      'API 사용 방법을 설명하는 블로그 내용을 번역했습니다. 클라이언트 측에서 웹 API를 호출하는 기본적인 방법과 예제 코드가 포함되어 있습니다. 이 글은 초보자들이 쉽게 따라할 수 있도록 RESTful API의 개념과 간단한 호출 예제를 다루고 있습니다. 또한 이 글에서는 API 호출 시 발생할 수 있는 에러와 이를 처리하는 방법을 다루며, 실제 응용에서 활용 가능한 팁들을 제시하고 있습니다. 따라서 초보 개발자들도 자신감 있게 API를 사용할 수 있도록 돕는 유익한 자료입니다.',
  },
  {
    userId: 3,
    challengeId: 3,
    content:
      '커리어 개발을 위한 조언과 면접 준비 방법을 다룬 공식 문서를 번역했습니다. 다양한 직업군에 대한 팁이 포함되어 있습니다. 이 문서는 특히 효과적인 면접 준비를 위한 전략과 커리어 전환 시 고려해야 할 요소들에 대해 구체적으로 설명하고 있습니다. 이와 함께, 이력서 작성 시 강조해야 할 핵심 요소와 면접에서 자신을 어필하는 방법에 대해 단계별 가이드를 제공하고 있습니다. 더불어 커리어 성장에 있어 지속적인 학습과 네트워킹의 중요성도 강조하고 있습니다.',
  },
  {
    userId: 4,
    challengeId: 4,
    content:
      '모던 자바스크립트에 대해 다룬 블로그 글을 번역했습니다. 자바스크립트의 최신 기능과 비동기 프로그래밍에 대한 내용을 포함하고 있습니다. 이 글은 최신 ECMAScript 기능과 비동기 처리 방식에 대해 이해하기 쉽게 설명하고 있어 개발자들이 실무에 바로 적용할 수 있도록 돕고 있습니다. 특히 async/await와 같은 비동기 프로그래밍 패턴을 쉽게 이해할 수 있도록 다양한 예제를 포함하고 있으며, 각 예제의 실행 결과를 비교해가며 설명하고 있습니다. 이러한 자료들은 개발자가 비동기 처리의 개념을 명확히 하고 코드 작성 시 발생할 수 있는 오류를 최소화하는 데 도움을 줍니다.',
  },
  {
    userId: 5,
    challengeId: 5,
    content:
      '웹 기술의 기초부터 심화 개념까지 다룬 MDN의 공식 문서를 번역했습니다. HTML, CSS, JavaScript에 대한 기본 개념이 설명되어 있습니다. 이 문서는 웹 개발의 기초를 다지기 위한 필수적인 내용으로, 특히 초보 개발자에게 큰 도움이 될 수 있습니다. 또한, HTML과 CSS의 시멘틱 태그 및 접근성 개선을 위한 최선의 방법도 다루고 있으며, 이를 통해 보다 사용자 친화적인 웹 사이트를 구축할 수 있도록 돕습니다. 마지막으로, JavaScript의 기본적인 동작 원리와 이를 활용한 간단한 애플리케이션 제작 예제가 포함되어 있어 학습자가 실습을 통해 이해도를 높일 수 있도록 돕고 있습니다.',
  },
  {
    userId: 6,
    challengeId: 6,
    content:
      'NEXTJS 관련 블로그 글에서 Next.js의 특징과 사용 사례를 번역했습니다. 서버 사이드 렌더링과 정적 사이트 생성에 대해 설명하고 있습니다. 이 글은 Next.js의 다양한 기능을 이해하고 프로젝트에 적절히 적용할 수 있도록 실용적인 예제를 제공합니다. 특히, Next.js가 SEO(검색 엔진 최적화)에서 가지는 이점과 각 렌더링 방식이 웹사이트 성능에 미치는 영향을 비교하여 설명하고 있습니다. 또한, 실무에서의 성공적인 사용 사례를 통해 개발자들이 실제 프로젝트에 Next.js를 도입하는 방법을 보다 명확하게 이해할 수 있도록 돕고 있습니다.',
  },
  {
    userId: 7,
    challengeId: 7,
    content:
      'Swagger를 사용한 API 문서화에 대한 공식 문서를 번역했습니다. Swagger UI와 API 테스트 방법이 포함되어 있습니다. 이 문서는 Swagger를 활용해 API를 효율적으로 문서화하고 테스트하는 방법을 단계별로 안내하고 있습니다. 또한 Swagger를 사용함으로써 팀 내의 커뮤니케이션을 개선하고 API 개발 과정에서의 일관성을 유지하는 방법에 대해 설명하고 있습니다. 이를 통해 개발자들이 협업 프로젝트에서 API를 보다 체계적으로 관리하고 활용할 수 있도록 돕습니다.',
  },
  {
    userId: 8,
    challengeId: 8,
    content:
      '커리어 관련 블로그 글에서 네트워킹과 자기 계발 방법에 대한 내용을 번역했습니다. 성공적인 커리어 개발을 위한 팁이 포함되어 있습니다. 이 글은 특히 네트워킹의 중요성과 자기 계발을 위한 실질적인 방법을 제시하고 있어 커리어 성장을 돕습니다. 또한 네트워킹 이벤트에서 효과적으로 사람들과 연결되는 방법과 온라인 플랫폼을 활용한 인맥 구축 전략에 대해서도 구체적으로 설명하고 있습니다. 마지막으로, 지속적인 자기 계발을 위해 필요한 학습 도구와 리소스를 소개하며, 이를 통해 개인의 커리어 목표를 달성하는 데 실질적인 도움을 줄 수 있습니다.',
  },
  {
    userId: 9,
    challengeId: 9,
    content:
      '모던 자바스크립트의 기본 문법과 비동기 처리 방법을 다룬 공식 문서를 번역했습니다. ES6 이상의 문법이 주로 설명되어 있습니다. 이 문서는 최신 자바스크립트 기능을 통해 더 나은 코드 작성 방법을 배우고자 하는 개발자에게 적합합니다. 또한 비동기 처리를 위한 Promise, async/await의 사용법과 각각의 장단점에 대해 상세히 다루고 있어, 개발자들이 상황에 맞는 비동기 처리 방식을 선택할 수 있도록 돕습니다. 마지막으로, 비동기 코드를 디버깅하는 팁과 관련 도구들에 대한 설명도 포함되어 있어 실무에서 유용하게 활용할 수 있습니다.',
  },
  {
    userId: 10,
    challengeId: 10,
    content:
      '웹 기술 블로그 글에서 최신 웹 개발 동향과 성능 최적화에 대해 번역했습니다. Lighthouse와 같은 도구를 이용한 웹 성능 분석 방법이 포함되어 있습니다. 이 글은 최신 웹 기술 동향을 파악하고 웹 사이트의 성능을 개선하는 데 필요한 팁을 제공합니다. 특히, 웹페이지 로딩 속도를 개선하기 위한 이미지 최적화 및 코드 분할 방법에 대해 상세히 설명하고 있습니다. 또한, 실제 사례를 통해 이러한 최적화 방법들이 성능에 미치는 긍정적인 영향을 설명함으로써 개발자들이 실무에서 성능 최적화를 효과적으로 적용할 수 있도록 돕습니다.',
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
    content:
      '번역된 NEXTJS 문서에서 페이지 생성과 라우팅에 대한 설명이 명확하게 잘 되어 있습니다. 다만, 몇 가지 문법 오류와 표현이 다소 어색한 부분이 있어 수정이 필요합니다.',
  },
  {
    userId: 2,
    workId: 2,
    content:
      'API 사용 방법에 대한 설명이 전반적으로 잘 정리되어 있습니다. 특히 예제 코드가 이해하기 쉽게 작성되어 있습니다. 다만, API 호출의 일부 용어에 대한 부가 설명이 추가되면 좋겠습니다.',
  },
  {
    userId: 3,
    workId: 3,
    content:
      '커리어 개발을 위한 조언이 매우 유익합니다. 면접 준비 방법에 대한 부분이 구체적으로 잘 설명되어 있지만, 몇 가지 문장이 다소 긴 경향이 있어 가독성을 위해 나눠보면 좋겠습니다.',
  },
  {
    userId: 4,
    workId: 4,
    content:
      '모던 자바스크립트의 최신 기능에 대한 설명이 명확합니다. 비동기 프로그래밍에 대한 설명이 조금 더 상세했으면 좋겠고, 예제 코드가 추가된다면 더욱 도움이 될 것 같습니다.',
  },
  {
    userId: 5,
    workId: 5,
    content:
      '웹 기술의 기초에 대한 번역이 매우 잘 되어 있습니다. HTML과 CSS 부분은 특히 명확하지만, JavaScript 부분에 약간의 추가 설명이 있으면 더 좋을 것 같습니다.',
  },
  {
    userId: 6,
    workId: 6,
    content:
      'NEXTJS의 특징과 사용 사례에 대한 설명이 잘 정리되어 있습니다. 서버 사이드 렌더링에 대한 부분이 특히 명확하지만, 정적 사이트 생성에 대한 예시가 추가되면 좋겠습니다.',
  },
  {
    userId: 7,
    workId: 7,
    content:
      'Swagger 문서화에 대한 번역이 전반적으로 잘 되어 있습니다. Swagger UI에 대한 설명이 명확하지만, 테스트 방법에 대한 부분이 좀 더 구체적이면 좋겠습니다.',
  },
  {
    userId: 8,
    workId: 8,
    content:
      '커리어 개발과 네트워킹에 대한 번역이 유익합니다. 특히 자기 계발에 대한 조언이 잘 정리되어 있습니다. 몇 가지 문장이 다소 반복적이어서 간결하게 수정할 수 있으면 좋겠습니다.',
  },
  {
    userId: 9,
    workId: 9,
    content:
      '모던 자바스크립트의 ES6 문법 설명이 명확합니다. 다만, 비동기 처리 방법에 대한 예시 코드가 추가된다면 이해에 더 도움이 될 것 같습니다.',
  },
  {
    userId: 10,
    workId: 10,
    content:
      '웹 개발 동향과 성능 최적화에 대한 번역이 매우 잘 되어 있습니다. Lighthouse 도구에 대한 설명이 명확하지만, 실제 분석 결과의 예시가 추가되면 더욱 유익할 것 같습니다.',
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
