import api from '../config/api';

export const hostelService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/hostel/dashboard');
    return response.data.data;
  },

  // Hostel Management
  getBlocks: async () => {
    const response = await api.get('/hostel/blocks');
    return response.data.data;
  },

  getBlockDetails: async (blockId) => {
    const response = await api.get(`/hostel/blocks/${blockId}`);
    return response.data.data;
  },

  getRooms: async (params = {}) => {
    const response = await api.get('/hostel/rooms', { params });
    return response.data.data;
  },

  getRoomDetails: async (roomId) => {
    const response = await api.get(`/hostel/rooms/${roomId}`);
    return response.data.data;
  },

  // Residents Management
  getResidents: async (params = {}) => {
    const response = await api.get('/hostel/residents', { params });
    return response.data.data;
  },

  getResidentDetails: async (residentId) => {
    const response = await api.get(`/hostel/residents/${residentId}`);
    return response.data.data;
  },

  allocateRoom: async (allocationData) => {
    const response = await api.post('/hostel/rooms/allocate', allocationData);
    return response.data.data;
  },

  deallocateRoom: async (residentId) => {
    const response = await api.post(`/hostel/residents/${residentId}/deallocate`);
    return response.data.data;
  },

  // Gate Pass Management
  getGatePasses: async (params = {}) => {
    const response = await api.get('/hostel/gate-passes', { params });
    return response.data.data;
  },

  approveGatePass: async (passId, decision) => {
    const response = await api.post(`/hostel/gate-passes/${passId}/approve`, decision);
    return response.data.data;
  },

  recordEntry: async (passId, entryData) => {
    const response = await api.post(`/hostel/gate-passes/${passId}/entry`, entryData);
    return response.data.data;
  },

  recordExit: async (passId, exitData) => {
    const response = await api.post(`/hostel/gate-passes/${passId}/exit`, exitData);
    return response.data.data;
  },

  // Mess Management
  getMessMenu: async () => {
    const response = await api.get('/hostel/mess/menu');
    return response.data.data;
  },

  updateMessMenu: async (menuData) => {
    const response = await api.put('/hostel/mess/menu', menuData);
    return response.data.data;
  },

  getMessFeedback: async (params = {}) => {
    const response = await api.get('/hostel/mess/feedback', { params });
    return response.data.data;
  },

  // Complaints & Maintenance
  getComplaints: async (params = {}) => {
    const response = await api.get('/hostel/complaints', { params });
    return response.data.data;
  },

  updateComplaintStatus: async (complaintId, statusData) => {
    const response = await api.put(`/hostel/complaints/${complaintId}/status`, statusData);
    return response.data.data;
  },

  // Notices
  getNotices: async () => {
    const response = await api.get('/hostel/notices');
    return response.data.data;
  },

  createNotice: async (formData) => {
    const response = await api.post('/hostel/notices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Attendance
  getAttendance: async (params = {}) => {
    const response = await api.get('/hostel/attendance', { params });
    return response.data.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post('/hostel/attendance', attendanceData);
    return response.data.data;
  },

  // Reports
  getReport: async (params = {}) => {
    const response = await api.get('/hostel/report', { params });
    return response.data.data;
  }
};
