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

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const SERVER_URL =
  process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`;

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
  'https://vercel.live',
  SERVER_URL,
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

app.use(
  helmet({
    contentSecurityPolicy: false,
    permissionsPolicy: false,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'private-state-token-redemption=(), private-state-token-issuance=(), browsing-topics=()'
  );
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "connect-src 'self' " +
      CLIENT_URL +
      ' https://vercel.live ' +
      SERVER_URL +
      '; ' +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https: data:; " +
      "object-src 'none'; " +
      "frame-src 'self' https://vercel.live;"
  );
  next();
});

app.use(
  '/api-docs',
  express.static(path.join(__dirname, 'public', 'api-docs'))
);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      url: `${SERVER_URL}/api-docs/swagger.json`,
    },
    customCssUrl: '/api-docs/swagger-ui.css',
    customJs: [
      '/api-docs/swagger-ui-bundle.js',
      '/api-docs/swagger-ui-standalone-preset.js',
    ],
  })
);

app.use(
  '/favicon.ico',
  express.static(path.join(__dirname, 'public', 'favicon.ico'))
);

app.use('/api/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => {
  res.status(404).send('존재하지 않는 라우트입니다');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on ${SERVER_URL}`));

export default app;
