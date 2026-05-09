import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

export const initDb = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY,
      owner_name TEXT NOT NULL,
      pan TEXT NOT NULL,
      business_type TEXT NOT NULL,
      monthly_revenue NUMERIC NOT NULL,
      requested_amount NUMERIC NOT NULL,
      tenure_months INTEGER NOT NULL,
      purpose TEXT NOT NULL,
      decision TEXT NOT NULL,
      credit_score INTEGER NOT NULL,
      reason_codes TEXT[] NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('DB initialized');
};
