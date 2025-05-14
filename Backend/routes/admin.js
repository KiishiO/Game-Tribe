const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Order = require('../models/Order');
const Game = require('../models/Game');

// Get all users (admin only)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('orders');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user (admin only)
router.put('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { isAdmin, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin, isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all orders (admin only)
router.get('/orders', [auth, adminAuth], async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'displayName email',
        model: 'User'
      })
      .sort({ createdAt: -1 });
    
    console.log('Orders found:', orders.length);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Server Error');
  }
});

// Update order status (admin only)
router.put('/orders/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete user (admin only)
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get dashboard stats (admin only)
router.get('/dashboard', [auth, adminAuth], async (req, res) => {
  try {
    console.log('Dashboard route hit');
    console.log('User:', req.user);
    
    // Count documents
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalGames = await Game.countDocuments();
    
    console.log('Counts:', { totalUsers, totalOrders, totalGames });
    
    // Get recent orders with populated user info
    const recentOrders = await Order.find()
      .populate({
        path: 'user',
        select: 'displayName email',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Calculate total revenue
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    
    const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;
    
    const responseData = {
      totalUsers,
      totalOrders,
      totalGames,
      totalRevenue,
      recentOrders
    };
    
    console.log('Sending response:', responseData);
    
    res.json(responseData);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working!' });
});

module.exports = router;