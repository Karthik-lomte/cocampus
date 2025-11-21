import api from '../config/api';

export const canteenService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/canteen/dashboard');
    return response.data.data;
  },

  // Stalls Management
  getStalls: async () => {
    const response = await api.get('/canteen/stalls');
    return response.data.data;
  },

  getStallDetails: async (stallId) => {
    const response = await api.get(`/canteen/stalls/${stallId}`);
    return response.data.data;
  },

  createStall: async (stallData) => {
    const response = await api.post('/canteen/stalls', stallData);
    return response.data.data;
  },

  updateStall: async (stallId, stallData) => {
    const response = await api.put(`/canteen/stalls/${stallId}`, stallData);
    return response.data.data;
  },

  // Orders Management
  getOrders: async (params = {}) => {
    const response = await api.get('/canteen/orders', { params });
    return response.data.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await api.get(`/canteen/orders/${orderId}`);
    return response.data.data;
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/canteen/orders/${orderId}/status`, statusData);
    return response.data.data;
  },

  // Revenue & Analytics
  getRevenue: async (params = {}) => {
    const response = await api.get('/canteen/revenue', { params });
    return response.data.data;
  },

  getSalesAnalytics: async (params = {}) => {
    const response = await api.get('/canteen/analytics', { params });
    return response.data.data;
  },

  // Feedback
  getFeedback: async (params = {}) => {
    const response = await api.get('/canteen/feedback', { params });
    return response.data.data;
  },

  // Inventory (if managed centrally)
  getInventory: async () => {
    const response = await api.get('/canteen/inventory');
    return response.data.data;
  },

  updateInventory: async (inventoryData) => {
    const response = await api.put('/canteen/inventory', inventoryData);
    return response.data.data;
  },

  // Reports
  getReport: async (params = {}) => {
    const response = await api.get('/canteen/report', { params });
    return response.data.data;
  },

  // Notices
  getNotices: async () => {
    const response = await api.get('/canteen/notices');
    return response.data.data;
  },

  createNotice: async (noticeData) => {
    const response = await api.post('/canteen/notices', noticeData);
    return response.data.data;
  }
};
