import api from '../config/api';

export const studentService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data.data;
  },

  // Assignments
  getAssignments: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/student/assignments', { params });
    return response.data.data;
  },

  submitAssignment: async (assignmentId, formData) => {
    const response = await api.post(`/student/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Attendance
  getAttendance: async () => {
    const response = await api.get('/student/attendance');
    return response.data.data;
  },

  getAttendanceHistory: async (subjectCode = null) => {
    const params = subjectCode ? { subjectCode } : {};
    const response = await api.get('/student/attendance/history', { params });
    return response.data.data;
  },

  // Results
  getResults: async (semester = null) => {
    const params = semester ? { semester } : {};
    const response = await api.get('/student/results', { params });
    return response.data.data;
  },

  getCurrentSemesterResults: async () => {
    const response = await api.get('/student/results/current');
    return response.data.data;
  },

  // Campus Coins
  getCampusCoins: async () => {
    const response = await api.get('/student/campus-coins');
    return response.data.data;
  },

  getTransactions: async (params = {}) => {
    const response = await api.get('/student/campus-coins/transactions', { params });
    return response.data.data;
  },

  topupCoins: async (amount, method) => {
    const response = await api.post('/student/campus-coins/topup', { amount, method });
    return response.data.data;
  },

  // Gate Pass
  getGatePasses: async () => {
    const response = await api.get('/student/gate-pass');
    return response.data.data;
  },

  requestGatePass: async (data) => {
    const response = await api.post('/student/gate-pass', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Events
  getEvents: async () => {
    const response = await api.get('/student/events');
    return response.data.data;
  },

  registerEvent: async (eventId, registrationData) => {
    const response = await api.post(`/student/events/${eventId}/register`, registrationData);
    return response.data.data;
  },

  getMyEvents: async () => {
    const response = await api.get('/student/events/my-events');
    return response.data.data;
  },

  // Canteen
  getCanteenStalls: async () => {
    const response = await api.get('/student/canteen/stalls');
    return response.data.data;
  },

  getMenuItems: async (stallId) => {
    const response = await api.get(`/student/canteen/menu/${stallId}`);
    return response.data.data;
  },

  placeOrder: async (orderData) => {
    const response = await api.post('/student/canteen/orders', orderData);
    return response.data.data;
  },

  getOrders: async () => {
    const response = await api.get('/student/canteen/orders');
    return response.data.data;
  },

  // Hostel
  getHostelInfo: async () => {
    const response = await api.get('/student/hostel');
    return response.data.data;
  },

  getMessMenu: async () => {
    const response = await api.get('/student/hostel/mess-menu');
    return response.data.data;
  },

  // Notices
  getNotices: async () => {
    const response = await api.get('/student/notices');
    return response.data.data;
  },

  // Certificates
  getCertificates: async () => {
    const response = await api.get('/student/certificates');
    return response.data.data;
  },

  requestCertificate: async (data) => {
    const response = await api.post('/student/certificates/request', data);
    return response.data.data;
  },

  // Achievements
  getAchievements: async () => {
    const response = await api.get('/student/achievements');
    return response.data.data;
  },

  uploadAchievement: async (formData) => {
    const response = await api.post('/student/achievements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Timetable
  getTimetable: async () => {
    const response = await api.get('/student/timetable');
    return response.data.data;
  },

  // Academic Calendar
  getAcademicCalendar: async () => {
    const response = await api.get('/student/academic-calendar');
    return response.data.data;
  },

  // Fee Management
  getFees: async () => {
    const response = await api.get('/student/fees');
    return response.data.data;
  },

  payFee: async (paymentData) => {
    const response = await api.post('/student/fees/pay', paymentData);
    return response.data.data;
  },

  // Feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/student/feedback', feedbackData);
    return response.data.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/student/profile', data);
    return response.data.data;
  }
};
