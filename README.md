# Game Tribe 🎮

A full-stack e-commerce gaming platform with community features built using the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌟 Features

### User Features
- **Authentication & Authorization**: Secure user registration and login system
- **Game Catalog**: Browse and search games with filtering options
- **Shopping Cart**: Add games to cart with quantity management
- **Checkout System**: Complete purchase with shipping information
- **Favorites System**: Save games for later viewing
- **User Profile**: Customizable profiles with avatar selection
- **Order History**: Track past purchases and order status

### Admin Features
- **Dashboard**: Overview of platform statistics and recent orders
- **User Management**: View, edit, and delete user accounts
- **Order Management**: Update order statuses and view details
- **Revenue Tracking**: Monitor platform performance

### Community Features
- **Favorites**: Quick access to saved games
- **Recently Viewed**: Track browsing history

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Bootstrap 5
- Context API for state management
- Axios for API calls
- CSS3 with custom styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm 
- Git

## 🚀 Installation

### 1. Clone the repository
git clone https://github.com/yourusername/game-tribe.git
cd game-tribe

### 2. Backend Setup
Navigate to the backend directory:
cd Backend

Install dependencies:
npm install

Create a .env file in the Backend directory:
envMONGODB_URI=mongodb://localhost:27017/gameTribeDB
JWT_SECRET=your_super_secret_jwt_key
PORT=5000

Start the backend server:
npm start

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
cd Frontend

Install dependencies:
npm install

Update the proxy in package.json (should already be set):
"proxy": "http://localhost:5000"

Start the React development server:
npm start

### 4. Database Setup
Make sure MongoDB is running on your system:
mongod

Create an admin user by running the script:
cd Backend
node seed/gameData.js
node scripts/createAdmin.js

### Default admin credentials:

Email: admin@gametribe.com
Password: admin123

📁 Project Structure
MN_5/
├── Frontend/gametribe/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── Backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   ├── server.js
│   └── package.json
└── Documents/
    └── data.json


## Database Models
User: Authentication, profile, favorites
Game: Product info, reviews, ratings
Order: Purchase records with items and shipping info

🎮 Usage
## For Users
Register for an account or login
Browse games on the home page
Search and filter games by genre or price
Add games to cart
Complete checkout with shipping info
Leave reviews and ratings
Save favorite games
View order history in profile

## For Admins
Login with admin credentials
Access admin panel via sidebar
View platform statistics on dashboard
Manage users, orders, and games
Update order statuses
Add/edit/delete games from catalog

📱 Responsive Design
The application is fully responsive and works on:
Desktop (1200px+)
Tablet (768px - 1199px)
Mobile (320px - 767px)

🔒 Security Features
JWT token authentication
Password hashing with bcrypt
Protected admin routes
Input validation
CORS configuration
Environment variables for sensitive data

🐛 Known Issues
Image upload for games is currently filename-based only
Payment gateway integration pending
Email notifications not implemented
Search is case-sensitive

📈 Future Enhancements
 Real payment gateway integration
 Email notifications for orders
 Advanced recommendation system
 Wishlist feature
 Game screenshots gallery
 User messaging system
 Mobile app development

👥 Team
Developer 1 - fuchicay@iastate.edu
Developer 2 - iaosomo@iastate.edu

🙏 Acknowledgments

Iowa State University SE/COM S 3190 Course
Bootstrap for UI components
Font Awesome for icons
MongoDB documentation
React documentation

📞 Support
For support, email fuchicay@iastate.edu, iaosomo@iastate.edu or create an issue in the repository.

Last updated: May 2025