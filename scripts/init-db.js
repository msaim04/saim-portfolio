import dotenv from 'dotenv';
import pool from '../server/db/pool.js';
import { schemaSql } from '../server/db/schema.js';

dotenv.config({ path: './server/.env' });

(async () => {
  try {
    await pool.query(schemaSql);
    console.log('Database initialized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  }
})();
