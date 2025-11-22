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

// Fee Structures
export const getFeeStructures = async () => {
  const response = await apiClient.get('/fees/structures');
  return response.data;
};

export const getFeeStructure = async (id) => {
  const response = await apiClient.get(`/fees/structures/${id}`);
  return response.data;
};

export const createFeeStructure = async (feeData) => {
  const response = await apiClient.post('/fees/structures', feeData);
  return response.data;
};

export const updateFeeStructure = async (id, feeData) => {
  const response = await apiClient.put(`/fees/structures/${id}`, feeData);
  return response.data;
};

export const deleteFeeStructure = async (id) => {
  const response = await apiClient.delete(`/fees/structures/${id}`);
  return response.data;
};

// Fee Payments
export const getFeePayments = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/fees/payments?${params}`);
  return response.data;
};

export const getFeePayment = async (id) => {
  const response = await apiClient.get(`/fees/payments/${id}`);
  return response.data;
};

export const createFeePayment = async (paymentData) => {
  const response = await apiClient.post('/fees/payments', paymentData);
  return response.data;
};

export const updateFeePayment = async (id, paymentData) => {
  const response = await apiClient.put(`/fees/payments/${id}`, paymentData);
  return response.data;
};

export const deleteFeePayment = async (id) => {
  const response = await apiClient.delete(`/fees/payments/${id}`);
  return response.data;
};

export const getFeeStats = async () => {
  const response = await apiClient.get('/fees/stats');
  return response.data;
};

// Hostel Blocks
export const getHostelBlocks = async () => {
  const response = await apiClient.get('/hostels/blocks');
  return response.data;
};

export const getHostelBlock = async (id) => {
  const response = await apiClient.get(`/hostels/blocks/${id}`);
  return response.data;
};

export const createHostelBlock = async (blockData) => {
  const response = await apiClient.post('/hostels/blocks', blockData);
  return response.data;
};

export const updateHostelBlock = async (id, blockData) => {
  const response = await apiClient.put(`/hostels/blocks/${id}`, blockData);
  return response.data;
};

export const deleteHostelBlock = async (id) => {
  const response = await apiClient.delete(`/hostels/blocks/${id}`);
  return response.data;
};

// Rooms
export const getRooms = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/hostels/rooms?${params}`);
  return response.data;
};

export const getRoom = async (id) => {
  const response = await apiClient.get(`/hostels/rooms/${id}`);
  return response.data;
};

export const createRoom = async (roomData) => {
  const response = await apiClient.post('/hostels/rooms', roomData);
  return response.data;
};

export const updateRoom = async (id, roomData) => {
  const response = await apiClient.put(`/hostels/rooms/${id}`, roomData);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await apiClient.delete(`/hostels/rooms/${id}`);
  return response.data;
};

// Room Allocations
export const getRoomAllocations = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/hostels/allocations?${params}`);
  return response.data;
};

export const createRoomAllocation = async (allocationData) => {
  const response = await apiClient.post('/hostels/allocations', allocationData);
  return response.data;
};

export const updateRoomAllocation = async (id, allocationData) => {
  const response = await apiClient.put(`/hostels/allocations/${id}`, allocationData);
  return response.data;
};

export const deleteRoomAllocation = async (id) => {
  const response = await apiClient.delete(`/hostels/allocations/${id}`);
  return response.data;
};

export const getHostelStats = async () => {
  const response = await apiClient.get('/hostels/stats');
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

  // Fees
  getFeeStructures,
  getFeeStructure,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeePayments,
  getFeePayment,
  createFeePayment,
  updateFeePayment,
  deleteFeePayment,
  getFeeStats,

  // Hostels
  getHostelBlocks,
  getHostelBlock,
  createHostelBlock,
  updateHostelBlock,
  deleteHostelBlock,
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomAllocations,
  createRoomAllocation,
  updateRoomAllocation,
  deleteRoomAllocation,
  getHostelStats,
};

export default adminService;
