const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: '/assets/myotherimages/player_01.jpg'
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  personalNote: {
    type: String,
    default: 'Click to enter text'
  },
  gamesOwned: {
    type: Number,
    default: 0
  },
  favoriteGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add virtual for orders
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user'
});

// Make sure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);