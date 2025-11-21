import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Users,
  GraduationCap,
  UserCheck
} from 'lucide-react';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'Computer Science',
      code: 'CSE',
      hod: 'Dr. Rajesh Kumar',
      hodId: 'HOD2018001',
      facultyCount: 45,
      studentCount: 850,
      performance: 88,
      yearEstablished: 1995,
      email: 'cse@university.edu',
      phone: '+91-9876543210',
      location: 'Block A, Room 101-120',
      vision: 'To be a globally recognized center of excellence in computer science education and research.',
      mission: 'To produce industry-ready professionals with strong technical foundations and ethical values.'
    },
    {
      id: 2,
      name: 'Electronics & Communication',
      code: 'ECE',
      hod: 'Dr. Priya Sharma',
      hodId: 'HOD2019002',
      facultyCount: 32,
      studentCount: 620,
      performance: 85,
      yearEstablished: 1998,
      email: 'ece@university.edu',
      phone: '+91-9876543211',
      location: 'Block B, Room 201-215',
      vision: 'To lead in electronics and communication innovations that transform society.',
      mission: 'To nurture engineers who excel in design, development, and research of electronic systems.'
    },
    {
      id: 3,
      name: 'Mechanical Engineering',
      code: 'ME',
      hod: 'Dr. Amit Singh',
      hodId: 'HOD2017003',
      facultyCount: 30,
      studentCount: 580,
      performance: 82,
      yearEstablished: 1990,
      email: 'me@university.edu',
      phone: '+91-9876543212',
      location: 'Block C, Room 301-318',
      vision: 'To be a premier institution for mechanical engineering education and sustainable innovation.',
      mission: 'To develop skilled engineers capable of solving complex mechanical challenges.'
    },
    {
      id: 4,
      name: 'Civil Engineering',
      code: 'CE',
      hod: 'Dr. Neha Gupta',
      hodId: 'HOD2020004',
      facultyCount: 25,
      studentCount: 450,
      performance: 80,
      yearEstablished: 1992,
      email: 'ce@university.edu',
      phone: '+91-9876543213',
      location: 'Block D, Room 401-412',
      vision: 'To shape the future of infrastructure through innovative civil engineering practices.',
      mission: 'To educate civil engineers who build sustainable and resilient infrastructure.'
    },
    {
      id: 5,
      name: 'Information Technology',
      code: 'IT',
      hod: 'Dr. Vikram Patel',
      hodId: 'HOD2018005',
      facultyCount: 28,
      studentCount: 520,
      performance: 86,
      yearEstablished: 2000,
      email: 'it@university.edu',
      phone: '+91-9876543214',
      location: 'Block A, Room 201-215',
      vision: 'To be at the forefront of information technology advancements and digital transformation.',
      mission: 'To produce IT professionals who drive innovation and digital solutions globally.'
    },
    {
      id: 6,
      name: 'Electrical Engineering',
      code: 'EE',
      hod: 'Dr. Sunita Devi',
      hodId: 'HOD2016006',
      facultyCount: 22,
      studentCount: 380,
      performance: 79,
      yearEstablished: 1988,
      email: 'ee@university.edu',
      phone: '+91-9876543215',
      location: 'Block E, Room 101-110',
      vision: 'To lead in electrical engineering education for a sustainable energy future.',
      mission: 'To develop electrical engineers who innovate in power systems and renewable energy.'
    },
    {
      id: 7,
      name: 'Chemical Engineering',
      code: 'CHE',
      hod: 'Dr. Rohit Verma',
      hodId: 'HOD2021007',
      facultyCount: 18,
      studentCount: 320,
      performance: 77,
      yearEstablished: 2005,
      email: 'che@university.edu',
      phone: '+91-9876543216',
      location: 'Block F, Room 101-108',
      vision: 'To excel in chemical engineering research for industrial and environmental advancement.',
      mission: 'To train chemical engineers who optimize processes and ensure environmental safety.'
    },
    {
      id: 8,
      name: 'Biotechnology',
      code: 'BT',
      hod: 'Dr. Anita Reddy',
      hodId: 'HOD2019008',
      facultyCount: 15,
      studentCount: 280,
      performance: 84,
      yearEstablished: 2008,
      email: 'bt@university.edu',
      phone: '+91-9876543217',
      location: 'Block G, Room 101-106',
      vision: 'To pioneer biotechnology solutions for healthcare and agricultural challenges.',
      mission: 'To educate biotechnologists who advance life sciences and improve human welfare.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    yearEstablished: '',
    email: '',
    phone: '',
    location: '',
    vision: '',
    mission: ''
  });

  const totalFaculty = departments.reduce((sum, dept) => sum + dept.facultyCount, 0);
  const totalStudents = departments.reduce((sum, dept) => sum + dept.studentCount, 0);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.hod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = (e) => {
    e.preventDefault();
    const newDepartment = {
      id: departments.length + 1,
      name: formData.name,
      code: formData.code,
      hod: 'To be assigned',
      hodId: '',
      facultyCount: 0,
      studentCount: 0,
      performance: 0,
      yearEstablished: parseInt(formData.yearEstablished),
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      vision: formData.vision,
      mission: formData.mission
    };
    setDepartments([...departments, newDepartment]);
    setShowAddModal(false);
    setFormData({
      name: '',
      code: '',
      yearEstablished: '',
      email: '',
      phone: '',
      location: '',
      vision: '',
      mission: ''
    });
    alert('Department added successfully!');
  };

  const handleEditDepartment = (e) => {
    e.preventDefault();
    setDepartments(departments.map(dept =>
      dept.id === selectedDepartment.id
        ? {
            ...dept,
            name: formData.name,
            code: formData.code,
            yearEstablished: parseInt(formData.yearEstablished),
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            vision: formData.vision,
            mission: formData.mission
          }
        : dept
    ));
    setShowEditModal(false);
    setSelectedDepartment(null);
    alert('Department updated successfully!');
  };

  const handleDeleteDepartment = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    if (dept.studentCount > 0 || dept.facultyCount > 0) {
      alert('Cannot delete department with active students or faculty. Please reassign them first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== deptId));
      alert('Department deleted successfully!');
    }
  };

  const openEditModal = (dept) => {
    setSelectedDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      yearEstablished: dept.yearEstablished.toString(),
      email: dept.email || '',
      phone: dept.phone || '',
      location: dept.location || '',
      vision: dept.vision || '',
      mission: dept.mission || ''
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Department Management</h1>
        <p className="text-indigo-100">Manage academic departments and their resources</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
              <p className="text-xs text-green-600 mt-1">All active</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Faculty</p>
              <p className="text-3xl font-bold text-gray-900">{totalFaculty}</p>
              <p className="text-xs text-blue-600 mt-1">Across all departments</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">Currently enrolled</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Department
        </button>
      </div>

      {/* Departments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Department</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Code</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">HOD</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Faculty</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Students</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Performance</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">Est. {dept.yearEstablished}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-mono">
                      {dept.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{dept.hod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{dept.facultyCount}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{dept.studentCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div
                          className={`h-2 rounded-full ${
                            dept.performance >= 85 ? 'bg-green-500' :
                            dept.performance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${dept.performance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{dept.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Add New Department</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Computer Science Engineering"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CSE"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Established *</label>
                  <input
                    type="number"
                    required
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    placeholder="e.g., 1995"
                    min={1900}
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., cse@university.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +91-9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Block A, Room 101-120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision *</label>
                  <textarea
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    placeholder="Enter department vision statement..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission *</label>
                  <textarea
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    placeholder="Enter department mission statement..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Department
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Department Modal */}
      <AnimatePresence>
        {showEditModal && selectedDepartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Edit Department</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditDepartment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Established *</label>
                  <input
                    type="number"
                    required
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    min={1900}
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision *</label>
                  <textarea
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission *</label>
                  <textarea
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentManagement;
