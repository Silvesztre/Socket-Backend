const dotenv = require('dotenv')
const { Pool } = require('pg');

dotenv.config(); // Load .env variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for some cloud PostgreSQL services
});

module.exports = pool