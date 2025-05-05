// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all games
router.get('/', async (req, res) => {
  try {
    const filter = {};
    
    // Handle featured filter
    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }
    
    const games = await Game.find(filter);
    res.json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Other routes for getting a single game, creating, updating, etc.

module.exports = router;