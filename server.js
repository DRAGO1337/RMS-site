const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./dbConfig');

const server = express();

// Middleware
server.use(cors());
server.use(bodyParser.json());
server.use(express.static('./'));

// Initialize database
async function initDb() {
  try {
    // Test database connection first
    const connected = await db.testConnection();
    if (!connected) {
      console.error('Database connection failed. Tables will not be created.');
      return;
    }
    
    console.log('Database connection successful, creating tables...');
    
    // Create users table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create orders table if it doesn't exist - ensure data types match
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        total_amount NUMERIC(10,2) NOT NULL,
        shipping_address JSONB,
        items JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDb();

// Authentication endpoints
server.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userId = Date.now().toString();
    const result = await db.query(
      'INSERT INTO users (id, name, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, created_at',
      [userId, name, email, hashedPassword, new Date().toISOString()]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      user: newUser,
      message: 'Registration successful'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      message: 'Login successful'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User account endpoints
server.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.put('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if user exists
    const checkResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    const result = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );

    res.json({
      user: result.rows[0],
      message: 'Profile updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order management endpoints
server.post('/api/orders', async (req, res) => {
  try {
    const { userId, totalAmount, shippingAddress, items } = req.body;

    // Create the order
    const orderId = Date.now().toString();
    await db.query(
      'INSERT INTO orders (id, user_id, total_amount, shipping_address, items, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [orderId, userId, totalAmount, JSON.stringify(shippingAddress), JSON.stringify(items), 'pending', new Date().toISOString()]
    );

    res.status(201).json({
      orderId: orderId,
      message: 'Order placed successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user orders
    const result = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.get('/api/orders/:orderId/items', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find order
    const result = await db.query('SELECT items FROM orders WHERE id = $1', [orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(result.rows[0].items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Main route
server.all('/', (req, res) => {
    res.sendFile('index.html', { root: './' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. The server may already be running.`);
        } else {
            console.error('Failed to start server:', err);
        }
        return;
    }
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

module.exports = () => {
    return server;
};