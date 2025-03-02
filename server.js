
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { pool, initDb } = require('./db');

const server = express();

// Middleware
server.use(cors());
server.use(bodyParser.json());
server.use(express.static('./'));

// Initialize database
initDb();

// Authentication endpoints
server.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, address',
      [name, email, hashedPassword, phone || null, address || null]
    );
    
    // Return user info (without password)
    res.status(201).json({
      user: newUser.rows[0],
      message: 'Registration successful'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Return user info (without password)
    const { id, name, email: userEmail, phone, address } = user.rows[0];
    res.json({
      user: { id, name, email: userEmail, phone, address },
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
    
    const user = await pool.query(
      'SELECT id, name, email, phone, address, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.put('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    
    const updatedUser = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING id, name, email, phone, address',
      [name, email, phone || null, address || null, id]
    );
    
    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: updatedUser.rows[0],
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
    
    // Start a transaction
    await pool.query('BEGIN');
    
    // Create the order
    const newOrder = await pool.query(
      'INSERT INTO user_orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING id',
      [userId, totalAmount, shippingAddress]
    );
    
    const orderId = newOrder.rows[0].id;
    
    // Insert order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.id, item.name, item.quantity, item.price]
      );
    }
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    res.status(201).json({
      orderId,
      message: 'Order placed successfully'
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await pool.query(
      'SELECT * FROM user_orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(orders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.get('/api/orders/:orderId/items', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const items = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );
    
    res.json(items.rows);
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

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

module.exports = () => {
    return server;
};
