const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  shippingInfo: {
    fullName: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zip: String
  },
  paymentMethod: {
    type: String,
    enum: ['creditCard', 'paypal'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);