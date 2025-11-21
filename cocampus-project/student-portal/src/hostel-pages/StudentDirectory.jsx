import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Phone, Mail, Home, Filter } from 'lucide-react';

function StudentDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Rahul Sharma',
      rollNo: 'CSE2022015',
      email: 'rahul.sharma@university.edu',
      phone: '+91 9876543210',
      block: 'Block A',
      roomNo: 'A-205',
      floor: '2nd Floor',
      department: 'Computer Science',
      year: '3rd Year',
      parentContact: '+91 9876543211'
    },
    {
      id: 2,
      name: 'Priya Patel',
      rollNo: 'ECE2022032',
      email: 'priya.patel@university.edu',
      phone: '+91 9876543212',
      block: 'Block B',
      roomNo: 'B-312',
      floor: '3rd Floor',
      department: 'Electronics',
      year: '3rd Year',
      parentContact: '+91 9876543213'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      rollNo: 'ME2022018',
      email: 'amit.kumar@university.edu',
      phone: '+91 9876543214',
      block: 'Block A',
      roomNo: 'A-108',
      floor: '1st Floor',
      department: 'Mechanical',
      year: '3rd Year',
      parentContact: '+91 9876543215'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      rollNo: 'CSE2022045',
      email: 'sneha.reddy@university.edu',
      phone: '+91 9876543216',
      block: 'Block C',
      roomNo: 'C-401',
      floor: '4th Floor',
      department: 'Computer Science',
      year: '3rd Year',
      parentContact: '+91 9876543217'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      rollNo: 'CIVIL2022022',
      email: 'vikram.singh@university.edu',
      phone: '+91 9876543218',
      block: 'Block D',
      roomNo: 'D-215',
      floor: '2nd Floor',
      department: 'Civil Engineering',
      year: '3rd Year',
      parentContact: '+91 9876543219'
    },
    {
      id: 6,
      name: 'Ananya Gupta',
      rollNo: 'IT2022028',
      email: 'ananya.gupta@university.edu',
      phone: '+91 9876543220',
      block: 'Block B',
      roomNo: 'B-118',
      floor: '1st Floor',
      department: 'Information Technology',
      year: '3rd Year',
      parentContact: '+91 9876543221'
    },
    {
      id: 7,
      name: 'Rohan Mehta',
      rollNo: 'EEE2022035',
      email: 'rohan.mehta@university.edu',
      phone: '+91 9876543222',
      block: 'Block A',
      roomNo: 'A-310',
      floor: '3rd Floor',
      department: 'Electrical Engineering',
      year: '3rd Year',
      parentContact: '+91 9876543223'
    },
    {
      id: 8,
      name: 'Kavitha Nair',
      rollNo: 'CSE2022052',
      email: 'kavitha.nair@university.edu',
      phone: '+91 9876543224',
      block: 'Block C',
      roomNo: 'C-205',
      floor: '2nd Floor',
      department: 'Computer Science',
      year: '3rd Year',
      parentContact: '+91 9876543225'
    }
  ];

  const blocks = ['Block A', 'Block B', 'Block C', 'Block D'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.roomNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = blockFilter === 'all' || student.block === blockFilter;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Student Directory</h1>
        <p className="text-gray-600 mt-1">View all hostel residents</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, roll number, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Blocks</option>
              {blocks.map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {blocks.map((block, index) => {
          const count = students.filter(s => s.block === block).length;
          return (
            <div key={block} className="bg-white rounded-xl shadow-md p-4 text-center">
              <p className="text-sm text-gray-600">{block}</p>
              <p className="text-2xl font-bold text-orange-600">{count}</p>
              <p className="text-xs text-gray-500">students</p>
            </div>
          );
        })}
      </motion.div>

      {/* Student List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-orange-600" size={24} />
            Students ({filteredStudents.length})
          </h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.rollNo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Home size={16} />
                      <div>
                        <div className="font-medium">{student.roomNo}</div>
                        <div className="text-sm text-gray-500">{student.block} • {student.floor}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{student.department}</div>
                    <div className="text-sm text-gray-500">{student.year}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {student.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      {student.parentContact}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.rollNo}</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {student.roomNo}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Home size={14} />
                  {student.block} • {student.floor}
                </div>
                <div className="text-gray-600">{student.department} • {student.year}</div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} />
                  {student.phone}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No students found matching your search criteria.
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default StudentDirectory;
