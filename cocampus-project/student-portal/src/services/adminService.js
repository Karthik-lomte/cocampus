import api from '../config/api';

export const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data.data;
  },

  bulkUploadUsers: async (formData) => {
    const response = await api.post('/admin/users/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  resetPassword: async (userId, newPassword) => {
    const response = await api.post(`/admin/users/${userId}/reset-password`, { newPassword });
    return response.data.data;
  },

  // Department Management
  getDepartments: async () => {
    const response = await api.get('/admin/departments');
    return response.data.data;
  },

  createDepartment: async (data) => {
    const response = await api.post('/admin/departments', data);
    return response.data.data;
  },

  updateDepartment: async (id, data) => {
    const response = await api.put(`/admin/departments/${id}`, data);
    return response.data.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/admin/departments/${id}`);
    return response.data.data;
  },

  // Subject Management
  getSubjects: async (params = {}) => {
    const response = await api.get('/admin/subjects', { params });
    return response.data.data;
  },

  createSubject: async (data) => {
    const response = await api.post('/admin/subjects', data);
    return response.data.data;
  },

  updateSubject: async (id, data) => {
    const response = await api.put(`/admin/subjects/${id}`, data);
    return response.data.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/admin/subjects/${id}`);
    return response.data.data;
  },

  // Academic Management
  getAcademicCalendar: async () => {
    const response = await api.get('/admin/academic/calendar');
    return response.data.data;
  },

  createAcademicEvent: async (data) => {
    const response = await api.post('/admin/academic/calendar', data);
    return response.data.data;
  },

  // Fee Management
  getFeeStructures: async () => {
    const response = await api.get('/admin/fees/structures');
    return response.data.data;
  },

  createFeeStructure: async (data) => {
    const response = await api.post('/admin/fees/structures', data);
    return response.data.data;
  },

  // Hostel Management
  getHostelBlocks: async () => {
    const response = await api.get('/admin/hostel/blocks');
    return response.data.data;
  },

  createHostelBlock: async (data) => {
    const response = await api.post('/admin/hostel/blocks', data);
    return response.data.data;
  },

  // Sports Management
  getSportsFacilities: async () => {
    const response = await api.get('/admin/sports/facilities');
    return response.data.data;
  },

  createFacility: async (data) => {
    const response = await api.post('/admin/sports/facilities', data);
    return response.data.data;
  },

  // Approval Management
  getPendingApprovals: async () => {
    const response = await api.get('/admin/approvals/pending');
    return response.data.data;
  },

  // Notice Management
  getNotices: async () => {
    const response = await api.get('/admin/notices');
    return response.data.data;
  },

  createNotice: async (formData) => {
    const response = await api.post('/admin/notices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateNotice: async (id, formData) => {
    const response = await api.put(`/admin/notices/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteNotice: async (id) => {
    const response = await api.delete(`/admin/notices/${id}`);
    return response.data.data;
  },

  // Reports & Analytics
  getReports: async (params = {}) => {
    const response = await api.get('/admin/reports', { params });
    return response.data.data;
  },

  // System Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data.data;
  }
};
