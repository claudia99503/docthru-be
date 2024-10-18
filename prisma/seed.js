import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const users = [
  {
    role: 'USER',
    nickname: '테스트1',
    email: 'test1@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '테스트2',
    email: 'test2@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저3',
    email: 'user3@example.com',
    password: 'password3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저4',
    email: 'user4@example.com',
    password: 'password4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '관리자5',
    email: 'admin5@example.com',
    password: 'password5',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저6',
    email: 'user6@example.com',
    password: '12345678',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '테스트7',
    email: 'test7@example.com',
    password: '87654321',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '관리자8',
    email: 'admin8@example.com',
    password: 'adminpass8',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저9',
    email: 'user9@example.com',
    password: 'userpass9',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '테스트10',
    email: 'test10@example.com',
    password: 'testpass10',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '슈퍼유저11',
    email: 'superuser11@example.com',
    password: 'superpass11',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '전문가12',
    email: 'expert12@example.com',
    password: 'expertpass12',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저13',
    email: 'user13@example.com',
    password: 'password13',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '관리자14',
    email: 'admin14@example.com',
    password: 'adminpass14',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '전문가15',
    email: 'expert15@example.com',
    password: 'expertpass15',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const challenges = [
  {
    userId: 1,
    title: 'NEXTJS 문서 번역 챌린지',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: '번역 부탁 드립니다!',
    docUrl: 'https://www.nextjs.org/docs',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 5,
  },
  {
    userId: 2,
    title: 'API 가이드 번역 챌린지',
    field: 'API',
    docType: 'BLOG',
    description: 'API 사용 방법을 번역해 주세요.',
    docUrl:
      'https://www.developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 3,
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
    userId: 4,
    title: 'MODERNJS 블로그 번역 챌린지',
    field: 'MODERNJS',
    docType: 'BLOG',
    description: '모던 자바스크립트에 대한 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.exploringjs.com/impatient-js/',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 7,
  },
  {
    userId: 5,
    title: 'WEB 기술 공식 문서 번역 챌린지',
    field: 'WEB',
    docType: 'OFFICIAL',
    description: '웹 기술 관련 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.developer.mozilla.org/en-US/docs/Web',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 6,
  },
  {
    userId: 6,
    title: 'NEXTJS 블로그 번역 챌린지',
    field: 'NEXTJS',
    docType: 'BLOG',
    description: 'NEXTJS 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.vercel.com/blog/introducing-nextjs',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 5,
  },
  {
    userId: 7,
    title: 'API 공식 문서 번역 챌린지',
    field: 'API',
    docType: 'OFFICIAL',
    description: 'API에 대한 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.swagger.io/docs/',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 9,
  },
  {
    userId: 8,
    title: 'CAREER 블로그 번역 챌린지',
    field: 'CAREER',
    docType: 'BLOG',
    description: '커리어 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.hbr.org/topic/career-planning',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 4,
  },
  {
    userId: 9,
    title: 'MODERNJS 공식 문서 번역 챌린지',
    field: 'MODERNJS',
    docType: 'OFFICIAL',
    description: '모던 자바스크립트에 대한 공식 문서를 번역해 주세요.',
    docUrl: 'https://www.developer.mozilla.org/en-US/docs/Web/JavaScript',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 6,
  },
  {
    userId: 10,
    title: 'WEB 블로그 번역 챌린지',
    field: 'WEB',
    docType: 'BLOG',
    description: '웹 기술 관련 블로그 글을 번역해 주세요.',
    docUrl: 'https://www.web.dev/blog/',
    deadline: '1970-01-01T00:00:00.000Z',
    participants: 0,
    maxParticipants: 8,
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
      'NEXTJS 공식 문서에서 기본적인 개념과 페이지 구조에 대한 내용을 번역했습니다.\n' +
      'Next.js는 React 프레임워크로, SSR(Server-Side Rendering) 및 정적 사이트 생성(Static Site Generation)을 지원합니다.\n' +
      '문서에서는 기본적인 페이지 생성 방법과 라우팅 시스템에 대해 설명하고 있습니다.\n' +
      '특히, 파일 기반 라우팅(File-based Routing) 방식이 매우 직관적이며,\n' +
      '폴더 구조만으로도 다양한 경로 설정이 가능한 점이 강조되어 있습니다.\n' +
      '또한, 동적 라우팅(Dynamic Routing)을 구현하는 방법과 관련 예제 코드가 포함되어 있어\n' +
      '개발자가 쉽게 따라할 수 있습니다.\n' +
      'Next.js의 주요 기능 중 하나인 Image 컴포넌트에 대해서도 다루고 있으며,\n' +
      '이미지 최적화 및 자동 크기 조정과 같은 기능이 어떻게 성능을 개선하는지 설명하고 있습니다.\n' +
      '또한, 서버 측 데이터를 가져오는 getServerSideProps와 정적 데이터를 가져오는 getStaticProps의 차이점과 사용 사례도 다룹니다.\n' +
      '이 문서는 Next.js의 다양한 기능을 사용하여 효율적으로 웹 애플리케이션을 구축할 수 있도록 돕습니다.\n' +
      'React 개발자가 Next.js로 전환할 때 겪을 수 있는 변화와,\n' +
      '해당 변화가 어떻게 개발 과정의 생산성을 높이는지에 대해서도 상세히 기술되어 있습니다.',
  },
  {
    userId: 2,
    challengeId: 2,
    content:
      'API 사용 방법을 설명하는 블로그 내용을 번역했습니다.\n' +
      '이 글은 클라이언트 측에서 웹 API를 호출하는 기본적인 방법을 소개하며,\n' +
      'RESTful API의 개념을 쉽게 이해할 수 있도록 도와줍니다.\n' +
      '특히, XMLHttpRequest와 Fetch API를 사용하여 데이터를 가져오는 예제 코드가 포함되어 있습니다.\n' +
      'Fetch API를 사용한 간단한 GET 요청과 POST 요청의 차이점과\n' +
      '이를 어떻게 처리하는지 단계별로 설명하고 있습니다.\n' +
      '또한, 비동기 함수와 async/await의 개념을 함께 사용하여,\n' +
      'API 호출 시 코드의 가독성을 높이는 방법에 대해서도 언급하고 있습니다.\n' +
      '블로그는 초보자들이 직면할 수 있는 일반적인 오류들과\n' +
      '이를 해결하는 방법, 예를 들어 CORS 문제와 같은 것에 대해서도 자세히 다루고 있습니다.\n' +
      '마지막으로, RESTful API의 엔드포인트 설계와 데이터 직렬화/역직렬화 과정도 설명하여\n' +
      '개발자가 API를 보다 효율적으로 사용할 수 있도록 돕습니다.',
  },
  {
    userId: 3,
    challengeId: 3,
    content:
      '커리어 개발을 위한 조언과 면접 준비 방법을 다룬 공식 문서를 번역했습니다.\n' +
      '이 문서에서는 면접에서 자주 묻는 질문들과 이에 대한 적절한 답변을 준비하는 방법을 설명하고 있습니다.\n' +
      '특히, STAR 기법을 사용하여 구조화된 답변을 작성하는 방법이 강조됩니다.\n' +
      '또한, 지원하는 직무에 따라 면접 준비를 어떻게 달리해야 하는지에 대한 실질적인 조언도 포함되어 있습니다.\n' +
      '예를 들어, 기술 직군의 경우 데이터 구조와 알고리즘 문제를 해결하는 연습이 필요하며,\n' +
      '비기술 직군에서는 상황 대처 능력과 팀워크를 강조하는 것이 중요하다고 합니다.\n' +
      '문서에는 또한 면접관이 평가하는 주요 역량에 대한 리스트와,\n' +
      '자기 소개 시 자신의 강점을 효과적으로 드러내는 방법도 설명되어 있습니다.\n' +
      '추가적으로, 면접 전날의 준비 사항과 면접 당일 긴장을 완화하는 방법도 다루고 있습니다.\n' +
      '이 문서는 특히 커리어 전환을 고려하는 사람들에게 유용한 정보를 제공하며,\n' +
      '자신감을 가지고 면접에 임할 수 있도록 돕습니다.',
  },
  {
    userId: 4,
    challengeId: 4,
    content:
      '모던 자바스크립트에 대해 다룬 블로그 글을 번역했습니다.\n' +
      '이 글에서는 자바스크립트의 최신 기능과 비동기 프로그래밍 기법에 대해 상세히 설명하고 있습니다.\n' +
      'ES6 이상의 새로운 기능들, 예를 들어 let, const, 화살표 함수, 템플릿 리터럴 등을 포함하여\n' +
      '코드를 더 간결하고 이해하기 쉽게 작성하는 방법을 제시합니다.\n' +
      '또한, 비동기 프로그래밍의 기본 개념인 콜백 함수의 문제점과\n' +
      '이를 해결하기 위한 프로미스(Promise)의 도입 배경도 설명되어 있습니다.\n' +
      '프로미스 체이닝을 통해 비동기 작업을 순차적으로 수행하는 예제와\n' +
      '에러 핸들링을 위한 .catch() 메서드의 사용법도 함께 다루고 있습니다.\n' +
      '그리고 async/await 키워드를 사용하여 비동기 코드를 동기적으로 작성하는 방법과\n' +
      '이로 인해 코드의 가독성과 유지보수성이 어떻게 향상되는지도 설명하고 있습니다.\n' +
      '모던 자바스크립트의 장점을 최대한 활용하기 위한 팁과 함께,\n' +
      '실제 개발 환경에서 자주 사용하는 예제들이 포함되어 있어 실용적입니다.',
  },
  {
    userId: 5,
    challengeId: 5,
    content:
      '웹 기술의 기초부터 심화 개념까지 다룬 MDN의 공식 문서를 번역했습니다.\n' +
      '이 문서는 HTML, CSS, JavaScript에 대한 기초적인 개념을 소개하며,\n' +
      '각각의 언어가 웹 페이지에서 어떤 역할을 하는지 설명하고 있습니다.\n' +
      'HTML로 웹 페이지의 구조를 정의하고, CSS로 스타일링을 하며,\n' +
      'JavaScript로 동적인 기능을 추가하는 과정을 단계별로 설명합니다.\n' +
      '특히, CSS Flexbox와 Grid 레이아웃을 사용하여 반응형 웹 디자인을 구현하는 방법도 포함되어 있습니다.\n' +
      'JavaScript 부분에서는 DOM(Document Object Model) 조작을 통해\n' +
      '사용자와 상호작용하는 웹 페이지를 만드는 방법이 예제와 함께 설명됩니다.\n' +
      '또한, 웹 접근성(Web Accessibility)에 대한 중요성도 강조되며,\n' +
      '모든 사용자가 웹 콘텐츠에 접근할 수 있도록 만드는 방법에 대한 가이드라인도 포함되어 있습니다.\n' +
      '이 문서는 특히 초보 개발자가 웹 개발의 기본을 탄탄히 다질 수 있도록 돕는 유용한 자료입니다.',
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
  await prisma.$transaction(async (tx) => {
    await tx.feedback.deleteMany();
    await tx.like.deleteMany();
    await tx.work.deleteMany();
    await tx.participation.deleteMany();
    await tx.challenge.deleteMany();
    await tx.user.deleteMany();

    await tx.user.createMany({
      data: users,
    });

    const createdUsers = await tx.user.findMany({
      select: { id: true },
    });

    const challengesWithUserIds = challenges.map((challenge) => ({
      ...challenge,
      userId: createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
    }));

    await tx.challenge.createMany({
      data: challengesWithUserIds,
    });

    const createdChallenges = await tx.challenge.findMany({
      select: { id: true },
    });

    const participationsWithIds = participants.map((participation) => ({
      ...participation,
      userId: createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
      challengeId:
        createdChallenges[Math.floor(Math.random() * createdChallenges.length)]
          .id,
    }));

    await tx.participation.createMany({
      data: participationsWithIds,
    });

    const worksWithIds = works.map((work) => ({
      ...work,
      userId: createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
      challengeId:
        createdChallenges[Math.floor(Math.random() * createdChallenges.length)]
          .id,
    }));

    await tx.work.createMany({
      data: worksWithIds,
    });

    const createdWorks = await tx.work.findMany({
      select: { id: true },
    });

    const likesWithIds = likes.map((like) => ({
      ...like,
      userId: createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
      workId: createdWorks[Math.floor(Math.random() * createdWorks.length)].id,
    }));

    await tx.like.createMany({
      data: likesWithIds,
    });

    const feedbacksWithIds = feedbacks.map((feedback) => ({
      ...feedback,
      userId: createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
      workId: createdWorks[Math.floor(Math.random() * createdWorks.length)].id,
    }));

    await tx.feedback.createMany({
      data: feedbacksWithIds,
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
