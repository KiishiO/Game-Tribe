const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// @route   GET api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('user', 'displayName email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'displayName email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Make sure user owns this order or is admin
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      orderNumber,
      items,
      subtotal,
      tax,
      total,
      shippingInfo,
      paymentMethod
    } = req.body;
    
    const newOrder = new Order({
      user: req.user.id,  // Make sure user is set from auth middleware
      orderNumber,
      items,
      subtotal,
      tax,
      total,
      shippingInfo,
      paymentMethod,
      status: 'pending'
    });
    
    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;