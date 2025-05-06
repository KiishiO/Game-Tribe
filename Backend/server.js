const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameTribeDB';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Models
const User = require('./models/User');
const Game = require('./models/Game');
const Order = require('./models/Order');

// Import Routes
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Default Route
app.get('/', (req, res) => {
  res.send('Game Tribe API is running');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? null : err.message 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});