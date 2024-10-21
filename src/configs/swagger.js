import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Docthru-Be',
      version: '1.0.0',
      description: '독스루 백엔드 API 명세입니다',
    },
    servers: [
      {
        url: `http://localhost:3000`,
        description: '로컬 서버',
      },
      {
        url: process.env.BASE_URL || 'https://docthru-be.vercel.app',
        description: '배포 환경 HTTPS 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
