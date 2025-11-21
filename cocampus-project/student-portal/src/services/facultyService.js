import api from '../config/api';

export const facultyService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/faculty/dashboard');
    return response.data.data;
  },

  // Timetable
  getTimetable: async () => {
    const response = await api.get('/faculty/timetable');
    return response.data.data;
  },

  // Assignments
  getAssignments: async (params = {}) => {
    const response = await api.get('/faculty/assignments', { params });
    return response.data.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/faculty/assignments', assignmentData);
    return response.data.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/faculty/assignments/${assignmentId}`, assignmentData);
    return response.data.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/faculty/assignments/${assignmentId}`);
    return response.data.data;
  },

  getAssignmentSubmissions: async (assignmentId) => {
    const response = await api.get(`/faculty/assignments/${assignmentId}/submissions`);
    return response.data.data;
  },

  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.post(`/faculty/submissions/${submissionId}/grade`, gradeData);
    return response.data.data;
  },

  // Attendance
  getSessions: async (params = {}) => {
    const response = await api.get('/faculty/sessions', { params });
    return response.data.data;
  },

  createSession: async (sessionData) => {
    const response = await api.post('/faculty/sessions', sessionData);
    return response.data.data;
  },

  markAttendance: async (sessionId, attendanceData) => {
    const response = await api.post(`/faculty/sessions/${sessionId}/attendance`, attendanceData);
    return response.data.data;
  },

  getAttendanceReport: async (params = {}) => {
    const response = await api.get('/faculty/attendance/report', { params });
    return response.data.data;
  },

  // Marks & Results
  getExams: async (params = {}) => {
    const response = await api.get('/faculty/exams', { params });
    return response.data.data;
  },

  enterMarks: async (examId, marksData) => {
    const response = await api.post(`/faculty/exams/${examId}/marks`, marksData);
    return response.data.data;
  },

  updateMarks: async (markId, markData) => {
    const response = await api.put(`/faculty/marks/${markId}`, markData);
    return response.data.data;
  },

  getMarksReport: async (params = {}) => {
    const response = await api.get('/faculty/marks/report', { params });
    return response.data.data;
  },

  // Students
  getStudents: async (params = {}) => {
    const response = await api.get('/faculty/students', { params });
    return response.data.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/faculty/students/${studentId}`);
    return response.data.data;
  },

  // Leave Requests
  getLeaveRequests: async (params = {}) => {
    const response = await api.get('/faculty/leave-requests', { params });
    return response.data.data;
  },

  respondToLeave: async (leaveId, response) => {
    const resp = await api.post(`/faculty/leave-requests/${leaveId}/respond`, response);
    return resp.data.data;
  },

  // Study Materials
  getMaterials: async (params = {}) => {
    const response = await api.get('/faculty/materials', { params });
    return response.data.data;
  },

  uploadMaterial: async (formData) => {
    const response = await api.post('/faculty/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteMaterial: async (materialId) => {
    const response = await api.delete(`/faculty/materials/${materialId}`);
    return response.data.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get('/faculty/profile');
    return response.data.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/faculty/profile', profileData);
    return response.data.data;
  },

  // Notices
  getNotices: async () => {
    const response = await api.get('/faculty/notices');
    return response.data.data;
  }
};
