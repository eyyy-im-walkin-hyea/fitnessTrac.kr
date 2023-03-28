require('dotenv').config()
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/fitness-dev`;

const client = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

client.password = "vF1Ar1VNiE1eGMuE2pVe8z8yjkGTecfm";

module.exports = client;