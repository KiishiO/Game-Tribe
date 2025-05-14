import axios from 'axios';

// API base URL (remove trailing slash)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      // Don't redirect if we're already on auth pages or if it's an auth endpoint
      const isAuthEndpoint = error.config.url.includes('/auth/');
      const isAuthPage = window.location.pathname.includes('/login') || 
                        window.location.pathname.includes('/register');
      
      if (!isAuthEndpoint && !isAuthPage) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Admin services
export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },
  
  updateUser: async (userId, updates) => {
    const response = await api.put(`/api/admin/users/${userId}`, updates);
    return response.data;
  },
  
  getAllOrders: async () => {
    const response = await api.get('/api/admin/orders');
    return response.data;
  },
  
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/api/admin/orders/${orderId}/status`, { status });
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  }
};

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/user');
    return response.data;
  }
};

// Game services
export const gameService = {
  getAllGames: async () => {
    const response = await api.get('/api/games');
    return response.data;
  },
  
  getGameById: async (id) => {
    const response = await api.get(`/api/games/${id}`);
    return response.data;
  },
  
  getNewReleases: async () => {
    const response = await api.get('/api/games/new-releases');
    return response.data;
  },
  
  getPopularGames: async () => {
    const response = await api.get('/api/games/popular');
    return response.data;
  },
  
  getGamesByGenre: async (genre) => {
    const response = await api.get(`/api/games/genre/${genre}`);
    return response.data;
  }
};

// User services
export const userService = {
  updateProfile: async (updates) => {
    const response = await api.put('/api/users/profile', updates);
    return response.data;
  },
  
  changePassword: async (passwords) => {
    const response = await api.put('/api/users/password', passwords);
    return response.data;
  },
  
  addToFavorites: async (gameId) => {
    const response = await api.post(`/api/users/favorite/${gameId}`);
    return response.data;
  },
  
  removeFromFavorites: async (gameId) => {
    const response = await api.delete(`/api/users/favorite/${gameId}`);
    return response.data;
  },
  
  getFavorites: async () => {
    const response = await api.get('/api/users/favorites');
    return response.data;
  }
};

// Order services
export const orderService = {
  getUserOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },
  
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  }
};

export default api;