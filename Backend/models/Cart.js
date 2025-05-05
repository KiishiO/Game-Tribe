// models/Cart.js - Cart schema
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Get cart total
CartSchema.methods.getCartTotal = function() {
  let subtotal = 0;
  
  if (this.items.length > 0) {
    subtotal = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;
  
  return {
    subtotal,
    tax,
    total,
    itemCount: this.items.reduce((count, item) => count + item.quantity, 0)
  };
};

module.exports = mongoose.model('Cart', CartSchema);