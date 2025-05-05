// models/Game.js - Game schema
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a game name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be positive']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image']
  },
  genres: {
    type: [String],
    required: [true, 'Please provide at least one genre'],
    enum: [
      'Horror',
      'Action',
      'Adventure',
      'Role-Playing',
      'Puzzle',
      'Simulation',
      'Strategy',
      'Multi-Player'
    ]
  },
  featured: {
    type: Boolean,
    default: false
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create an index for search functionality
GameSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Game', GameSchema);