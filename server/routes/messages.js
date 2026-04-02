import { Router } from 'express';
import pool from '../db/pool.js';
import { sendPortfolioMessage } from '../services/mailer.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { userId = null, name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    await pool.query(
      'INSERT INTO messages (user_id, name, email, subject, message) VALUES ($1, $2, $3, $4, $5)',
      [userId, name.trim(), email.toLowerCase(), subject.trim(), message.trim()]
    );

    await sendPortfolioMessage({ name, email, subject, message });

    return res.status(201).json({ message: 'Message saved and delivered successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message.', error: error.message });
  }
});

export default router;
