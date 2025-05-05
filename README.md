# Game Tribe

## Project Overview
Game Tribe is a comprehensive web application that serves as both a marketplace and community hub for gamers. Built with React on the frontend and Node.js/Express/MongoDB on the backend, Game Tribe allows users to browse, purchase, and interact with video games and fellow gamers.

## Team Members
- Iteoluwakishi Osomo (iaosomo@iastate.edu)
- Fuchinanya Akpuokwe (fuchicay@iastate.edu)

## Features
- Dynamic Homepage with featured games carousel
- Interactive Game Catalog with filtering and search
- Detailed Game Pages with reviews and ratings
- Shopping Cart System
- User Authentication
- User Profiles with purchase history and wishlist
- Checkout Process
- Admin Dashboard for content management

## Repository Structure
- `/frontend` - React frontend application
- `/backend` - Node.js/Express backend
- `/Documents` - Project documentation and planning materials

## Tech Stack
### Frontend
- React (with hooks)
- React Router
- Axios
- Bootstrap/Material UI
- CSS/SCSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)

## Setup Instructions

### Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)

### Frontend Setup
1. Navigate to the frontend directory (cd frontend)
2. Install dependencies (npm install)
3. Start the development server (npm start)
4. The application will be available at `http://localhost:3000`

### Backend Setup
1. Navigate to the backend directory (cd backend)
2. Install dependencies (npm install)
3. Create a `.env` file with the following variables:
    - PORT=5000
    - MONGODB_URI=mongodb://localhost:27017/game-tribe
    - JWT_SECRET=your_jwt_secret
4. Start the server (npm start)
5. The API will be available at `http://localhost:5000`

## Project Status
This project is currently in development as part of COM S 3190 - Construction of User Interfaces at Iowa State University.

