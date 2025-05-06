const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const auth = require('../middleware/auth');

// @route   GET api/games
// @desc    Get all games
// @access  Public
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/games/:id
// @desc    Get game by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/games
// @desc    Add a new game
// @access  Private (admin only in a real app)
router.post('/', auth, async (req, res) => {
  try {
    const { name, image, genres, price, description, isNewRelease, isPopular } = req.body;
    
    // Create new game
    const newGame = new Game({
      name,
      image,
      genres,
      price,
      description,
      isNewRelease,
      isPopular
    });
    
    const game = await newGame.save();
    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/games/new-releases
// @desc    Get new release games
// @access  Public
router.get('/new-releases', async (req, res) => {
  try {
    const games = await Game.find({ isNewRelease: true });
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/games/popular
// @desc    Get popular games
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const games = await Game.find({ isPopular: true });
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/games/genre/:genre
// @desc    Get games by genre
// @access  Public
router.get('/genre/:genre', async (req, res) => {
  try {
    const games = await Game.find({ genres: req.params.genre });
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;