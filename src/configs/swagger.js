import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API 문서',
      version: '1.0.0',
      description: 'API 설명',
    },
    servers: [
      {
        url: 'http://localhost:3000', // 또는 배포 URL
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
