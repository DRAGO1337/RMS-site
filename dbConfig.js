
const { Pool } = require('pg');

// Check if DATABASE_URL environment variable exists
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set');
  console.error('Please set this variable in the Secrets tab with your Neon database connection string');
}

// Use environment variables from Vercel/Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Set connection timeout (in milliseconds)
  connectionTimeoutMillis: 5000,
  // Set idle timeout (in milliseconds)
  idleTimeoutMillis: 30000
});

// Test database connection on startup
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');
    client.release();
    return true;
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    return false;
  }
};

// Initial connection test
testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
};
