const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Get all games
router.get('/games', async (req, res) => {
  try {
    const games = await Game.find().sort({ id: 1 });
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get game by ID
router.get('/games/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.id });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (err) {
    console.error('Error fetching game:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Filter games by genre
router.get('/games/genre/:genre', async (req, res) => {
  try {
    const games = await Game.find({ genres: req.params.genre }).sort({ id: 1 });
    res.json(games);
  } catch (err) {
    console.error('Error fetching games by genre:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search games by name
router.get('/games/search/:query', async (req, res) => {
  try {
    const searchRegex = new RegExp(req.params.query, 'i');
    const games = await Game.find({ name: searchRegex }).sort({ id: 1 });
    res.json(games);
  } catch (err) {
    console.error('Error searching games:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new game
router.post('/games', async (req, res) => {
  try {
    // Check if game with same ID already exists
    const existingGame = await Game.findOne({ id: req.body.id });
    if (existingGame) {
      return res.status(400).json({ message: 'Game with this ID already exists' });
    }
    
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (err) {
    console.error('Error adding game:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a game
router.put('/games/:id', async (req, res) => {
  try {
    const updatedGame = await Game.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    
    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(updatedGame);
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a game
router.delete('/games/:id', async (req, res) => {
  try {
    const deletedGame = await Game.findOneAndDelete({ id: req.params.id });
    
    if (!deletedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;