// src/services/gameService.js - Game API service
import api from './api';

export const gameService = {
  // Get all games with optional filters
  getGames: async (filters = {}) => {
    try {
      const response = await api.get('/games', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  // Get a single game by ID
  getGameById: async (id) => {
    try {
      const response = await api.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching game with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new game (admin only)
  createGame: async (gameData) => {
    try {
      const response = await api.post('/games', gameData);
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  // Update a game (admin only)
  updateGame: async (id, gameData) => {
    try {
      const response = await api.put(`/games/${id}`, gameData);
      return response.data;
    } catch (error) {
      console.error(`Error updating game with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a game (admin only)
  deleteGame: async (id) => {
    try {
      const response = await api.delete(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting game with id ${id}:`, error);
      throw error;
    }
  }
};
