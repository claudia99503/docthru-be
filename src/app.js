import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import challengeRoutes from './routes/challengeRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/challenges', challengeRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
