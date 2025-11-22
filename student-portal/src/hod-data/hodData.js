export const hodData = {
  profile: {
    name: 'Dr. Rajesh Kumar',
    designation: 'Head of Department',
    department: 'Computer Science & Engineering',
    employeeId: 'CSE-HOD-001',
    email: 'rajesh.kumar@college.edu',
    phone: '+91 98765 43210',
    joinDate: '2018-06-15',
    qualification: 'Ph.D. in Computer Science',
    experience: '15 years',
    officeRoom: 'Admin Block - Room 305',
    avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=059669&color=fff&size=200'
  },

  departmentStats: {
    totalFaculty: 18,
    presentToday: 16,
    totalStudents: 540,
    sectionsCount: 9,
    pendingApprovals: 12,
    leaveRequests: 7,
    gatePasses: 5,
    departmentRating: 4.5
  },

  facultyList: [
    {
      id: 'CSE-F-001',
      name: 'Dr. Priya Sharma',
      designation: 'Professor',
      subjects: ['Data Structures', 'Algorithms'],
      classes: ['CSE-2A', 'CSE-2B'],
      workload: 18,
      experience: '12 years',
      qualification: 'Ph.D.',
      email: 'priya.sharma@college.edu',
      phone: '+91 98765 11111',
      joiningDate: '2019-07-01',
      status: 'present'
    },
    {
      id: 'CSE-F-002',
      name: 'Prof. Amit Verma',
      designation: 'Associate Professor',
      subjects: ['Database Management', 'SQL'],
      classes: ['CSE-3A', 'CSE-3B'],
      workload: 16,
      experience: '10 years',
      qualification: 'M.Tech',
      email: 'amit.verma@college.edu',
      phone: '+91 98765 22222',
      joiningDate: '2020-08-15',
      status: 'present'
    },
    {
      id: 'CSE-F-003',
      name: 'Dr. Sneha Patel',
      designation: 'Assistant Professor',
      subjects: ['Operating Systems', 'Linux'],
      classes: ['CSE-3A', 'CSE-4A'],
      workload: 14,
      experience: '8 years',
      qualification: 'Ph.D.',
      email: 'sneha.patel@college.edu',
      phone: '+91 98765 33333',
      joiningDate: '2021-01-10',
      status: 'on-leave'
    },
    {
      id: 'CSE-F-004',
      name: 'Prof. Rahul Gupta',
      designation: 'Assistant Professor',
      subjects: ['Computer Networks', 'Network Security'],
      classes: ['CSE-4A', 'CSE-4B'],
      workload: 15,
      experience: '7 years',
      qualification: 'M.Tech',
      email: 'rahul.gupta@college.edu',
      phone: '+91 98765 44444',
      joiningDate: '2021-06-01',
      status: 'present'
    },
    {
      id: 'CSE-F-005',
      name: 'Dr. Kavita Singh',
      designation: 'Professor',
      subjects: ['Artificial Intelligence', 'Machine Learning'],
      classes: ['CSE-4A', 'CSE-4B'],
      workload: 17,
      experience: '14 years',
      qualification: 'Ph.D.',
      email: 'kavita.singh@college.edu',
      phone: '+91 98765 55555',
      joiningDate: '2019-03-20',
      status: 'present'
    },
    {
      id: 'CSE-F-006',
      name: 'Prof. Suresh Reddy',
      designation: 'Assistant Professor',
      subjects: ['Web Technologies', 'JavaScript'],
      classes: ['CSE-2A', 'CSE-3A'],
      workload: 16,
      experience: '6 years',
      qualification: 'M.Tech',
      email: 'suresh.reddy@college.edu',
      phone: '+91 98765 66666',
      joiningDate: '2022-07-15',
      status: 'present'
    }
  ],

  leaveRequests: [
    {
      id: 'LR-001',
      facultyId: 'CSE-F-003',
      facultyName: 'Dr. Sneha Patel',
      leaveType: 'Medical Leave',
      fromDate: '2024-11-20',
      toDate: '2024-11-22',
      days: 3,
      reason: 'Medical treatment for back pain',
      substituteArranged: 'Prof. Rahul Gupta',
      appliedDate: '2024-11-15',
      status: 'pending',
      documents: true
    },
    {
      id: 'LR-002',
      facultyId: 'CSE-F-002',
      facultyName: 'Prof. Amit Verma',
      leaveType: 'Casual Leave',
      fromDate: '2024-11-25',
      toDate: '2024-11-26',
      days: 2,
      reason: 'Family function to attend',
      substituteArranged: 'Dr. Priya Sharma',
      appliedDate: '2024-11-18',
      status: 'pending',
      documents: false
    },
    {
      id: 'LR-003',
      facultyId: 'CSE-F-006',
      facultyName: 'Prof. Suresh Reddy',
      leaveType: 'Conference Leave',
      fromDate: '2024-12-01',
      toDate: '2024-12-03',
      days: 3,
      reason: 'Attending International Conference on AI',
      substituteArranged: 'Dr. Kavita Singh',
      appliedDate: '2024-11-16',
      status: 'pending',
      documents: true
    }
  ],

  gatePassRequests: [
    {
      id: 'GP-001',
      studentId: 'CSE-2024-001',
      studentName: 'Arjun Mehta',
      class: 'CSE-3A',
      rollNo: '21CSE001',
      reason: 'Medical appointment',
      date: '2024-11-20',
      time: '14:00',
      returnTime: '17:00',
      contactNumber: '+91 98765 77777',
      parentContact: '+91 98765 88888',
      attendancePercentage: 92,
      appliedDate: '2024-11-19',
      status: 'pending'
    },
    {
      id: 'GP-002',
      studentId: 'CSE-2024-045',
      studentName: 'Priya Desai',
      class: 'CSE-2A',
      rollNo: '22CSE045',
      reason: 'Family emergency',
      date: '2024-11-21',
      time: '10:00',
      returnTime: '16:00',
      contactNumber: '+91 98765 99999',
      parentContact: '+91 98765 00000',
      attendancePercentage: 88,
      appliedDate: '2024-11-20',
      status: 'pending'
    },
    {
      id: 'GP-003',
      studentId: 'CSE-2024-089',
      studentName: 'Rohan Kumar',
      class: 'CSE-4A',
      rollNo: '20CSE089',
      reason: 'Job interview',
      date: '2024-11-22',
      time: '09:00',
      returnTime: '13:00',
      contactNumber: '+91 98765 11112',
      parentContact: '+91 98765 22223',
      attendancePercentage: 95,
      appliedDate: '2024-11-19',
      status: 'pending'
    }
  ],

  performanceData: {
    classWise: [
      {
        class: 'CSE-2A',
        students: 60,
        avgPercentage: 78.5,
        toppers: 8,
        needsAttention: 5,
        attendance: 85
      },
      {
        class: 'CSE-2B',
        students: 60,
        avgPercentage: 75.2,
        toppers: 6,
        needsAttention: 7,
        attendance: 82
      },
      {
        class: 'CSE-3A',
        students: 60,
        avgPercentage: 82.1,
        toppers: 10,
        needsAttention: 3,
        attendance: 88
      },
      {
        class: 'CSE-3B',
        students: 60,
        avgPercentage: 80.5,
        toppers: 9,
        needsAttention: 4,
        attendance: 86
      },
      {
        class: 'CSE-4A',
        students: 60,
        avgPercentage: 84.3,
        toppers: 12,
        needsAttention: 2,
        attendance: 90
      },
      {
        class: 'CSE-4B',
        students: 60,
        avgPercentage: 81.7,
        toppers: 11,
        needsAttention: 3,
        attendance: 89
      }
    ],

    subjectWise: [
      {
        subject: 'Data Structures',
        avgMarks: 76,
        passPercentage: 92,
        topScore: 98,
        faculty: 'Dr. Priya Sharma'
      },
      {
        subject: 'Database Management',
        avgMarks: 80,
        passPercentage: 95,
        topScore: 99,
        faculty: 'Prof. Amit Verma'
      },
      {
        subject: 'Operating Systems',
        avgMarks: 78,
        passPercentage: 90,
        topScore: 97,
        faculty: 'Dr. Sneha Patel'
      },
      {
        subject: 'Computer Networks',
        avgMarks: 82,
        passPercentage: 94,
        topScore: 98,
        faculty: 'Prof. Rahul Gupta'
      },
      {
        subject: 'Artificial Intelligence',
        avgMarks: 85,
        passPercentage: 96,
        topScore: 100,
        faculty: 'Dr. Kavita Singh'
      }
    ]
  },

  resources: {
    laboratories: [
      {
        id: 'LAB-001',
        name: 'Computer Lab 1',
        capacity: 60,
        systems: 58,
        functional: 56,
        software: ['VS Code', 'Python', 'Java', 'MySQL'],
        status: 'good'
      },
      {
        id: 'LAB-002',
        name: 'Computer Lab 2',
        capacity: 60,
        systems: 60,
        functional: 59,
        software: ['Eclipse', 'Android Studio', 'Git', 'Node.js'],
        status: 'good'
      },
      {
        id: 'LAB-003',
        name: 'AI & ML Lab',
        capacity: 40,
        systems: 40,
        functional: 38,
        software: ['TensorFlow', 'PyTorch', 'Jupyter', 'R Studio'],
        status: 'excellent'
      },
      {
        id: 'LAB-004',
        name: 'Network Lab',
        capacity: 30,
        systems: 28,
        functional: 25,
        software: ['Cisco Packet Tracer', 'Wireshark', 'GNS3'],
        status: 'needs-attention'
      }
    ],

    equipment: [
      {
        name: 'Projectors',
        total: 12,
        working: 11,
        underMaintenance: 1
      },
      {
        name: 'Laptops',
        total: 8,
        working: 7,
        underMaintenance: 1
      },
      {
        name: 'Servers',
        total: 4,
        working: 4,
        underMaintenance: 0
      },
      {
        name: 'Routers',
        total: 15,
        working: 13,
        underMaintenance: 2
      }
    ],

    budgetAllocation: {
      total: 5000000,
      utilized: 3200000,
      pending: 1800000,
      categories: [
        { name: 'Equipment Purchase', allocated: 2000000, spent: 1500000 },
        { name: 'Software Licenses', allocated: 1000000, spent: 800000 },
        { name: 'Maintenance', allocated: 800000, spent: 500000 },
        { name: 'Lab Upgrades', allocated: 1200000, spent: 400000 }
      ]
    }
  },

  timetableData: {
    classes: ['CSE-2A', 'CSE-2B', 'CSE-3A', 'CSE-3B', 'CSE-4A', 'CSE-4B'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    periods: [
      { id: 1, time: '09:00-10:00' },
      { id: 2, time: '10:00-11:00' },
      { id: 3, time: '11:00-12:00' },
      { id: 4, time: '12:00-13:00' },
      { id: 5, time: '14:00-15:00' },
      { id: 6, time: '15:00-16:00' },
      { id: 7, time: '16:00-17:00' }
    ]
  },

  recentActivities: [
    {
      id: 1,
      type: 'leave_request',
      title: 'New leave request from Dr. Sneha Patel',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'gate_pass',
      title: 'Gate pass request from Arjun Mehta',
      time: '4 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'faculty_update',
      title: 'Prof. Amit Verma updated course materials',
      time: '1 day ago',
      priority: 'low'
    },
    {
      id: 4,
      type: 'performance',
      title: 'CSE-4A achieved 90% attendance this week',
      time: '2 days ago',
      priority: 'low'
    }
  ]
};
