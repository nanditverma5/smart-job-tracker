const { pgPool } = require('./db');

const initDB = async () => {
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Applied',
        applied_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('PostgreSQL tables created');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

module.exports = initDB;