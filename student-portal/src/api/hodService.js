import apiClient from './client';

// ============= DASHBOARD =============
export const getHoDDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/hod');
  return response.data;
};

export const getDepartmentStats = async (departmentId) => {
  const response = await apiClient.get(`/departments/${departmentId}/stats`);
  return response.data;
};

// ============= FACULTY MANAGEMENT =============
export const getFaculty = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/users?role=faculty&${params}`);
  return response.data;
};

export const getFacultyById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createFaculty = async (facultyData) => {
  const response = await apiClient.post('/users', { ...facultyData, role: 'faculty' });
  return response.data;
};

export const updateFaculty = async (id, facultyData) => {
  const response = await apiClient.put(`/users/${id}`, facultyData);
  return response.data;
};

export const deleteFaculty = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const getFacultyStats = async (departmentId) => {
  const response = await apiClient.get(`/users/stats?department=${departmentId}&role=faculty`);
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

export const approveLeave = async (id, remarks = '') => {
  const response = await apiClient.put(`/leaves/${id}/approve`, { remarks });
  return response.data;
};

export const rejectLeave = async (id, reason) => {
  const response = await apiClient.put(`/leaves/${id}/reject`, { reason });
  return response.data;
};

export const getLeaveStats = async (departmentId) => {
  const response = await apiClient.get(`/leaves/stats?department=${departmentId}`);
  return response.data;
};

// ============= GATE PASS APPROVAL =============
export const getGatePasses = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/gate-passes?${params}`);
  return response.data;
};

export const getGatePass = async (id) => {
  const response = await apiClient.get(`/gate-passes/${id}`);
  return response.data;
};

export const approveGatePass = async (id, remarks = '') => {
  const response = await apiClient.put(`/gate-passes/${id}/approve`, { remarks });
  return response.data;
};

export const rejectGatePass = async (id, reason) => {
  const response = await apiClient.put(`/gate-passes/${id}/reject`, { reason });
  return response.data;
};

export const getGatePassStats = async (departmentId) => {
  const response = await apiClient.get(`/gate-passes/stats?department=${departmentId}`);
  return response.data;
};

// ============= STUDENTS =============
export const getStudents = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/users?role=student&${params}`);
  return response.data;
};

export const getStudent = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const getStudentStats = async (departmentId) => {
  const response = await apiClient.get(`/users/stats?department=${departmentId}&role=student`);
  return response.data;
};

// ============= PERFORMANCE MONITORING =============
export const getPerformanceMetrics = async (departmentId, filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/performance/department/${departmentId}?${params}`);
  return response.data;
};

export const getFacultyPerformance = async (departmentId) => {
  const response = await apiClient.get(`/performance/faculty?department=${departmentId}`);
  return response.data;
};

export const getStudentPerformance = async (departmentId, filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/performance/students?department=${departmentId}&${params}`);
  return response.data;
};

// ============= ACHIEVEMENTS =============
export const getAchievements = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/achievements?${params}`);
  return response.data;
};

export const createAchievement = async (achievementData) => {
  const response = await apiClient.post('/achievements', achievementData);
  return response.data;
};

export const updateAchievement = async (id, achievementData) => {
  const response = await apiClient.put(`/achievements/${id}`, achievementData);
  return response.data;
};

export const deleteAchievement = async (id) => {
  const response = await apiClient.delete(`/achievements/${id}`);
  return response.data;
};

export const getAchievementStats = async (departmentId) => {
  const response = await apiClient.get(`/achievements/stats?department=${departmentId}`);
  return response.data;
};

// ============= RESOURCES =============
export const getResources = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/resources?${params}`);
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await apiClient.post('/resources', resourceData);
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await apiClient.put(`/resources/${id}`, resourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await apiClient.delete(`/resources/${id}`);
  return response.data;
};

export const getResourceStats = async (departmentId) => {
  const response = await apiClient.get(`/resources/stats?department=${departmentId}`);
  return response.data;
};

// ============= ACTIVITIES =============
export const getRecentActivities = async (departmentId, limit = 10) => {
  const response = await apiClient.get(`/activities/recent?department=${departmentId}&limit=${limit}`);
  return response.data;
};

// ============= EXPORT SERVICE OBJECT =============
const hodService = {
  // Dashboard
  getHoDDashboardStats,
  getDepartmentStats,

  // Faculty
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyStats,

  // Leaves
  getLeaves,
  getLeave,
  createLeave,
  approveLeave,
  rejectLeave,
  getLeaveStats,

  // Gate Passes
  getGatePasses,
  getGatePass,
  approveGatePass,
  rejectGatePass,
  getGatePassStats,

  // Students
  getStudents,
  getStudent,
  getStudentStats,

  // Performance
  getPerformanceMetrics,
  getFacultyPerformance,
  getStudentPerformance,

  // Achievements
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getAchievementStats,

  // Resources
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getResourceStats,

  // Activities
  getRecentActivities,
};

export default hodService;
