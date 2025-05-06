const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
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
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);