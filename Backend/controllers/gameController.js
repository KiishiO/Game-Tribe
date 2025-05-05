// controllers/gameController.js - Game controller
const Game = require('../models/Game');

// @desc    Get all games
// @route   GET /api/games
// @access  Public
exports.getGames = async (req, res) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'genre'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Search functionality
    if (req.query.search) {
      reqQuery.$text = { $search: req.query.search };
    }

    // Genre filter
    if (req.query.genre && req.query.genre !== 'all') {
      reqQuery.genres = req.query.genre;
    }

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `${match}`);
    
    // Finding resource
    query = Game.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Default sort by release date (newest first)
      query = query.sort('-releaseDate');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 16;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Game.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const games = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: games.length,
      pagination,
      total,
      data: games
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
exports.getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: `Game not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new game
// @route   POST /api/games
// @access  Private (Admin)
exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);

    res.status(201).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error(error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A game with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private (Admin)
exports.updateGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: `Game not found with id of ${req.params.id}`
      });
    }

    game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error(error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A game with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private (Admin)
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: `Game not found with id of ${req.params.id}`
      });
    }

    await game.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};