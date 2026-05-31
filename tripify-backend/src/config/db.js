const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tripify_db',
  password: 'tripify123',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = pool;