const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if game is already in favorites
    if (user.favoriteGames.includes(req.params.id)) {
      return res.status(400).json({ message: 'Game already in favorites' });
    }
    
    // Add game to favorites
    user.favoriteGames.push(req.params.id);
    await user.save();
    
    res.json(user.favoriteGames);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/favorite/:id
// @desc    Remove a game from favorites
// @access  Private
router.delete('/favorite/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if game is in favorites
    const index = user.favoriteGames.indexOf(req.params.id);
    if (index === -1) {
      return res.status(400).json({ message: 'Game not in favorites' });
    }
    
    // Remove game from favorites
    user.favoriteGames.splice(index, 1);
    await user.save();
    
    res.json(user.favoriteGames);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;