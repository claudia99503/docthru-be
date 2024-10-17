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
        url: process.env.BASE_URL || 'http://localhost:3001', // 환경변수로 관리
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
  apis: ['./routes/*.js'], // Swagger 주석이 포함된 파일의 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs };
