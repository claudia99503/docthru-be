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
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저4',
    email: 'user4@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '관리자5',
    email: 'admin5@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저6',
    email: 'user6@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '테스트7',
    email: 'test7@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '관리자8',
    email: 'admin8@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저9',
    email: 'user9@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '테스트10',
    email: 'test10@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '슈퍼유저11',
    email: 'superuser11@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '전문가12',
    email: 'expert12@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '유저13',
    email: 'user13@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'ADMIN',
    nickname: '관리자14',
    email: 'admin14@example.com',
    password: '12341234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'USER',
    nickname: '전문가15',
    email: 'expert15@example.com',
    password: '12341234',
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
  {
    userId: 9,
    title: 'NEXTJS Routing',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS 라우팅 문제에 대한 글을 번역 해주세요~',
    docUrl: 'https://nextjs.org/docs/app/building-your-application/routing',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 9,
    title: 'NEXTJS Data Fetching and cashing',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description:
      'NEXTJS Data Fetching and cashing 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 9,
    title: 'NEXTJS Server Actions and Mutations',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description:
      'NEXTJS Server Actions and Mutations 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 9,
    title: 'Incremental Static Regeneration',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description:
      'NEXTJS Incremental Static Regeneration 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/canary/app/building-your-application/data-fetching/incremental-static-regeneration',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 9,
    title: 'Server Components',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS Server Components 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 9,
    title: 'Client Components',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS Client Components 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/rendering/client-components',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 9,
    title: 'Server and Client Composition Patterns',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description:
      'NEXTJS Server and Client Composition Patterns 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 4,
    title: 'Partial Prerendering',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS Partial Prerendering 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 4,
    title: 'Runtimes',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS Runtimes 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 5,
    title: 'CSS',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS CSS 문제에 대한 글을 번역 해주세요~',
    docUrl: 'https://nextjs.org/docs/app/building-your-application/styling',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 2,
    title: 'Tailwind CSS',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS Tailwind CSS 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/styling/tailwind-css',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
  {
    userId: 2,
    title: 'Sass',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    description: 'NEXTJS Sass 문제에 대한 글을 번역 해주세요~',
    docUrl:
      'https://nextjs.org/docs/app/building-your-application/styling/sass',
    deadline: '2024-10-31T00:00:00.000Z',
    participants: 0,
    maxParticipants: 10,
  },
];

const participants = [
  {
    userId: 1,
    challengeId: 1,
  },
  {
    userId: 2,
    challengeId: 1,
  },
  {
    userId: 3,
    challengeId: 1,
  },
  {
    userId: 4,
    challengeId: 1,
  },
  {
    userId: 5,
    challengeId: 1,
  },
  {
    userId: 2,
    challengeId: 2,
  },
  {
    userId: 3,
    challengeId: 2,
  },
  {
    userId: 4,
    challengeId: 2,
  },
  {
    userId: 5,
    challengeId: 2,
  },
  {
    userId: 6,
    challengeId: 2,
  },
  {
    userId: 3,
    challengeId: 3,
  },
  {
    userId: 4,
    challengeId: 3,
  },
  {
    userId: 5,
    challengeId: 3,
  },
  {
    userId: 6,
    challengeId: 4,
  },
  {
    userId: 2,
    challengeId: 4,
  },
  {
    userId: 8,
    challengeId: 4,
  },
  {
    userId: 5,
    challengeId: 5,
  },
  {
    userId: 7,
    challengeId: 5,
  },
  {
    userId: 10,
    challengeId: 5,
  },
  {
    userId: 6,
    challengeId: 6,
  },
  {
    userId: 7,
    challengeId: 6,
  },
  {
    userId: 10,
    challengeId: 6,
  },
  {
    userId: 7,
    challengeId: 7,
  },
  {
    userId: 1,
    challengeId: 7,
  },
  {
    userId: 3,
    challengeId: 7,
  },
  {
    userId: 8,
    challengeId: 8,
  },
  {
    userId: 2,
    challengeId: 8,
  },
  {
    userId: 3,
    challengeId: 8,
  },
  {
    userId: 9,
    challengeId: 9,
  },
  {
    userId: 1,
    challengeId: 9,
  },
  {
    userId: 2,
    challengeId: 9,
  },
  {
    userId: 10,
    challengeId: 10,
  },
  {
    userId: 4,
    challengeId: 10,
  },
  {
    userId: 5,
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
    challengeId: 1,
    content:
      `Next.js의 데이터 패칭(Data Fetching) 방식에 대해 번역한 내용입니다.\n` +
      `Next.js는 페이지 렌더링 시점에 따라 다양한 데이터 패칭 전략을 제공합니다.\n` +
      `getServerSideProps는 서버 측에서 페이지 요청마다 데이터를 가져오는 방식이며,\n` +
      `getStaticProps는 빌드 시 데이터 패칭을 통해 정적 페이지를 생성합니다.\n` +
      `문서에서는 언제 어떤 방식이 적합한지에 대한 가이드라인과 성능 최적화 팁을 제공하고 있습니다.\n` +
      `특히, Incremental Static Regeneration(ISR)을 통해 정적 페이지의 재생성까지 지원하는 점이 강조되어 있습니다.\n` +
      `이를 통해 개발자는 사용자 경험을 개선하면서도 동적인 데이터를 사용할 수 있습니다.`,
  },
  {
    userId: 3,
    challengeId: 1,
    content:
      'Next.js의 API 라우트 기능에 대해 번역한 내용입니다.\n' +
      'Next.js는 프론트엔드와 백엔드가 같은 코드베이스에서 공존할 수 있도록 API 라우트를 제공합니다.\n' +
      `API 경로는 'pages/api' 디렉터리 아래에 파일을 추가하는 것만으로도 쉽게 생성할 수 있으며,\n` +
      '이를 통해 서버 측 코드를 간단하게 작성할 수 있습니다.\n' +
      '문서에서는 REST API를 구현하는 예제와, 이를 클라이언트에서 호출하여 데이터를 받아오는 방법을 설명하고 있습니다.\n' +
      '특히, 인증(Authentication)이나 데이터 처리와 같은 서버 측 로직을 프론트엔드와 연계하는 데 있어서의 이점이 강조되어 있습니다.',
  },
  {
    userId: 4,
    challengeId: 1,
    content:
      'Next.js의 스타일링 옵션에 대해 번역한 내용입니다.\n' +
      'Next.js는 다양한 스타일링 방법을 지원하며, CSS 모듈, 전역 CSS, 그리고 스타일드 컴포넌트와 같은 옵션을 제공합니다.\n' +
      '문서에서는 각 스타일링 방식의 장단점과 적용 방법에 대해 설명하고 있습니다.\n' +
      'CSS 모듈을 사용하여 컴포넌트 단위로 스타일을 캡슐화할 수 있는 방법과,\n' +
      'Styled-JSX를 사용해 컴포넌트 내에 스타일을 정의하는 방식에 대해서도 다룹니다.\n' +
      '또한, Tailwind CSS와 같은 외부 라이브러리를 Next.js에 통합하여 사용하는 방법도 예제와 함께 설명하고 있습니다.\n' +
      '이를 통해 개발자는 프로젝트의 규모와 요구에 맞는 스타일링 전략을 선택할 수 있습니다.',
  },
  {
    userId: 5,
    challengeId: 1,
    content:
      'Next.js의 이미지 최적화(Image Optimization) 기능에 대해 번역한 내용입니다.\n' +
      "Next.js는 'next/image' 컴포넌트를 통해 이미지 최적화를 자동으로 처리하여 성능을 극대화합니다.\n" +
      '문서에서는 이미지의 크기 조정, 지연 로딩(Lazy Loading), 그리고 다양한 포맷(WebP 등)으로의 자동 변환 기능에 대해 설명하고 있습니다.\n' +
      '이를 통해 사용자는 페이지 로딩 시간을 단축하고, 최적화된 이미지를 제공받을 수 있습니다.\n' +
      '또한, 외부 이미지 도메인을 설정하여 다양한 출처의 이미지를 안전하게 가져오는 방법도 다루고 있습니다.\n' +
      'Next.js의 이미지 최적화 기능은 SEO와 사용자 경험 측면에서 큰 이점을 제공한다고 문서는 강조하고 있습니다.',
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
    challengeId: 2,
    content:
      'API 인증(Authentication) 방법을 설명하는 블로그 내용을 번역했습니다.\n' +
      '이 문서는 클라이언트와 서버 간의 안전한 데이터 전송을 위한 인증 방법을 설명합니다.\n' +
      'Bearer 토큰과 API 키의 차이점, 그리고 이러한 방식이 어떻게 보안을 강화하는지 설명하고 있습니다.\n' +
      'OAuth 2.0 프로토콜의 기본 개념과, 이를 사용하여 타사 서비스에 접근하는 방법도 포함되어 있습니다.\n' +
      '문서에서는 인증 정보를 헤더에 포함시켜 서버로 전달하는 예제와 함께,\n' +
      '실제 구현 시 주의해야 할 보안 요소들에 대해 다루고 있습니다.\n' +
      '또한, JWT(JSON Web Token)를 사용하여 사용자 인증을 처리하는 방법과,\n' +
      '이를 통해 서버와 클라이언트 간의 신뢰 관계를 유지하는 기법에 대해서도 설명하고 있습니다.\n' +
      '마지막으로, API 인증과 관련된 모범 사례들을 통해\n' +
      'API를 안전하게 보호할 수 있는 전략들을 제시하고 있습니다.',
  },
  {
    userId: 4,
    challengeId: 2,
    content:
      'API 오류 처리에 대한 내용을 번역했습니다.\n' +
      'API 호출 시 발생할 수 있는 다양한 오류 상황과 이를 처리하는 방법을 다루고 있습니다.\n' +
      'HTTP 상태 코드(예: 404, 500 등)의 의미와, 각 코드에 따른 오류 처리 방법에 대해 설명합니다.\n' +
      '특히, 클라이언트 측에서 발생할 수 있는 네트워크 오류와 서버 오류를 구분하고,\n' +
      '적절하게 사용자에게 안내하는 방식을 제시하고 있습니다.\n' +
      '또한, try...catch 구문을 사용한 비동기 오류 처리와,\n' +
      '에러 메시지를 로그에 기록하는 등의 방법을 소개합니다.\n' +
      '이 문서에서는 개발자가 직면할 수 있는 일반적인 API 호출 실패 상황과,\n' +
      '이를 해결하기 위한 구체적인 코드 예제도 포함되어 있습니다.',
  },
  {
    userId: 5,
    challengeId: 2,
    content:
      'API 비동기 작업에 대한 내용을 번역했습니다.\n' +
      '이 문서에서는 JavaScript에서 비동기 처리를 다루기 위한 방법으로서,\n' +
      '콜백, 프로미스(Promise), 그리고 async/await의 개념을 설명하고 있습니다.\n' +
      '콜백 함수의 한계점과, 이를 해결하기 위해 등장한 프로미스의 기본 사용법을 소개합니다.\n' +
      '특히, 프로미스 체이닝을 통해 비동기 작업을 연속적으로 처리하는 방법과,\n' +
      '이 과정에서 발생할 수 있는 가독성 문제를 async/await을 사용하여 해결하는 기법을 설명합니다.\n' +
      '또한, 여러 비동기 요청을 동시에 처리하기 위해 Promise.all()을 사용하는 예제도 포함되어 있습니다.\n' +
      '이를 통해 개발자는 효율적으로 API를 호출하고,\n' +
      '비동기 로직을 명확하게 작성할 수 있는 방법을 배울 수 있습니다.',
  },
  {
    userId: 6,
    challengeId: 2,
    content:
      'API 보안과 데이터 보호에 대한 내용을 번역했습니다.\n' +
      '이 문서에서는 API 사용 시 데이터 보호를 위해 필요한 다양한 보안 기법을 설명합니다.\n' +
      'HTTPS를 사용하여 데이터 전송 시 암호화를 적용하는 방법과,\n' +
      'API 키를 안전하게 관리하기 위한 모범 사례들을 다루고 있습니다.\n' +
      '또한, Rate Limiting을 통해 API 요청을 제한하여 악의적인 사용을 방지하는 방법에 대해 설명하고 있습니다.\n' +
      'CORS(Cross-Origin Resource Sharing) 설정을 통해,\n' +
      '허용된 도메인에서만 API에 접근할 수 있도록 제어하는 방법도 포함되어 있습니다.\n' +
      '마지막으로, API 보안을 강화하기 위해 사용되는 다양한 보안 헤더(Security Headers)에 대해 설명하고,\n' +
      '이를 실제 애플리케이션에 적용하는 방법을 예제와 함께 제시하고 있습니다.',
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
    challengeId: 3,
    content:
      '커리어 성장을 위한 네트워킹 방법을 다룬 공식 문서를 번역했습니다.\n' +
      '문서에서는 전문 커뮤니티에 참여하여 네트워킹을 확장하는 중요성을 강조합니다.\n' +
      'LinkedIn과 같은 소셜 플랫폼에서 효과적인 프로필을 작성하고,\n' +
      '잠재적 고용주와 인맥을 쌓는 방법을 소개하고 있습니다.\n' +
      '또한, 네트워킹 이벤트에 참석할 때 주의해야 할 사항들과,\n' +
      '첫 대화를 시작하는 법, 그리고 팔로업을 통해 인맥을 유지하는 전략도 포함되어 있습니다.\n' +
      '이 문서는 커리어 개발에서 네트워킹의 가치를 이해하고,\n' +
      '적극적으로 자신의 경력을 확장할 수 있는 기회를 제공하는 것을 목표로 합니다.',
  },
  {
    userId: 5,
    challengeId: 3,
    content:
      '커리어 목표 설정과 달성을 위한 계획 수립 방법을 다룬 공식 문서를 번역했습니다.\n' +
      '이 문서에서는 장기적 목표와 단기적 목표를 나누어 설정하는 방법에 대해 설명합니다.\n' +
      'SMART 목표 설정 기법을 사용하여, 구체적이고 달성 가능한 계획을 세우는 과정을 다룹니다.\n' +
      '또한, 목표 달성에 필요한 스킬 갭을 분석하고,\n' +
      '이를 메우기 위한 학습 자원과 멘토링 기회를 찾는 방법도 포함되어 있습니다.\n' +
      '문서에서는 자신의 경력 경로를 시각화하고,\n' +
      '이를 통해 동기를 유지하며 목표를 달성하기 위한 전략들을 제시하고 있습니다.\n' +
      '이 자료는 특히 커리어 목표를 명확히 하고,\n' +
      '구체적인 실행 계획을 수립하고자 하는 이들에게 큰 도움이 될 것입니다.',
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
    workId: 1,
  },
  {
    userId: 3,
    workId: 1,
  },
  {
    userId: 4,
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
    workId: 1,
    content:
      'API 라우팅 설명이 상세하고 이해하기 쉽게 번역되었습니다. 다만, 예제 코드의 설명에서 몇 가지 오타가 발견되어 검토가 필요할 것 같습니다.',
  },
  {
    userId: 3,
    workId: 1,
    content:
      '스타일링 옵션에 대한 설명이 구체적이고 직관적이어서 좋았습니다. 그러나 일부 구문이 원문과 다르게 번역되어 있어 정확한 의미 전달을 위해 수정이 필요할 것 같습니다.',
  },
  {
    userId: 3,
    workId: 1,
    content:
      'Next.js의 데이터 패칭 방식에 대한 번역이 잘 정리되어 있어 이해하기 쉬웠습니다. 하지만, 동적 라우팅에 대한 설명에서 번역이 누락된 부분이 있어 추가적인 수정이 요구됩니다.',
  },
  {
    userId: 2,
    workId: 2,
    content:
      'API 사용 방법에 대한 설명이 전반적으로 잘 정리되어 있습니다. 특히 예제 코드가 이해하기 쉽게 작성되어 있습니다. 다만, API 호출의 일부 용어에 대한 부가 설명이 추가되면 좋겠습니다.',
  },
  {
    userId: 3,
    workId: 2,
    content:
      'API 인증 방법에 대한 설명이 명확하고, 예제 코드도 실용적이어서 이해하기 쉬웠습니다. 다만, 보안 모범 사례에 대한 추가적인 설명이 포함되면 더 좋을 것 같습니다.',
  },
  {
    userId: 4,
    workId: 2,
    content:
      'API 오류 처리에 대한 내용이 잘 구성되어 있어 큰 도움이 되었습니다. 특히, 상태 코드에 대한 설명이 상세하게 되어 있어 유익했습니다. 다만, 예외 상황에 대한 추가 예시가 있으면 더 좋겠습니다.',
  },
  {
    userId: 5,
    workId: 2,
    content:
      'API 비동기 작업에 대한 설명이 체계적으로 잘 정리되어 있어 이해하기 쉬웠습니다. 특히, async/await 예제가 매우 유용했습니다. 하지만, Promise 관련 더 복잡한 예제들이 추가되면 도움이 될 것 같습니다.',
  },
  {
    userId: 3,
    workId: 3,
    content:
      '커리어 개발을 위한 조언이 매우 유익합니다. 면접 준비 방법에 대한 부분이 구체적으로 잘 설명되어 있지만, 몇 가지 문장이 다소 긴 경향이 있어 가독성을 위해 나눠보면 좋겠습니다.',
  },
  {
    userId: 4,
    workId: 3,
    content:
      '커리어 목표 설정과 계획 수립 방법이 구체적으로 설명되어 있어 매우 유익했습니다. 하지만, 일부 설명이 너무 상세하여 요약된 버전이 함께 제공되면 좋을 것 같습니다.',
  },
  {
    userId: 5,
    workId: 3,
    content:
      '면접 준비 방법이 체계적으로 잘 정리되어 있어 큰 도움이 됩니다. 특히, STAR 기법을 설명하는 부분이 유익했습니다. 다만, 예시 답변이 더 다양하게 추가되면 좋겠습니다.',
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

const reply = [
  {
    userId: 1,
    feedbackId: 1,
    content: '피드백 감사합니다. 참고 하겠습니다.',
  },
  {
    userId: 3,
    feedbackId: 1,
    content: '저도 발견했어요',
  },
  {
    userId: 2,
    feedbackId: 1,
    content: '공감 합니다.',
  },
  {
    userId: 3,
    feedbackId: 2,
    content: '피드백 감사합니다. 참고 하겠습니다.',
  },
  {
    userId: 4,
    feedbackId: 2,
    content: '저도 발견했어요',
  },
  {
    userId: 5,
    feedbackId: 2,
    content: '공감 합니다.',
  },
  {
    userId: 6,
    feedbackId: 3,
    content: '피드백 감사합니다. 참고 하겠습니다.',
  },
  {
    userId: 7,
    feedbackId: 3,
    content: '피드백 감사합니다.',
  },
];

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.reply.deleteMany();
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

    const uniqueLikes = new Set();
    while (uniqueLikes.size < 10) {
      const userId =
        createdUsers[Math.floor(Math.random() * createdUsers.length)].id;
      const workId =
        createdWorks[Math.floor(Math.random() * createdWorks.length)].id;
      uniqueLikes.add(JSON.stringify({ userId, workId }));
    }

    const likesWithIds = Array.from(uniqueLikes).map((like) =>
      JSON.parse(like)
    );

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

    await tx.reply.createMany({
      data: reply,
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
