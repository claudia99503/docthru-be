import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        url: 'https://docthru-be.vercel.app',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // 주의: 파일 경로가 정확한지 확인
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs };
