const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { initDb, getUsers, saveUsers, getOrders, saveOrders } = require('./db');

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

    // Get all users
    const users = getUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };

    // Add user to database
    users.push(newUser);
    saveUsers(users);

    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
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

    // Get all users
    const users = getUsers();

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

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
server.get('/api/user/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Get all users
    const users = getUsers();

    // Find user
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user info (without password)
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.put('/api/user/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Get all users
    const users = getUsers();

    // Find user index
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name,
      email
    };

    // Save users
    saveUsers(users);

    // Return updated user (without password)
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json({
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order management endpoints
server.post('/api/orders', (req, res) => {
  try {
    const { userId, totalAmount, shippingAddress, items } = req.body;

    // Get all orders
    const orders = getOrders();

    // Create the order
    const newOrder = {
      id: Date.now().toString(),
      userId,
      totalAmount,
      shippingAddress,
      items,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Add order to database
    orders.push(newOrder);
    saveOrders(orders);

    res.status(201).json({
      orderId: newOrder.id,
      message: 'Order placed successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.get('/api/orders/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    // Get all orders
    const orders = getOrders();

    // Filter orders by user ID
    const userOrders = orders.filter(order => order.userId === userId);

    res.json(userOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

server.get('/api/orders/:orderId/items', (req, res) => {
  try {
    const { orderId } = req.params;

    // Get all orders
    const orders = getOrders();

    // Find order
    const order = orders.find(order => order.id === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order.items);
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