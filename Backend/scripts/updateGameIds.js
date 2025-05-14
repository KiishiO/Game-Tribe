// Backend/scripts/updateGameIds.js
const mongoose = require('mongoose');
const Game = require('../models/Game');
require('dotenv').config();

// Array of game names with their corresponding numeric IDs
const gameIds = [
  { name: "Haunted", id: 1 },
  { name: "Imposters", id: 2 },
  { name: "Soos & The Real Girl", id: 3 },
  { name: "Super Mario Land Adventures", id: 4 },
  { name: "Battle Ninja", id: 5 },
  { name: "Day in The Life", id: 6 },
  { name: "PowerPuff Girls: Heroic Havoc", id: 7 },
  { name: "Adventures with Kirby", id: 8 },
  { name: "Sweet Bunny Bakery Express", id: 9 },
  { name: "Bubble World", id: 10 },
  { name: "CyberPunk: Redacted", id: 11 },
  { name: "Omniscient Reader: Rewritten Fate", id: 12 },
  { name: "Tiana's Place", id: 13 },
  { name: "Spy X Family: Invaders", id: 14 },
  { name: "Penguin Run: A Studio Ghibli Game", id: 15 },
  { name: "Take-Off", id: 16 }
];

const updateGameIds = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameTribeDB';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Update each game with its numeric ID
    for (const gameData of gameIds) {
      const result = await Game.findOneAndUpdate(
        { name: gameData.name },
        { id: gameData.id },
        { new: true }
      );
      
      if (result) {
        console.log(`Updated ${gameData.name} with ID ${gameData.id}`);
      } else {
        console.log(`Game ${gameData.name} not found in database`);
      }
    }

    console.log('Game IDs update completed');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');

  } catch (err) {
    console.error('Error updating game IDs:', err);
  }
};

// Run the update
updateGameIds();