import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { initDb } from './lib/db';
import applicationRoutes from './routes/applications';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, slow down.' },
});
app.use('/api/applications', limiter);

app.use('/api/applications', applicationRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to init DB:', err);
    process.exit(1);
  });
