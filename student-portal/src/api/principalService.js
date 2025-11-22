import apiClient from './client';

// ============= DASHBOARD =============
export const getPrincipalDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/admin');
  return response.data;
};

// ============= DEPARTMENTS =============
export const getDepartments = async () => {
  const response = await apiClient.get('/departments');
  return response.data;
};

export const getDepartment = async (id) => {
  const response = await apiClient.get(`/departments/${id}`);
  return response.data;
};

export const updateDepartment = async (id, deptData) => {
  const response = await apiClient.put(`/departments/${id}`, deptData);
  return response.data;
};

export const getDepartmentStats = async () => {
  const response = await apiClient.get('/departments/stats');
  return response.data;
};

// ============= USERS =============
export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/users?${params}`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const getUserStats = async () => {
  const response = await apiClient.get('/users/stats');
  return response.data;
};

// ============= LEAVE MANAGEMENT =============
export const getLeaves = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/leaves?${params}`);
  return response.data;
};

export const getLeave = async (id) => {
  const response = await apiClient.get(`/leaves/${id}`);
  return response.data;
};

export const createLeave = async (leaveData) => {
  const response = await apiClient.post('/leaves', leaveData);
  return response.data;
};

export const updateLeave = async (id, leaveData) => {
  const response = await apiClient.put(`/leaves/${id}`, leaveData);
  return response.data;
};

export const deleteLeave = async (id) => {
  const response = await apiClient.delete(`/leaves/${id}`);
  return response.data;
};

export const approveLeave = async (id, remarks) => {
  const response = await apiClient.put(`/leaves/${id}/approve`, { remarks });
  return response.data;
};

export const rejectLeave = async (id, reason, remarks) => {
  const response = await apiClient.put(`/leaves/${id}/reject`, { reason, remarks });
  return response.data;
};

export const cancelLeave = async (id) => {
  const response = await apiClient.put(`/leaves/${id}/cancel`);
  return response.data;
};

export const getLeaveStats = async () => {
  const response = await apiClient.get('/leaves/stats/overview');
  return response.data;
};

// ============= APPROVALS =============
export const getApprovals = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/approvals?${params}`);
  return response.data;
};

export const approveRequest = async (id) => {
  const response = await apiClient.put(`/approvals/${id}/approve`);
  return response.data;
};

export const rejectRequest = async (id, reason) => {
  const response = await apiClient.put(`/approvals/${id}/reject`, { reason });
  return response.data;
};

export const getApprovalStats = async () => {
  const response = await apiClient.get('/approvals/stats');
  return response.data;
};

// ============= ACADEMIC =============
export const getSemesters = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/academic/semesters?${params}`);
  return response.data;
};

export const getAcademicEvents = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/academic/events?${params}`);
  return response.data;
};

export const createAcademicEvent = async (eventData) => {
  const response = await apiClient.post('/academic/events', eventData);
  return response.data;
};

export const updateAcademicEvent = async (id, eventData) => {
  const response = await apiClient.put(`/academic/events/${id}`, eventData);
  return response.data;
};

export const deleteAcademicEvent = async (id) => {
  const response = await apiClient.delete(`/academic/events/${id}`);
  return response.data;
};

export const getAcademicStats = async () => {
  const response = await apiClient.get('/academic/stats');
  return response.data;
};

// ============= FEES =============
export const getFeeStats = async () => {
  const response = await apiClient.get('/fees/stats');
  return response.data;
};

// ============= NOTICES =============
export const getNotices = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/notices?${params}`);
  return response.data;
};

export const createNotice = async (noticeData) => {
  const response = await apiClient.post('/notices', noticeData);
  return response.data;
};

export const updateNotice = async (id, noticeData) => {
  const response = await apiClient.put(`/notices/${id}`, noticeData);
  return response.data;
};

export const deleteNotice = async (id) => {
  const response = await apiClient.delete(`/notices/${id}`);
  return response.data;
};

export const toggleNoticePin = async (id) => {
  const response = await apiClient.patch(`/notices/${id}/pin`);
  return response.data;
};

// ============= SUBJECTS =============
export const getSubjects = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/subjects?${params}`);
  return response.data;
};

export const getSubjectStats = async () => {
  const response = await apiClient.get('/subjects/stats');
  return response.data;
};

// ============= PERFORMANCE METRICS =============
export const getPerformanceMetrics = async () => {
  // Aggregate data from multiple sources
  const [userStats, deptStats, subjectStats, feeStats] = await Promise.all([
    getUserStats(),
    getDepartmentStats(),
    getSubjectStats(),
    getFeeStats()
  ]);

  return {
    success: true,
    data: {
      userStats: userStats.data,
      deptStats: deptStats.data,
      subjectStats: subjectStats.data,
      feeStats: feeStats.data
    }
  };
};

const principalService = {
  // Dashboard
  getPrincipalDashboardStats,

  // Departments
  getDepartments,
  getDepartment,
  updateDepartment,
  getDepartmentStats,

  // Users
  getUsers,
  getUser,
  updateUser,
  getUserStats,

  // Leave Management
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  deleteLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getLeaveStats,

  // Approvals
  getApprovals,
  approveRequest,
  rejectRequest,
  getApprovalStats,

  // Academic
  getSemesters,
  getAcademicEvents,
  createAcademicEvent,
  updateAcademicEvent,
  deleteAcademicEvent,
  getAcademicStats,

  // Fees
  getFeeStats,

  // Notices
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticePin,

  // Subjects
  getSubjects,
  getSubjectStats,

  // Performance
  getPerformanceMetrics,
};

export default principalService;
