// Backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Game = require('../models/Game');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @route   GET api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { displayName, profileImage, personalNote } = req.body;
    
    // Build update object
    const updateFields = {};
    if (displayName) updateFields.displayName = displayName;
    if (profileImage) updateFields.profileImage = profileImage;
    if (personalNote !== undefined) updateFields.personalNote = personalNote;
    
    // Update user in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
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

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user from database
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save updated user
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/favorite/:id
// @desc    Add a game to favorites
// @access  Private
router.post('/favorite/:id', auth, async (req, res) => {
  try {
    const gameId = req.params.id;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if game exists
    let game;
    
    // First try to find by numeric ID if it's a number
    if (!isNaN(gameId)) {
      game = await Game.findOne({ id: parseInt(gameId) });
    } else {
      // If it's not a number, check if it's a valid ObjectId format
      if (gameId.match(/^[0-9a-fA-F]{24}$/)) {
        game = await Game.findById(gameId);
      }
    }
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if game is already in favorites
    if (user.favoriteGames.includes(game._id)) {
      return res.status(400).json({ message: 'Game already in favorites' });
    }
    
    // Add game to favorites (use MongoDB _id)
    user.favoriteGames.push(game._id);
    await user.save();
    
    res.json(user.favoriteGames);
  } catch (err) {
    console.error('Add favorite error:', err.message);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message,
      gameId: req.params.id 
    });
  }
});

// @route   DELETE api/users/favorite/:id
// @desc    Remove a game from favorites
// @access  Private
router.delete('/favorite/:id', auth, async (req, res) => {
  try {
    const gameId = req.params.id;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the game to get its MongoDB _id
    let game;
    
    // First try to find by numeric ID if it's a number
    if (!isNaN(gameId)) {
      game = await Game.findOne({ id: parseInt(gameId) });
    } else {
      // If it's not a number, check if it's a valid ObjectId format
      if (gameId.match(/^[0-9a-fA-F]{24}$/)) {
        game = await Game.findById(gameId);
      }
    }
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if game is in favorites
    const index = user.favoriteGames.indexOf(game._id);
    if (index === -1) {
      return res.status(400).json({ message: 'Game not in favorites' });
    }
    
    // Remove game from favorites
    user.favoriteGames.splice(index, 1);
    await user.save();
    
    res.json(user.favoriteGames);
  } catch (err) {
    console.error('Remove favorite error:', err.message);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message,
      gameId: req.params.id 
    });
  }
});

// @route   GET api/users/favorites
// @desc    Get user's favorite games
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favoriteGames')
      .select('favoriteGames');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.favoriteGames || []);
  } catch (err) {
    console.error('Get favorites error:', err.message);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
});

// @route   GET api/users/favorite/:id
// @desc    Check if a game is in favorites
// @access  Private
router.get('/favorite/:id', auth, async (req, res) => {
  try {
    const gameId = req.params.id;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the game to get its MongoDB _id
    let game;
    // First try to find by numeric ID
    if (!isNaN(gameId)) {
      game = await Game.findOne({ id: parseInt(gameId) });
    }
    
    // If not found, try MongoDB _id
    if (!game) {
      game = await Game.findById(gameId);
    }
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if game is in favorites
    const isFavorite = user.favoriteGames.includes(game._id);
    
    res.json({ isFavorite });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;