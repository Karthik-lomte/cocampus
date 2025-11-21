import api from '../config/api';

export const sportsService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/sports/dashboard');
    return response.data.data;
  },

  // Facilities Management
  getFacilities: async () => {
    const response = await api.get('/sports/facilities');
    return response.data.data;
  },

  getFacilityDetails: async (facilityId) => {
    const response = await api.get(`/sports/facilities/${facilityId}`);
    return response.data.data;
  },

  createFacility: async (facilityData) => {
    const response = await api.post('/sports/facilities', facilityData);
    return response.data.data;
  },

  updateFacility: async (facilityId, facilityData) => {
    const response = await api.put(`/sports/facilities/${facilityId}`, facilityData);
    return response.data.data;
  },

  // Bookings Management
  getBookings: async (params = {}) => {
    const response = await api.get('/sports/bookings', { params });
    return response.data.data;
  },

  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/sports/bookings/${bookingId}`);
    return response.data.data;
  },

  approveBooking: async (bookingId, decision) => {
    const response = await api.post(`/sports/bookings/${bookingId}/approve`, decision);
    return response.data.data;
  },

  cancelBooking: async (bookingId, reason) => {
    const response = await api.post(`/sports/bookings/${bookingId}/cancel`, { reason });
    return response.data.data;
  },

  // Events & Tournaments
  getEvents: async (params = {}) => {
    const response = await api.get('/sports/events', { params });
    return response.data.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/sports/events', eventData);
    return response.data.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/sports/events/${eventId}`, eventData);
    return response.data.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/sports/events/${eventId}`);
    return response.data.data;
  },

  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/sports/events/${eventId}/registrations`);
    return response.data.data;
  },

  // Teams Management
  getTeams: async () => {
    const response = await api.get('/sports/teams');
    return response.data.data;
  },

  createTeam: async (teamData) => {
    const response = await api.post('/sports/teams', teamData);
    return response.data.data;
  },

  updateTeam: async (teamId, teamData) => {
    const response = await api.put(`/sports/teams/${teamId}`, teamData);
    return response.data.data;
  },

  addTeamMember: async (teamId, memberData) => {
    const response = await api.post(`/sports/teams/${teamId}/members`, memberData);
    return response.data.data;
  },

  removeTeamMember: async (teamId, memberId) => {
    const response = await api.delete(`/sports/teams/${teamId}/members/${memberId}`);
    return response.data.data;
  },

  // Equipment Management
  getEquipment: async () => {
    const response = await api.get('/sports/equipment');
    return response.data.data;
  },

  addEquipment: async (equipmentData) => {
    const response = await api.post('/sports/equipment', equipmentData);
    return response.data.data;
  },

  updateEquipment: async (equipmentId, equipmentData) => {
    const response = await api.put(`/sports/equipment/${equipmentId}`, equipmentData);
    return response.data.data;
  },

  // Equipment Requests
  getEquipmentRequests: async (params = {}) => {
    const response = await api.get('/sports/equipment/requests', { params });
    return response.data.data;
  },

  approveEquipmentRequest: async (requestId, decision) => {
    const response = await api.post(`/sports/equipment/requests/${requestId}/approve`, decision);
    return response.data.data;
  },

  // Attendance & Participation
  getAttendance: async (params = {}) => {
    const response = await api.get('/sports/attendance', { params });
    return response.data.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post('/sports/attendance', attendanceData);
    return response.data.data;
  },

  // Achievements
  getAchievements: async (params = {}) => {
    const response = await api.get('/sports/achievements', { params });
    return response.data.data;
  },

  addAchievement: async (formData) => {
    const response = await api.post('/sports/achievements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Reports
  getReport: async (params = {}) => {
    const response = await api.get('/sports/report', { params });
    return response.data.data;
  },

  // Notices
  getNotices: async () => {
    const response = await api.get('/sports/notices');
    return response.data.data;
  },

  createNotice: async (noticeData) => {
    const response = await api.post('/sports/notices', noticeData);
    return response.data.data;
  }
};
