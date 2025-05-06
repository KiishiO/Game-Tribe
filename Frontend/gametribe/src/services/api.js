import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      // Clear token and refresh page to reset auth state
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  }
};

// Game services
export const gameService = {
  getAllGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },
  
  getGameById: async (id) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },
  
  getNewReleases: async () => {
    const response = await api.get('/games/new-releases');
    return response.data;
  },
  
  getPopularGames: async () => {
    const response = await api.get('/games/popular');
    return response.data;
  },
  
  getGamesByGenre: async (genre) => {
    const response = await api.get(`/games/genre/${genre}`);
    return response.data;
  }
};

// User services
export const userService = {
  updateProfile: async (updates) => {
    const response = await api.put('/users/profile', updates);
    return response.data;
  },
  
  changePassword: async (passwords) => {
    const response = await api.put('/users/password', passwords);
    return response.data;
  },
  
  addToFavorites: async (gameId) => {
    const response = await api.post(`/users/favorite/${gameId}`);
    return response.data;
  },
  
  removeFromFavorites: async (gameId) => {
    const response = await api.delete(`/users/favorite/${gameId}`);
    return response.data;
  }
};

// Order services
export const orderService = {
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  }
};

export default api;