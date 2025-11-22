import apiClient from './client';

// Dashboard
export const getDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/admin');
  return response.data;
};

// Users
export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/users?${params}`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const resetUserPassword = async (id, passwordData) => {
  const response = await apiClient.put(`/users/${id}/reset-password`, passwordData);
  return response.data;
};

export const getUserStats = async () => {
  const response = await apiClient.get('/users/stats');
  return response.data;
};

// Departments
export const getDepartments = async () => {
  const response = await apiClient.get('/departments');
  return response.data;
};

export const getDepartment = async (id) => {
  const response = await apiClient.get(`/departments/${id}`);
  return response.data;
};

export const createDepartment = async (deptData) => {
  const response = await apiClient.post('/departments', deptData);
  return response.data;
};

export const updateDepartment = async (id, deptData) => {
  const response = await apiClient.put(`/departments/${id}`, deptData);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await apiClient.delete(`/departments/${id}`);
  return response.data;
};

export const getDepartmentStats = async () => {
  const response = await apiClient.get('/departments/stats');
  return response.data;
};

// Subjects
export const getSubjects = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/subjects?${params}`);
  return response.data;
};

export const getSubject = async (id) => {
  const response = await apiClient.get(`/subjects/${id}`);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await apiClient.post('/subjects', subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await apiClient.put(`/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await apiClient.delete(`/subjects/${id}`);
  return response.data;
};

export const getSubjectStats = async () => {
  const response = await apiClient.get('/subjects/stats');
  return response.data;
};

// Notices
export const getNotices = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/notices?${params}`);
  return response.data;
};

export const getNotice = async (id) => {
  const response = await apiClient.get(`/notices/${id}`);
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

export const getNoticeStats = async () => {
  const response = await apiClient.get('/notices/stats');
  return response.data;
};

// Approvals
export const getApprovals = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/approvals?${params}`);
  return response.data;
};

export const getApproval = async (id) => {
  const response = await apiClient.get(`/approvals/${id}`);
  return response.data;
};

export const createApproval = async (approvalData) => {
  const response = await apiClient.post('/approvals', approvalData);
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

export const adminService = {
  // Dashboard
  getDashboardStats,

  // Users
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getUserStats,

  // Departments
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,

  // Subjects
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStats,

  // Notices
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticePin,
  getNoticeStats,

  // Approvals
  getApprovals,
  getApproval,
  createApproval,
  approveRequest,
  rejectRequest,
  getApprovalStats,
};

export default adminService;
