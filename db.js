
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost', 
  database: process.env.PGDATABASE || 'rigmasters',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
  // Adding connection timeout
  connectionTimeoutMillis: 5000,
  // Increase query timeout
  statement_timeout: 10000
});

// Test database connection
async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    client.release();
    console.log('Database connection successful!');
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
}

// Initialize database by creating tables if they don't exist
async function initDb() {
  try {
    // First check if the database is available
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('Database not available, running in memory-only mode');
      return false;
    }
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        shipping_address TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create order items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES user_orders(id),
        product_id INTEGER NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);
    
    console.log('Database tables initialized successfully');
    return true;
  } catch (err) {
    console.error('Error initializing database:', err);
    return false;
  }
}

module.exports = {
  pool,
  initDb,
  testConnection
};
