const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration - MOVE THIS BEFORE OTHER MIDDLEWARE
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware - CORRECT ORDER
app.use(cors(corsOptions)); // Use CORS with options
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
const adminRoutes = require('./routes/admin'); // Move this up with other imports

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Default Route
app.get('/', (req, res) => {
  res.send('Game Tribe API is running');
});

// Use Routes - ORDER MATTERS
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes); // Admin routes should be after auth

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