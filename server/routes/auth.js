import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/pool.js';
import { createToken, sanitizeUser } from '../utils.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase(), passwordHash]
    );

    const user = result.rows[0];
    return res.status(201).json({
      message: 'Registration successful.',
      token: createToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    return res.json({
      message: 'Login successful.',
      token: createToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

export default router;
