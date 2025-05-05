// utils/seedData.js - Initial seed data for games
const Game = require('../models/Game');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Game data array
const games = [
  {
    name: 'Haunted',
    description: 'Step into a chilling nightmare as a little girl, trapped in a mysterious haunted mansion. Alone—or with friends—explore the dark corners of this eerie estate, solving puzzles and uncovering clues to escape before time runs out. Along the way, encounter two types of ghosts: kind-hearted ones who offer cryptic help, and vengeful spirits who\'ll stop at nothing to keep you trapped in the nightmare. Will you make it out alive, or will the mansion claim your soul forever? The choice is yours—if you can survive the terror long enough to escape.',
    price: 29.99,
    image: 'Haunted.jpg',
    genres: ['Horror', 'Strategy'],
    featured: true
  },
  {
    name: 'Imposters',
    description: 'Board a spacefaring vessel with your crew—only not everyone is who they seem. Some are aliens, hiding among you, plotting to eliminate the crew one by one. As you work to complete your mission, trust no one and stay alert, because the aliens are working in the shadows. If the crew can identify and eject the invaders before it\'s too late, they\'ll survive. But if the aliens succeed in their sabotage—or if time runs out—the crew\'s home planet faces destruction. Can you root out the invaders in time, or will you become part of their alien plot?',
    price: 19.99,
    image: 'Imposters.gif',
    genres: ['Multi-Player', 'Strategy']
  },
  {
    name: 'Soos & The Real Girl',
    description: 'In this quirky, heartwarming adventure, you play as Soos, the lovable handyman from Gravity Falls, on a mission to help his robotic creation find a place in the world. After building a lifelike robot girlfriend, Soos discovers that building a perfect companion isn\'t as easy as it seems. Navigate through wacky puzzles, hilarious mishaps, and oddball characters as you guide Soos and his robot friend on a journey to figure out what it means to be "real." With heartwarming moments and zany adventures, can you help Soos fix his creation before everything spirals into chaos? It\'s a game of friendship, self-discovery, and unexpected romance—Gravity Falls style!',
    price: 24.99,
    image: 'Soos & The Real Girl.gif',
    genres: ['Adventure', 'Role-Playing']
  },
  {
    name: 'Super Mario Land Adventures',
    description: 'Join Mario, Luigi, and the rest of the Mushroom Kingdom gang on an epic journey through vibrant, new lands full of challenges, power-ups, and hidden secrets! From tropical beaches to towering mountains and mystical forests, each new area presents unique obstacles and foes to defeat. Team up with friends in multiplayer mode to take down Bowser\'s latest schemes or go solo to rescue Princess Peach from his clutches. With classic platforming action and exciting new power-ups, "Super Mario Land Adventures" delivers a nostalgic yet fresh experience for players of all ages. Ready to jump into the adventure? Let\'s-a go!',
    price: 39.99,
    image: 'Super Mario Land Adv_.gif',
    genres: ['Adventure', 'Puzzle'],
    featured: true
  },
  {
    name: 'Battle Ninja',
    description: 'Step into the shadows and face off in thrilling one-on-one ninja duels! In Battle Ninja, you can choose your unique warrior, each with their own special abilities, weapons, and fighting styles. Master lightning-fast combat moves, devastating combos, and unlockable skills as you take on opponents in epic battles. Whether you\'re a stealthy assassin, a fierce warrior, or a master of elemental powers, each fighter brings something new to the table. Show off your skills, outwit your opponent, and claim victory in the ultimate ninja showdown! Who will reign supreme in the Battle Ninja arena?',
    price: 24.99,
    image: 'BattleBros.jpg',
    genres: ['Action', 'Strategy']
  },
  {
    name: 'Day in The Life',
    description: 'Step into the shoes of a character living out a day in their life, but with a fun, pixelated twist! In this lighthearted simulation game, every task, no matter how small, becomes an adventure. Brush your teeth, make breakfast, go to work, hang out with friends—each moment is gamified with quirky challenges and rewards. Customize your character, manage your daily routine, and unlock surprises as you explore a vibrant, pixelated world. Whether you\'re tackling mundane chores or facing unexpected events, Day in the Life brings new excitement to everyday activities. Can you make the most of each day, or will the routine grind get the best of you?',
    price: 24.99,
    image: 'Day in the Life.jpg',
    genres: ['Role-Playing', 'Puzzle']
  },
  {
    name: 'PowerPuff Girls: Heroic Havoc',
    description: 'Join Blossom, Bubbles, and Buttercup in an action-packed adventure to save Townsville from evil forces! In Heroic Havoc, you\'ll switch between the three Powerpuff Girls, each with their own unique abilities, to battle villains like Mojo Jojo, Fuzzy Lumpkins, and more. Team up with friends in co-op mode or take on the city\'s threats solo as you soar through the skies, blast enemies, and solve fun puzzles. Save the day with your superpowers, earn new upgrades, and unlock cool costumes as you work together to stop the chaos in Townsville. The city needs its heroes—are you ready to save the day?',
    price: 29.99,
    image: 'PowerPuff Girls.jpg',
    genres: ['Action', 'Strategy']
  },
  {
    name: 'Adventures with Kirby',
    description: 'Join Kirby on a whimsical, fun-filled journey through Dream Land and beyond in this action-packed adventure! Explore lush landscapes, battle quirky enemies, and inhale your way through unique challenges. As Kirby, you can absorb the powers of your foes and use their abilities to overcome obstacles and defeat bosses. Whether you\'re floating through the skies, diving into the depths of the ocean, or exploring mysterious new realms, there\'s always an exciting adventure around the corner. With colorful graphics, charming levels, and a host of wacky characters, Adventures with Kirby offers endless fun for players of all ages. Ready to puff up and go on an adventure?',
    price: 34.99,
    image: 'Adventures with Kirby.gif',
    genres: ['Action', 'Adventure', 'Role-Playing', 'Puzzle'],
    featured: true
  },
  {
    name: 'Sweet Bunny Bakery Express',
    description: 'Hop into the sweet life of a cake delivery mogul in Sweet Bunny Bakery Express! Manage your own adorable bakery and create mouthwatering cakes for delivery across town. As the head of your bunny-run operation, design unique cakes, upgrade your delivery vehicles, and expand your bakery empire. Make sure your customers get their delicious treats on time, and earn tips to unlock new ingredients and delivery options. But be prepared for competition and tricky delivery routes! Can you rise to the challenge and become the most beloved bakery in town? Whisk, bake, and deliver your way to the top in this adorable, fast-paced bakery tycoon adventure!',
    price: 19.99,
    image: 'RabbitRestuarantTycoon.gif',
    genres: ['Simulation', 'Strategy']
  },
  {
    name: 'Bubble World',
    description: 'Step into a vibrant, storybook-like realm where adventure, mystery, and charm collide! Build your dream village, befriend quirky creatures, and solve clever puzzles hidden throughout the land. From enchanted feasts to knightly quests, every corner of Bubble World is bursting with surprises. Will you uncover the kingdom\'s secrets, master magical challenges, or simply enjoy the cozy life? The choice is yours—dive in and let the adventure begin!',
    price: 29.99,
    image: 'Bubble World.jpg',
    genres: ['Adventure', 'Puzzle']
  },
  {
    name: 'CyberPunk: Redacted',
    description: 'The neon-lit underworld of the future is yours to explore in this high-stakes reimagining of a cybernetic dystopia. Hack into corporate strongholds, outrun bounty hunters, and uncover secrets buried in digital shadows. With mind-bending puzzles, high-speed chases, and an open world teeming with intrigue, will you fight for the system, rebel against it, or rewrite the rules entirely? The city never sleeps—jack in and take control.',
    price: 49.99,
    image: 'CyberPunk (The Remake).gif',
    genres: ['Action', 'Role-Playing'],
    featured: true
  },
  {
    name: 'Omniscient Reader: Rewritten Fate',
    description: 'The world has turned into a novel, and only you know how the story ends—unless you decide to change it. Choose your role, forge alliances, and battle through deadly scenarios in a high-stakes blend of strategy, combat, and narrative choice. Will you manipulate fate, outplay the system, or become a legend written in the stars? The story resets with every death, but knowledge is power—how will you wield it?',
    price: 39.99,
    image: 'Omnicient Reader POV_The Game.gif',
    genres: ['Action', 'Role-Playing', 'Simulation', 'Strategy']
  },
  {
    name: 'Tiana\'s Place',
    description: 'Step into the heart of New Orleans and bring Tiana\'s dream restaurant to life! Manage the kitchen, craft delicious Southern cuisine, and keep your customers happy with top-tier service. But in this lively city, magic is always simmering—face unexpected challenges, befriend familiar faces, and maybe even whip up a little enchantment along the way. Can you turn Tiana\'s Place into the finest spot in town while keeping the jazz, joy, and jambalaya flowing? The kitchen is open—let the good times roll!',
    price: 24.99,
    image: 'Tiana\'s Place.gif',
    genres: ['Role-Playing', 'Simulation']
  },
  {
    name: 'Spy X Family: Invaders',
    description: 'In a galaxy on the brink of war, superspy Loid Forger takes his mission beyond Earth—protecting humanity from cosmic threats while keeping his secret life intact. As intergalactic tensions rise, Anya deciphers alien minds, Yor handles threats with unmatched skill, and Bond\'s precognition proves vital in deep space. Balance high-stakes espionage, thrilling space battles, and heartwarming family moments as the Forgers navigate a universe full of danger and deception. Can Loid save Earth without revealing the truth to his loved ones? Or will this family\'s greatest mission be staying together?',
    price: 34.99,
    image: 'Spy x family_Invaders.jpg',
    genres: ['Adventure', 'Strategy']
  },
  {
    name: 'Penguin Run: A Game by Studio Ghibli',
    description: 'In Penguin Run, dive into a heartwarming adventure set in a bustling, beautifully crafted city. After school, your playful pet penguin escapes and dashes through the crowded streets, and it\'s up to you to catch up! Race through colorful neighborhoods, dodge streetlights, leap over vendor stalls, and duck under low-hanging signs, all while trying to catch your mischievous penguin. Each run takes you through a dynamic city landscape, with busy intersections, winding alleyways, and even rooftops to explore. The further you run, the faster the chase gets, with new challenges at every turn. Collect quirky power-ups and unlock special outfits for your penguin as you go! How far can you go before the penguin gets away?',
    price: 29.99,
    image: 'Studio Ghibli\'s Penguin Run.gif',
    genres: ['Adventure']
  },
  {
    name: 'Take-Off',
    description: 'In Take-Off, rev your engines and prepare for an adrenaline-packed ride through a series of intense, high-speed challenges. As a skilled motorcyclist, you\'ll tackle treacherous terrains—think rocky cliffs, crumbling highways, and dense forests—with nothing but your bike and your nerves of steel. Whether you\'re leaping over obstacles, drifting through tight corners, or speeding through rugged landscapes, every moment in Take-Off is a test of skill and precision. The further you go, the tougher the terrain gets, with storms, fires, and unexpected crashes pushing you to your limits. Customize your bike, unlock powerful upgrades, and prove that you can handle the most daring scenarios on two wheels. Will you rise to the challenge, or will the road defeat you?',
    price: 29.99,
    image: 'Take-Off.gif',
    genres: ['Simulation']
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Delete existing data
    await Game.deleteMany();
    console.log('Data cleared...');

    // Insert new data
    await Game.insertMany(games);
    console.log('Data imported...');

    // Exit process
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Run function to seed database
// Usage: node seedData.js
seedDatabase();

// // utils/seedData.js
// const mongoose = require('mongoose');
// const Game = require('../models/Game');
// const connectDB = require('../config/db');
// require('dotenv').config();

// // Initial game data
// const gameData = [
//   {
//     name: 'Haunted',
//     description: 'Step into a chilling nightmare as a little girl, trapped in a mysterious haunted mansion...',
//     price: 29.99,
//     image: 'Haunted.jpg',
//     genres: ['Horror', 'Strategy'],
//     featured: true
//   },
//   // Add more games...
// ];

// // Connect and seed data
// const importData = async () => {
//   try {
//     await connectDB();
    
//     // Clear existing data
//     await Game.deleteMany();
    
//     // Insert new data
//     await Game.insertMany(gameData);
    
//     console.log('Data imported successfully');
//     process.exit();
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// importData();