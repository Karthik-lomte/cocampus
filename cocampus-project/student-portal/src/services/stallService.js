import api from '../config/api';

export const stallService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/stall/dashboard');
    return response.data.data;
  },

  // Stall Profile
  getProfile: async () => {
    const response = await api.get('/stall/profile');
    return response.data.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/stall/profile', profileData);
    return response.data.data;
  },

  // Menu Management
  getMenu: async () => {
    const response = await api.get('/stall/menu');
    return response.data.data;
  },

  addMenuItem: async (formData) => {
    const response = await api.post('/stall/menu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateMenuItem: async (itemId, formData) => {
    const response = await api.put(`/stall/menu/${itemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteMenuItem: async (itemId) => {
    const response = await api.delete(`/stall/menu/${itemId}`);
    return response.data.data;
  },

  toggleItemAvailability: async (itemId, available) => {
    const response = await api.patch(`/stall/menu/${itemId}/availability`, { available });
    return response.data.data;
  },

  // Orders Management
  getOrders: async (params = {}) => {
    const response = await api.get('/stall/orders', { params });
    return response.data.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await api.get(`/stall/orders/${orderId}`);
    return response.data.data;
  },

  acceptOrder: async (orderId) => {
    const response = await api.post(`/stall/orders/${orderId}/accept`);
    return response.data.data;
  },

  rejectOrder: async (orderId, reason) => {
    const response = await api.post(`/stall/orders/${orderId}/reject`, { reason });
    return response.data.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/stall/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  completeOrder: async (orderId) => {
    const response = await api.post(`/stall/orders/${orderId}/complete`);
    return response.data.data;
  },

  // Inventory Management
  getInventory: async () => {
    const response = await api.get('/stall/inventory');
    return response.data.data;
  },

  addInventoryItem: async (itemData) => {
    const response = await api.post('/stall/inventory', itemData);
    return response.data.data;
  },

  updateInventoryItem: async (itemId, itemData) => {
    const response = await api.put(`/stall/inventory/${itemId}`, itemData);
    return response.data.data;
  },

  // Sales & Revenue
  getSales: async (params = {}) => {
    const response = await api.get('/stall/sales', { params });
    return response.data.data;
  },

  getRevenue: async (params = {}) => {
    const response = await api.get('/stall/revenue', { params });
    return response.data.data;
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/stall/analytics', { params });
    return response.data.data;
  },

  getPopularItems: async (params = {}) => {
    const response = await api.get('/stall/analytics/popular-items', { params });
    return response.data.data;
  },

  // Feedback & Ratings
  getFeedback: async (params = {}) => {
    const response = await api.get('/stall/feedback', { params });
    return response.data.data;
  },

  respondToFeedback: async (feedbackId, response) => {
    const resp = await api.post(`/stall/feedback/${feedbackId}/respond`, response);
    return resp.data.data;
  },

  // Reports
  getReport: async (params = {}) => {
    const response = await api.get('/stall/report', { params });
    return response.data.data;
  }
};
