import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, GraduationCap, TrendingUp, UserPlus, X, Plus,
  Mail, Phone, Calendar, Briefcase, MapPin, Award, FileText, Clock, Edit, Trash2
} from 'lucide-react';
import { principalData } from '../principal-data/principalData';

function DepartmentManagement() {
  const [showAddHoDModal, setShowAddHoDModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [hodData, setHodData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    designation: 'Head of Department',
    joinDate: '',
    experience: '',
    specialization: '',
    qualifications: [{ degree: '', institution: '', year: '' }],
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyRelation: '',
    aadharNumber: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    officeHours: [{ day: '', startTime: '', endTime: '' }]
  });

  const [deptData, setDeptData] = useState({
    name: '',
    code: '',
    established: '',
    accreditation: '',
    programs: ''
  });

  const handleAddHoD = (department = null) => {
    setSelectedDepartment(department);
    setIsEditMode(false);
    setShowAddHoDModal(true);
  };

  const handleEditHoD = (department) => {
    setSelectedDepartment(department);
    setIsEditMode(true);
    // Pre-fill with existing HOD data if needed
    setShowAddHoDModal(true);
  };

  const handleSubmitHoD = (e) => {
    e.preventDefault();
    const action = isEditMode ? 'updated' : 'assigned';
    const deptName = selectedDepartment ? selectedDepartment.name : 'department';
    alert(`HOD ${hodData.name} ${action} for ${deptName} successfully!`);
    setShowAddHoDModal(false);
    resetHoDData();
  };

  const handleSubmitDept = (e) => {
    e.preventDefault();
    alert(`Department ${deptData.name} added successfully!`);
    setShowAddDeptModal(false);
    setDeptData({
      name: '',
      code: '',
      established: '',
      accreditation: '',
      programs: ''
    });
  };

  const resetHoDData = () => {
    setHodData({
      name: '',
      employeeId: '',
      email: '',
      phone: '',
      designation: 'Head of Department',
      joinDate: '',
      experience: '',
      specialization: '',
      qualifications: [{ degree: '', institution: '', year: '' }],
      address: '',
      city: '',
      state: '',
      pincode: '',
      emergencyContact: '',
      emergencyRelation: '',
      aadharNumber: '',
      panNumber: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      officeHours: [{ day: '', startTime: '', endTime: '' }]
    });
  };

  const addQualification = () => {
    setHodData({
      ...hodData,
      qualifications: [...hodData.qualifications, { degree: '', institution: '', year: '' }]
    });
  };

  const removeQualification = (index) => {
    setHodData({
      ...hodData,
      qualifications: hodData.qualifications.filter((_, i) => i !== index)
    });
  };

  const updateQualification = (index, field, value) => {
    const updated = [...hodData.qualifications];
    updated[index][field] = value;
    setHodData({ ...hodData, qualifications: updated });
  };

  const addOfficeHour = () => {
    setHodData({
      ...hodData,
      officeHours: [...hodData.officeHours, { day: '', startTime: '', endTime: '' }]
    });
  };

  const removeOfficeHour = (index) => {
    setHodData({
      ...hodData,
      officeHours: hodData.officeHours.filter((_, i) => i !== index)
    });
  };

  const updateOfficeHour = (index, field, value) => {
    const updated = [...hodData.officeHours];
    updated[index][field] = value;
    setHodData({ ...hodData, officeHours: updated });
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBarColor = (score) => {
    if (score >= 90) return 'from-green-600 to-emerald-600';
    if (score >= 80) return 'from-blue-600 to-cyan-600';
    if (score >= 70) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage departments, assign and edit HODs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddDeptModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Add Department
          </button>
          <button
            onClick={() => handleAddHoD(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <UserPlus size={20} />
            Add HOD
          </button>
        </div>
      </motion.div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-purple-100 text-sm">Total Departments</p>
          <p className="text-4xl font-bold mt-2">{principalData.institutionStats.totalDepartments}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-blue-100 text-sm">Total Faculty</p>
          <p className="text-4xl font-bold mt-2">{principalData.institutionStats.totalFaculty}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-green-100 text-sm">Total Students</p>
          <p className="text-4xl font-bold mt-2">{principalData.institutionStats.totalStudents}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-orange-100 text-sm">Vacant HOD Positions</p>
          <p className="text-4xl font-bold mt-2">{principalData.departments.filter(d => d.status === 'vacant').length}</p>
        </motion.div>
      </div>

      {/* Departments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Building2 className="mr-2 text-purple-600" size={24} />
            Departments Overview
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {principalData.departments.map((department, index) => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900">{department.name}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                      {department.code}
                    </span>
                    {department.status === 'vacant' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full border border-red-200">
                        HOD Vacant
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="text-gray-600">
                      <Users size={16} className="inline mr-2 text-purple-600" />
                      <strong>HOD:</strong> {department.hod || 'Not Assigned'}
                    </div>
                    <div className="text-gray-600">
                      <Users size={16} className="inline mr-2 text-blue-600" />
                      <strong>Faculty:</strong> {department.facultyCount}
                    </div>
                    <div className="text-gray-600">
                      <GraduationCap size={16} className="inline mr-2 text-green-600" />
                      <strong>Students:</strong> {department.studentCount}
                    </div>
                    <div className={`font-semibold ${getPerformanceColor(department.performanceScore)}`}>
                      <TrendingUp size={16} className="inline mr-2" />
                      Performance: {department.performanceScore}%
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Department Performance</span>
                      <span>{department.performanceScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${getPerformanceBarColor(department.performanceScore)} h-2 rounded-full transition-all`}
                        style={{ width: `${department.performanceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  {department.status === 'vacant' ? (
                    <button
                      onClick={() => handleAddHoD(department)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:shadow-lg transition-all"
                    >
                      <UserPlus size={18} />
                      Assign HOD
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditHoD(department)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm rounded-lg hover:shadow-lg transition-all"
                    >
                      <Edit size={18} />
                      Edit HOD
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add/Edit HOD Modal */}
      <AnimatePresence>
        {showAddHoDModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddHoDModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-8"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center sticky top-0 rounded-t-2xl">
                  <div>
                    <h2 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'Add'} Head of Department</h2>
                    <p className="text-purple-100 text-sm mt-1">
                      {selectedDepartment ? selectedDepartment.name : 'Select department during assignment'}
                    </p>
                  </div>
                  <button onClick={() => setShowAddHoDModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitHoD} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Department Selection - Only show if no department selected */}
                  {!selectedDepartment && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Building2 className="mr-2 text-blue-600" size={20} />
                        Select Department
                      </h3>
                      <select
                        required
                        onChange={(e) => {
                          const dept = principalData.departments.find(d => d.id === parseInt(e.target.value));
                          setSelectedDepartment(dept);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Choose a department...</option>
                        {principalData.departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <UserPlus className="mr-2 text-purple-600" size={20} />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={hodData.name}
                          onChange={(e) => setHodData({ ...hodData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
                        <input
                          type="text"
                          value={hodData.employeeId}
                          onChange={(e) => setHodData({ ...hodData, employeeId: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={hodData.email}
                          onChange={(e) => setHodData({ ...hodData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                        <input
                          type="tel"
                          value={hodData.phone}
                          onChange={(e) => setHodData({ ...hodData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="mr-2 text-blue-600" size={20} />
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining *</label>
                        <input
                          type="date"
                          value={hodData.joinDate}
                          onChange={(e) => setHodData({ ...hodData, joinDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Experience *</label>
                        <input
                          type="text"
                          value={hodData.experience}
                          onChange={(e) => setHodData({ ...hodData, experience: e.target.value })}
                          placeholder="e.g., 15 Years"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                        <input
                          type="text"
                          value={hodData.specialization}
                          onChange={(e) => setHodData({ ...hodData, specialization: e.target.value })}
                          placeholder="e.g., Data Science & Machine Learning"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Educational Qualifications */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Award className="mr-2 text-green-600" size={20} />
                      Educational Qualifications
                    </h3>
                    <div className="space-y-4">
                      {hodData.qualifications.map((qual, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-green-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                            <input
                              type="text"
                              value={qual.degree}
                              onChange={(e) => updateQualification(index, 'degree', e.target.value)}
                              placeholder="e.g., Ph.D. in Computer Science"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                            <input
                              type="text"
                              value={qual.institution}
                              onChange={(e) => updateQualification(index, 'institution', e.target.value)}
                              placeholder="e.g., IIT Delhi"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                              <input
                                type="text"
                                value={qual.year}
                                onChange={(e) => updateQualification(index, 'year', e.target.value)}
                                placeholder="e.g., 2012-2016"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                              />
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeQualification(index)}
                                className="mt-8 p-3 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <X size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addQualification}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Plus size={18} />
                        Add Qualification
                      </button>
                    </div>
                  </div>

                  {/* Contact & Address */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <MapPin className="mr-2 text-orange-600" size={20} />
                      Contact & Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                        <input
                          type="text"
                          value={hodData.address}
                          onChange={(e) => setHodData({ ...hodData, address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={hodData.city}
                          onChange={(e) => setHodData({ ...hodData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          value={hodData.state}
                          onChange={(e) => setHodData({ ...hodData, state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                        <input
                          type="text"
                          value={hodData.pincode}
                          onChange={(e) => setHodData({ ...hodData, pincode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact *</label>
                        <input
                          type="tel"
                          value={hodData.emergencyContact}
                          onChange={(e) => setHodData({ ...hodData, emergencyContact: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relation *</label>
                        <input
                          type="text"
                          value={hodData.emergencyRelation}
                          onChange={(e) => setHodData({ ...hodData, emergencyRelation: e.target.value })}
                          placeholder="e.g., Spouse, Parent"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank & ID Details */}
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="mr-2 text-indigo-600" size={20} />
                      Bank & ID Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
                        <input
                          type="text"
                          value={hodData.aadharNumber}
                          onChange={(e) => setHodData({ ...hodData, aadharNumber: e.target.value })}
                          placeholder="XXXX-XXXX-XXXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                        <input
                          type="text"
                          value={hodData.panNumber}
                          onChange={(e) => setHodData({ ...hodData, panNumber: e.target.value })}
                          placeholder="ABCDE1234F"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                        <input
                          type="text"
                          value={hodData.bankName}
                          onChange={(e) => setHodData({ ...hodData, bankName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                        <input
                          type="text"
                          value={hodData.accountNumber}
                          onChange={(e) => setHodData({ ...hodData, accountNumber: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                        <input
                          type="text"
                          value={hodData.ifscCode}
                          onChange={(e) => setHodData({ ...hodData, ifscCode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Clock className="mr-2 text-pink-600" size={20} />
                      Office Hours
                    </h3>
                    <div className="space-y-4">
                      {hodData.officeHours.map((hour, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-pink-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Day *</label>
                            <select
                              value={hour.day}
                              onChange={(e) => updateOfficeHour(index, 'day', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            >
                              <option value="">Select Day</option>
                              <option value="Monday-Friday">Monday-Friday</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                            <input
                              type="time"
                              value={hour.startTime}
                              onChange={(e) => updateOfficeHour(index, 'startTime', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                              <input
                                type="time"
                                value={hour.endTime}
                                onChange={(e) => updateOfficeHour(index, 'endTime', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                              />
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeOfficeHour(index)}
                                className="mt-8 p-3 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <X size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addOfficeHour}
                        className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors"
                      >
                        <Plus size={18} />
                        Add Office Hour
                      </button>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddHoDModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      {isEditMode ? 'Update HOD' : 'Assign HOD'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddDeptModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDeptModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                  <div>
                    <h2 className="text-2xl font-bold">Add New Department</h2>
                    <p className="text-blue-100 text-sm mt-1">Create a new department in the institution</p>
                  </div>
                  <button onClick={() => setShowAddDeptModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitDept} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
                    <input
                      type="text"
                      value={deptData.name}
                      onChange={(e) => setDeptData({ ...deptData, name: e.target.value })}
                      placeholder="e.g., Computer Science & Engineering"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Code *</label>
                    <input
                      type="text"
                      value={deptData.code}
                      onChange={(e) => setDeptData({ ...deptData, code: e.target.value })}
                      placeholder="e.g., CSE"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Established *</label>
                    <input
                      type="text"
                      value={deptData.established}
                      onChange={(e) => setDeptData({ ...deptData, established: e.target.value })}
                      placeholder="e.g., 2005"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accreditation</label>
                    <input
                      type="text"
                      value={deptData.accreditation}
                      onChange={(e) => setDeptData({ ...deptData, accreditation: e.target.value })}
                      placeholder="e.g., NBA Accredited"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Programs Offered *</label>
                    <textarea
                      value={deptData.programs}
                      onChange={(e) => setDeptData({ ...deptData, programs: e.target.value })}
                      placeholder="e.g., B.Tech CSE, M.Tech CSE, Ph.D."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddDeptModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      Add Department
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DepartmentManagement;
