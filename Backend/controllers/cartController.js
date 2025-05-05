// controllers/cartController.js - Cart controller
const Cart = require('../models/Cart');
const Game = require('../models/Game');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    // Find user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Calculate cart totals
    const cartTotals = cart.getCartTotal();

    res.status(200).json({
      success: true,
      data: {
        cart,
        ...cartTotals
      }
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

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { gameId, quantity = 1 } = req.body;

    // Validate gameId
    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required'
      });
    }

    // Find the game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: `Game not found with id of ${gameId}`
      });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Check if the game is already in the cart
    const itemIndex = cart.items.findIndex(item => 
      item.game.toString() === gameId
    );

    if (itemIndex > -1) {
      // Game exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Game does not exist in cart, add new item
      cart.items.push({
        game: gameId,
        name: game.name,
        price: game.price,
        image: game.image,
        quantity
      });
    }

    // Save the updated cart
    await cart.save();

    // Calculate cart totals
    const cartTotals = cart.getCartTotal();

    res.status(200).json({
      success: true,
      data: {
        cart,
        ...cartTotals
      }
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

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update item quantity
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    // Calculate cart totals
    const cartTotals = cart.getCartTotal();

    res.status(200).json({
      success: true,
      data: {
        cart,
        ...cartTotals
      }
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

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    // Save the updated cart
    await cart.save();

    // Calculate cart totals
    const cartTotals = cart.getCartTotal();

    res.status(200).json({
      success: true,
      data: {
        cart,
        ...cartTotals
      }
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

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear all items
    cart.items = [];

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      success: true,
      data: {
        cart,
        subtotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0
      }
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