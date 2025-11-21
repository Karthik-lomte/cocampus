export const clubData = {
  clubInfo: {
    name: 'Technical Club',
    id: 'TC001',
    establishedYear: 2015,
    facultyAdvisor: 'Dr. Rajesh Kumar',
    president: 'Arun Kumar',
    vicePresident: 'Priya Sharma',
    totalMembers: 45,
    activeEvents: 3,
    budget: 150000
  },

  clubDepartments: [
    { id: 1, name: 'Technical', head: 'Arun Kumar', members: 15 },
    { id: 2, name: 'Marketing', head: 'Priya Sharma', members: 10 },
    { id: 3, name: 'Design', head: 'Rahul Verma', members: 8 },
    { id: 4, name: 'Content', head: 'Sneha Reddy', members: 7 },
    { id: 5, name: 'Finance', head: 'Vikram Singh', members: 5 }
  ],

  clubMembers: [
    {
      id: 1,
      name: 'Arun Kumar',
      rollNumber: 'CSE2021001',
      department: 'Technical',
      role: 'President',
      year: '3rd Year',
      email: 'arun@college.edu',
      phone: '+91 9876543210',
      joiningDate: '2023-08-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rollNumber: 'CSE2021002',
      department: 'Marketing',
      role: 'Vice President',
      year: '3rd Year',
      email: 'priya@college.edu',
      phone: '+91 9876543211',
      joiningDate: '2023-08-15',
      status: 'active'
    },
    {
      id: 3,
      name: 'Rahul Verma',
      rollNumber: 'CSE2022015',
      department: 'Design',
      role: 'Department Head',
      year: '2nd Year',
      email: 'rahul@college.edu',
      phone: '+91 9876543212',
      joiningDate: '2024-01-10',
      status: 'active'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      rollNumber: 'ECE2021008',
      department: 'Content',
      role: 'Department Head',
      year: '3rd Year',
      email: 'sneha@college.edu',
      phone: '+91 9876543213',
      joiningDate: '2023-09-01',
      status: 'active'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      rollNumber: 'CSE2021010',
      department: 'Finance',
      role: 'Department Head',
      year: '3rd Year',
      email: 'vikram@college.edu',
      phone: '+91 9876543214',
      joiningDate: '2023-08-20',
      status: 'active'
    }
  ],

  eventRequests: [
    {
      id: 1,
      status: 'approved',
      academicYear: '2024-2025',
      quarter: 'Q2',
      programType: 'Workshop',
      programTheme: 'Technical Skills',
      activityName: 'Web Development Bootcamp',
      drivenBy: 'Self-Driven Activity',
      duration: '16',
      startDate: '2024-12-15',
      endDate: '2024-12-17',
      studentParticipants: '45',
      facultyParticipants: '3',
      externalParticipants: '2',
      expenditure: '15000',
      remark: 'Industry expert invited for guest session',
      modeOfDelivery: 'Hybrid',
      activityLedBy: 'Student Committee',
      objective: 'To enhance web development skills among students and provide hands-on experience with modern frameworks',
      benefit: 'Students will gain practical knowledge of React, Node.js, and deployment strategies for real-world applications',
      videoUrl: 'https://youtube.com/sample',
      photograph1: 'event-poster-1.jpg',
      photograph2: 'event-banner-2.jpg',
      reportPdf: 'activity-report.pdf',
      additionalDoc: 'budget-breakdown.xlsx',
      submittedDate: '2024-11-10',
      approvedDate: '2024-11-15',
      registeredCount: 38
    },
    {
      id: 2,
      status: 'pending',
      academicYear: '2024-2025',
      quarter: 'Q2',
      programType: 'Seminar',
      programTheme: 'Industry Interaction',
      activityName: 'AI & Machine Learning Trends',
      drivenBy: 'Self-Driven Activity',
      duration: '4',
      startDate: '2025-01-20',
      endDate: '2025-01-20',
      studentParticipants: '100',
      facultyParticipants: '5',
      externalParticipants: '3',
      expenditure: '25000',
      remark: 'Guest speakers from top tech companies',
      modeOfDelivery: 'Offline',
      activityLedBy: 'Faculty Coordinator',
      objective: 'To provide insights into latest AI and ML trends and industry applications',
      benefit: 'Students will understand current industry trends and future scope of AI/ML technologies',
      videoUrl: '',
      photograph1: 'ai-seminar-poster.jpg',
      photograph2: 'ai-seminar-banner.jpg',
      reportPdf: '',
      additionalDoc: '',
      submittedDate: '2024-11-18',
      approvedDate: null,
      registeredCount: 0
    }
  ],

  eventParticipants: {
    1: [
      {
        id: 1,
        registrationId: 'REG001',
        registrationType: 'Single',
        fullName: 'Amit Patel',
        rollNumber: 'CSE2022020',
        department: 'CSE',
        year: '2nd Year',
        email: 'amit@college.edu',
        mobile: '+91 9876543220',
        gender: 'Male',
        accommodation: true,
        registeredDate: '2024-11-16',
        paymentStatus: 'Paid',
        amount: 500
      },
      {
        id: 2,
        registrationId: 'REG002',
        registrationType: 'Single',
        fullName: 'Neha Gupta',
        rollNumber: 'ECE2022015',
        department: 'ECE',
        year: '2nd Year',
        email: 'neha@college.edu',
        mobile: '+91 9876543221',
        gender: 'Female',
        accommodation: false,
        registeredDate: '2024-11-16',
        paymentStatus: 'Paid',
        amount: 500
      },
      {
        id: 3,
        registrationId: 'REG003',
        registrationType: 'Team',
        teamName: 'Code Warriors',
        teamCategory: 'Open',
        teamSize: '4',
        institution: 'ABC Engineering College',
        teamLeaderName: 'Rajesh Kumar',
        teamLeaderRoll: 'CSE2021025',
        teamLeaderEmail: 'rajesh@college.edu',
        teamLeaderPhone: '+91 9876543222',
        registeredDate: '2024-11-17',
        paymentStatus: 'Paid',
        amount: 2000
      }
    ]
  },

  attendanceRequests: [
    {
      id: 1,
      requestDate: '2024-11-15',
      eventName: 'Web Development Bootcamp',
      eventDate: '2024-12-15',
      selectedStudents: [
        { rollNo: 'CSE2022020', name: 'Amit Patel', department: 'CSE', year: '2nd Year' },
        { rollNo: 'ECE2022015', name: 'Neha Gupta', department: 'ECE', year: '2nd Year' },
        { rollNo: 'CSE2021025', name: 'Rajesh Kumar', department: 'CSE', year: '3rd Year' }
      ],
      totalStudents: 3,
      reason: 'Participation in Web Development Bootcamp organized by Technical Club. Students have registered and paid fees.',
      status: 'pending',
      submittedBy: 'Arun Kumar (President)',
      remarks: ''
    },
    {
      id: 2,
      requestDate: '2024-11-10',
      eventName: 'Hackathon Preparation',
      eventDate: '2024-11-25',
      selectedStudents: [
        { rollNo: 'CSE2021001', name: 'Arun Kumar', department: 'CSE', year: '3rd Year' },
        { rollNo: 'CSE2021002', name: 'Priya Sharma', department: 'CSE', year: '3rd Year' }
      ],
      totalStudents: 2,
      reason: 'Core team members need to prepare for upcoming inter-college hackathon',
      status: 'approved',
      submittedBy: 'Arun Kumar (President)',
      approvedDate: '2024-11-12',
      remarks: 'Approved for preparation'
    }
  ]
};
