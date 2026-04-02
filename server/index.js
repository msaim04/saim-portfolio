import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import pool from './db/pool.js';
import { requireAuth } from './middleware/auth.js';
import { schemaSql } from './db/schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../client/dist');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'saim-portfolio-api' });
});

app.get('/api/profile', async (_req, res) => {
  res.json({
    name: 'Muhammad Saim Ali',
    role: 'DevOps Engineer | Cloud Architect | Penetration Tester',
    email: 'saim@waxonit.co.uk',
    location: 'Lahore, Pakistan',
    intro:
      'I build secure infrastructure, automate delivery pipelines, and harden modern cloud workloads with a DevOps and cybersecurity-first mindset.'
  });
});

app.get('/api/me', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
  if (!result.rows.length) return res.status(404).json({ message: 'User not found.' });
  res.json({ user: result.rows[0] });
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const start = async () => {
  try {
    await pool.query(schemaSql);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
