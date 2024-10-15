import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import workRoutes from './routes/workRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import cors from 'cors';
import challengeRoutes from './routes/challengeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use('/api', notificationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/applications', applicationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
