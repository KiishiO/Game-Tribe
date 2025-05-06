const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.game', 'name image price');
    
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.game', 'name image price');
    
    // Check if order exists
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { items, subtotal, tax, total, shippingInfo, paymentMethod } = req.body;
    
    // Generate unique order number
    const orderNumber = `GT-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      orderNumber,
      items,
      subtotal,
      tax,
      total,
      shippingInfo,
      paymentMethod
    });
    
    const order = await newOrder.save();
    
    // Update user's games owned count
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { gamesOwned: itemCount }
    });
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;