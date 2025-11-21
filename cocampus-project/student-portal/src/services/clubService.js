import api from '../config/api';

export const clubService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/club/dashboard');
    return response.data.data;
  },

  // Club Profile
  getProfile: async () => {
    const response = await api.get('/club/profile');
    return response.data.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/club/profile', profileData);
    return response.data.data;
  },

  // Members Management
  getMembers: async (params = {}) => {
    const response = await api.get('/club/members', { params });
    return response.data.data;
  },

  addMember: async (memberData) => {
    const response = await api.post('/club/members', memberData);
    return response.data.data;
  },

  removeMember: async (memberId) => {
    const response = await api.delete(`/club/members/${memberId}`);
    return response.data.data;
  },

  updateMemberRole: async (memberId, roleData) => {
    const response = await api.put(`/club/members/${memberId}/role`, roleData);
    return response.data.data;
  },

  // Events Management
  getEvents: async (params = {}) => {
    const response = await api.get('/club/events', { params });
    return response.data.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/club/events', eventData);
    return response.data.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/club/events/${eventId}`, eventData);
    return response.data.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/club/events/${eventId}`);
    return response.data.data;
  },

  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/club/events/${eventId}/registrations`);
    return response.data.data;
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await api.get('/club/announcements');
    return response.data.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await api.post('/club/announcements', announcementData);
    return response.data.data;
  },

  deleteAnnouncement: async (announcementId) => {
    const response = await api.delete(`/club/announcements/${announcementId}`);
    return response.data.data;
  },

  // Activities & Achievements
  getActivities: async (params = {}) => {
    const response = await api.get('/club/activities', { params });
    return response.data.data;
  },

  createActivity: async (formData) => {
    const response = await api.post('/club/activities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Budget & Expenses
  getBudget: async () => {
    const response = await api.get('/club/budget');
    return response.data.data;
  },

  addExpense: async (expenseData) => {
    const response = await api.post('/club/expenses', expenseData);
    return response.data.data;
  },

  getExpenses: async (params = {}) => {
    const response = await api.get('/club/expenses', { params });
    return response.data.data;
  },

  // Reports
  getReport: async (params = {}) => {
    const response = await api.get('/club/report', { params });
    return response.data.data;
  }
};
