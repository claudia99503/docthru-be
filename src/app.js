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
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import workRoutes from './routes/workRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
  'https://vercel.live',
  'https://docthru-be.vercel.app', // Vercel 앱 URL 추가
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
      'https://docthru-be.vercel.app',
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://vercel.live',
      'https://docthru-be.vercel.app',
    ],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://docthru-be.vercel.app'],
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

// Swagger UI 정적 파일 서빙
app.use(
  '/api-docs',
  express.static(path.join(__dirname, 'public/api-docs'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    },
  })
);

// Swagger JSON 파일 서빙
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// Swagger 설정
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      url: '/api-docs/swagger.json',
    },
    customCssUrl: '/api-docs/swagger-ui.css',
    customJs: '/api-docs/swagger-ui-bundle.js',
  })
);

// API 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);

export default app;
