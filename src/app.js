import express from 'express';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { swaggerDocs } from './configs/swagger.js';
import swaggerUi from 'swagger-ui-express';
import customJsonParser from './middlewares/jsonParser.js';
import { REFRESH_TOKEN_MAX_AGE } from './configs/config.js';

import profileRoutes from './routes/profileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import workRoutes from './routes/workRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import replyRoutes from './routes/replyRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const allowedOrigins = [
  CLIENT_URL,
  BASE_URL,
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'https://vercel.live',
  'https://easydocthru.vercel.app',
  'https://docthru-fe-seven.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Swagger UI나 같은 도메인 요청 (!origin) 또는 허용된 도메인이면 허용
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin); // 디버깅용
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(customJsonParser);

export const sendRefreshToken = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: parseInt(REFRESH_TOKEN_MAX_AGE, 10),
    path: '/',
  };

  if (isProduction) {
    cookieOptions.domain = '.vercel.app';
  }

  res.cookie('refreshToken', token, cookieOptions);
};

const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: [
      "'self'",
      CLIENT_URL,
      'https://vercel.live',
      'https://easydocthru.vercel.app',
      'https://docthru-fe-seven.vercel.app',
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://vercel.live',
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    fontSrc: ["'self'", 'https:', 'data:'],
    objectSrc: ["'none'"],
    frameSrc: ["'self'", 'https://vercel.live'],
  },
};

if (isProduction) {
  contentSecurityPolicy.directives.upgradeInsecureRequests = [];
}

app.use(
  helmet({
    contentSecurityPolicy: contentSecurityPolicy,
  })
);

// Swagger 설정
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/swagger.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // swagger.json은 모든 곳에서 접근 가능하게
  res.json(swaggerDocs);
});

// Swagger UI를 `/api-docs` 경로로 제공
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      url: '/api/swagger.json',
      persistAuthorization: true,
      withCredentials: true,
    },
  })
);

// API 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profiles', profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);

export default app;
