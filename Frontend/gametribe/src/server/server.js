const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/game-tribe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import models
const Game = require('./models/Game');

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Seed database if empty
const seedDatabase = async () => {
  const count = await Game.countDocuments();
  if (count === 0) {
    try {
      // Read the data.json file
      const rawData = fs.readFileSync(path.resolve(__dirname, '../public/assets/data.json'));
      const gamesData = JSON.parse(rawData);
      
      // Insert games into database
      await Game.insertMany(gamesData.games || gamesData);
      console.log('Database seeded successfully');
    } catch (err) {
      console.error('Error seeding database:', err);
    }
  }
};

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedDatabase();
});