import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import analyticsRoutes from './routes/analytics';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', analyticsRoutes);


app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'TypeScript server is alive and well!' });
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});