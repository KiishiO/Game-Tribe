// src/services/orderService.js - Order API service
import api from './api';

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user's orders
  getMyOrders: async () => {
    try {
      const response = await api.get('/orders/myorders');
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  },

  // Get a single order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  },

  // Update order to paid
  updateOrderToPaid: async (id, paymentResult) => {
    try {
      const response = await api.put(`/orders/${id}/pay`, paymentResult);
      return response.data;
    } catch (error) {
      console.error(`Error updating order to paid:`, error);
      throw error;
    }
  }
};