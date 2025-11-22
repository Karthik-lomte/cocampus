export const principalData = {
  profile: {
    name: "Dr. Ramesh Krishnan",
    designation: "Principal",
    employeeId: "PRIN2024001",
    email: "principal@cocampus.edu",
    phone: "+91 9876543210",
    institution: "Co-Campus College of Engineering",
    joinDate: "2018-07-01",
    qualification: "Ph.D. in Engineering Management",
    experience: "25+ Years",
    avatar: "https://ui-avatars.com/api/?name=Ramesh+Krishnan&size=200&background=059669&color=fff&bold=true"
  },

  institutionStats: {
    totalStudents: 2850,
    totalFaculty: 185,
    totalStaff: 95,
    totalDepartments: 8,
    passPercentage: 94.5,
    averageCGPA: 8.2,
    toppersCount: 42,
    feeCollected: 85000000,
    pendingDues: 12000000,
    budgetUtilized: 78.5
  },

  departments: [
    {
      id: 1,
      name: "Computer Science & Engineering",
      code: "CSE",
      hod: "Dr. Rajesh Kumar",
      hodId: "HOD2024001",
      facultyCount: 28,
      studentCount: 520,
      performanceScore: 92,
      status: "active"
    },
    {
      id: 2,
      name: "Electronics & Communication",
      code: "ECE",
      hod: "Dr. Priya Sharma",
      hodId: "HOD2024002",
      facultyCount: 24,
      studentCount: 480,
      performanceScore: 89,
      status: "active"
    },
    {
      id: 3,
      name: "Mechanical Engineering",
      code: "MECH",
      hod: "Dr. Suresh Iyer",
      hodId: "HOD2024003",
      facultyCount: 22,
      studentCount: 450,
      performanceScore: 87,
      status: "active"
    },
    {
      id: 4,
      name: "Civil Engineering",
      code: "CIVIL",
      hod: null,
      hodId: null,
      facultyCount: 18,
      studentCount: 380,
      performanceScore: 85,
      status: "vacant"
    }
  ],

  hodLeaveRequests: [
    {
      id: 1,
      hodName: "Dr. Rajesh Kumar",
      employeeId: "HOD2024001",
      department: "Computer Science",
      leaveType: "Casual Leave",
      startDate: "2024-04-15",
      endDate: "2024-04-17",
      days: 3,
      reason: "Personal work",
      appliedDate: "2024-04-10",
      status: "pending",
      documents: false
    },
    {
      id: 2,
      hodName: "Dr. Priya Sharma",
      employeeId: "HOD2024002",
      department: "Electronics & Communication",
      leaveType: "Medical Leave",
      startDate: "2024-04-20",
      endDate: "2024-04-22",
      days: 3,
      reason: "Health checkup",
      appliedDate: "2024-04-12",
      status: "pending",
      documents: true
    },
    {
      id: 3,
      hodName: "Dr. Suresh Iyer",
      employeeId: "HOD2024003",
      department: "Mechanical",
      leaveType: "Conference Leave",
      startDate: "2024-04-25",
      endDate: "2024-04-28",
      days: 4,
      reason: "Attending National Conference on Manufacturing Technology",
      appliedDate: "2024-04-08",
      status: "pending",
      documents: true
    }
  ],

  clubs: [
    {
      id: 1,
      name: "Technical Club",
      coordinator: "Dr. Amit Desai",
      memberCount: 85,
      activeEvents: 3,
      budgetAllocated: 150000,
      budgetUtilized: 95000
    },
    {
      id: 2,
      name: "Cultural Club",
      coordinator: "Prof. Meena Nair",
      memberCount: 120,
      activeEvents: 5,
      budgetAllocated: 200000,
      budgetUtilized: 145000
    },
    {
      id: 3,
      name: "Sports Club",
      coordinator: "Mr. Ravi Kumar",
      memberCount: 95,
      activeEvents: 2,
      budgetAllocated: 180000,
      budgetUtilized: 125000
    }
  ],

  clubAttendanceRequests: [
    {
      id: 1,
      clubName: "Technical Club",
      eventName: "Hackathon 2024",
      eventDate: "2024-04-20",
      requestedBy: "Dr. Amit Desai",
      submittedDate: "2024-04-15",
      status: "pending",
      students: [
        { rollNo: "CSE21001", name: "Aarav Sharma", department: "CSE", year: 2 },
        { rollNo: "CSE21025", name: "Priya Patel", department: "CSE", year: 2 },
        { rollNo: "CSE22010", name: "Rahul Verma", department: "CSE", year: 1 },
        { rollNo: "ECE21015", name: "Ananya Singh", department: "ECE", year: 2 },
        { rollNo: "ECE22008", name: "Vikram Reddy", department: "ECE", year: 1 }
      ]
    },
    {
      id: 2,
      clubName: "Cultural Club",
      eventName: "Annual Day Rehearsal",
      eventDate: "2024-04-18",
      requestedBy: "Prof. Meena Nair",
      submittedDate: "2024-04-14",
      status: "pending",
      students: [
        { rollNo: "MECH22012", name: "Sanjay Kumar", department: "MECH", year: 1 },
        { rollNo: "MECH21018", name: "Divya Sharma", department: "MECH", year: 2 },
        { rollNo: "CIVIL21005", name: "Rohan Gupta", department: "CIVIL", year: 2 },
        { rollNo: "CSE22020", name: "Neha Verma", department: "CSE", year: 1 },
        { rollNo: "CSE21030", name: "Arjun Patel", department: "CSE", year: 2 },
        { rollNo: "ECE22014", name: "Sneha Rao", department: "ECE", year: 1 }
      ]
    },
    {
      id: 3,
      clubName: "Sports Club",
      eventName: "Inter-College Basketball Tournament",
      eventDate: "2024-04-22",
      requestedBy: "Mr. Ravi Kumar",
      submittedDate: "2024-04-16",
      status: "pending",
      students: [
        { rollNo: "CSE22005", name: "Karthik Reddy", department: "CSE", year: 1 },
        { rollNo: "CSE21012", name: "Aditya Singh", department: "CSE", year: 2 },
        { rollNo: "MECH21022", name: "Ravi Kumar", department: "MECH", year: 2 },
        { rollNo: "MECH22008", name: "Suresh Babu", department: "MECH", year: 1 },
        { rollNo: "ECE21020", name: "Deepak Sharma", department: "ECE", year: 2 }
      ]
    }
  ],

  recentActivities: [
    {
      id: 1,
      type: "event_approval",
      title: "Technical Symposium Approved",
      description: "CSE Department Technical Symposium approved with budget allocation",
      timestamp: "2024-04-15 10:30 AM",
      department: "CSE"
    },
    {
      id: 2,
      type: "leave_approved",
      title: "Faculty Leave Approved",
      description: "Dr. Amit Desai's leave request approved for conference attendance",
      timestamp: "2024-04-14 03:45 PM",
      department: "CSE"
    },
    {
      id: 3,
      type: "hod_assigned",
      title: "New HOD Assigned",
      description: "Dr. Rajesh Kumar assigned as HOD for Computer Science Department",
      timestamp: "2024-04-13 11:20 AM",
      department: "CSE"
    }
  ],

  performanceMetrics: {
    departmentWise: [
      { department: "CSE", performance: 92, trend: "up" },
      { department: "ECE", performance: 89, trend: "up" },
      { department: "MECH", performance: 87, trend: "stable" },
      { department: "CIVIL", performance: 85, trend: "down" }
    ],
    academicResults: {
      passPercentage: 94.5,
      distinction: 38.2,
      firstClass: 45.8,
      secondClass: 10.5
    }
  }
};
