import api from '../config/api';

export const principalService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/principal/dashboard');
    return response.data.data;
  },

  // Department Management
  getDepartments: async () => {
    const response = await api.get('/principal/departments');
    return response.data.data;
  },

  getDepartmentDetails: async (deptId) => {
    const response = await api.get(`/principal/departments/${deptId}`);
    return response.data.data;
  },

  getDepartmentReport: async (deptId, params = {}) => {
    const response = await api.get(`/principal/departments/${deptId}/report`, { params });
    return response.data.data;
  },

  // Faculty Management
  getAllFaculty: async (params = {}) => {
    const response = await api.get('/principal/faculty', { params });
    return response.data.data;
  },

  getFacultyDetails: async (facultyId) => {
    const response = await api.get(`/principal/faculty/${facultyId}`);
    return response.data.data;
  },

  // Student Management
  getAllStudents: async (params = {}) => {
    const response = await api.get('/principal/students', { params });
    return response.data.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/principal/students/${studentId}`);
    return response.data.data;
  },

  // Academic Performance
  getAcademicReport: async (params = {}) => {
    const response = await api.get('/principal/academic/report', { params });
    return response.data.data;
  },

  // Approvals
  getPendingApprovals: async () => {
    const response = await api.get('/principal/approvals/pending');
    return response.data.data;
  },

  approveRequest: async (requestId, decision) => {
    const response = await api.post(`/principal/approvals/${requestId}`, decision);
    return response.data.data;
  },

  // Leave Requests
  getLeaveRequests: async (params = {}) => {
    const response = await api.get('/principal/leave-requests', { params });
    return response.data.data;
  },

  // Events Management
  getEvents: async () => {
    const response = await api.get('/principal/events');
    return response.data.data;
  },

  approveEvent: async (eventId, decision) => {
    const response = await api.post(`/principal/events/${eventId}/approve`, decision);
    return response.data.data;
  },

  // Financial Reports
  getFinancialReport: async (params = {}) => {
    const response = await api.get('/principal/financial/report', { params });
    return response.data.data;
  },

  // Notices
  getNotices: async () => {
    const response = await api.get('/principal/notices');
    return response.data.data;
  },

  createNotice: async (formData) => {
    const response = await api.post('/principal/notices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Infrastructure Management
  getInfrastructure: async () => {
    const response = await api.get('/principal/infrastructure');
    return response.data.data;
  },

  // Complaints & Feedback
  getComplaints: async (params = {}) => {
    const response = await api.get('/principal/complaints', { params });
    return response.data.data;
  },

  respondToComplaint: async (complaintId, response) => {
    const resp = await api.post(`/principal/complaints/${complaintId}/respond`, response);
    return resp.data.data;
  }
};
