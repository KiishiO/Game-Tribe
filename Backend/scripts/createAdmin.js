const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@gametribe.com' });
    
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      email: 'admin@gametribe.com',
      password: hashedPassword,
      displayName: 'Admin',
      isAdmin: true,
      profileImage: '/assets/myotherimages/player_01.jpg'
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@gametribe.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();