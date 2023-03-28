require('dotenv').config()
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/fitness-dev`;

const client = new Client({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

client.password = process.env.RENDER_PASSWORD;

module.exports = client;