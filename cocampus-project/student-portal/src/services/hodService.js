import api from '../config/api';

export const hodService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/hod/dashboard');
    return response.data.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get('/hod/profile');
    return response.data.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/hod/profile', data);
    return response.data.data;
  },

  // Faculty Management
  getFaculty: async (params = {}) => {
    const response = await api.get('/hod/faculty', { params });
    return response.data.data;
  },

  getFacultyDetails: async (facultyId) => {
    const response = await api.get(`/hod/faculty/${facultyId}`);
    return response.data.data;
  },

  assignSubject: async (facultyId, subjectData) => {
    const response = await api.post(`/hod/faculty/${facultyId}/assign-subject`, subjectData);
    return response.data.data;
  },

  createFaculty: async (facultyData) => {
    const response = await api.post('/hod/faculty', facultyData);
    return response.data.data;
  },

  // Student Management
  getStudents: async (params = {}) => {
    const response = await api.get('/hod/students', { params });
    return response.data.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/hod/students/${studentId}`);
    return response.data.data;
  },

  // Subject Management
  getSubjects: async () => {
    const response = await api.get('/hod/subjects');
    return response.data.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post('/hod/subjects', subjectData);
    return response.data.data;
  },

  updateSubject: async (subjectId, subjectData) => {
    const response = await api.put(`/hod/subjects/${subjectId}`, subjectData);
    return response.data.data;
  },

  // Timetable Management
  getTimetable: async (params = {}) => {
    const response = await api.get('/hod/timetable', { params });
    return response.data.data;
  },

  createTimetable: async (timetableData) => {
    const response = await api.post('/hod/timetable', timetableData);
    return response.data.data;
  },

  updateTimetable: async (timetableId, timetableData) => {
    const response = await api.put(`/hod/timetable/${timetableId}`, timetableData);
    return response.data.data;
  },

  // Attendance Reports
  getAttendanceReport: async (params = {}) => {
    const response = await api.get('/hod/attendance/report', { params });
    return response.data.data;
  },

  // Performance Analysis
  getPerformanceReport: async (params = {}) => {
    const response = await api.get('/hod/performance/report', { params });
    return response.data.data;
  },

  // Leave Approvals
  getLeaveRequests: async (params = {}) => {
    const response = await api.get('/hod/leave-requests', { params });
    return response.data.data;
  },

  approveLeave: async (leaveId, remarks) => {
    const response = await api.post(`/hod/leave-requests/${leaveId}/approve`, { remarks });
    return response.data.data;
  },

  rejectLeave: async (leaveId, remarks) => {
    const response = await api.post(`/hod/leave-requests/${leaveId}/reject`, { remarks });
    return response.data.data;
  },

  applyLeave: async (leaveData) => {
    const response = await api.post('/hod/leave-requests/apply', leaveData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Gate Pass Approvals
  getGatePassRequests: async (params = {}) => {
    const response = await api.get('/hod/gate-pass-requests', { params });
    return response.data.data;
  },

  approveGatePass: async (gatePassId, remarks) => {
    const response = await api.post(`/hod/gate-pass-requests/${gatePassId}/approve`, { remarks });
    return response.data.data;
  },

  rejectGatePass: async (gatePassId, remarks) => {
    const response = await api.post(`/hod/gate-pass-requests/${gatePassId}/reject`, { remarks });
    return response.data.data;
  },

  // Department Reports
  getDepartmentReport: async (params = {}) => {
    const response = await api.get('/hod/department/report', { params });
    return response.data.data;
  },

  // Notices
  getNotices: async () => {
    const response = await api.get('/hod/notices');
    return response.data.data;
  },

  createNotice: async (formData) => {
    const response = await api.post('/hod/notices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Achievements
  getAchievements: async (params = {}) => {
    const response = await api.get('/hod/achievements', { params });
    return response.data.data;
  },

  uploadAchievement: async (formData) => {
    const response = await api.post('/hod/achievements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  downloadAchievementCertificate: async (achievementId) => {
    const response = await api.get(`/hod/achievements/${achievementId}/certificate`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Resources
  getResources: async (params = {}) => {
    const response = await api.get('/hod/resources', { params });
    return response.data.data;
  },

  createResource: async (formData) => {
    const response = await api.post('/hod/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateResource: async (resourceId, resourceData) => {
    const response = await api.put(`/hod/resources/${resourceId}`, resourceData);
    return response.data.data;
  },

  deleteResource: async (resourceId) => {
    const response = await api.delete(`/hod/resources/${resourceId}`);
    return response.data.data;
  }
};
