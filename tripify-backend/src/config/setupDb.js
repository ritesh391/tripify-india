const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tripify_db',
  password: 'tripify123',
  port: 5432,
});

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

pool.query(sql)
  .then(() => {
    console.log('All tables created successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
    process.exit(1);
  });