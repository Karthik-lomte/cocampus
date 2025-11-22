export const assignments = [
  {
    id: 1,
    subject: "Data Structures",
    subjectCode: "CS501",
    title: "Implement Binary Search Tree with all operations",
    description: "Create a complete BST implementation with insert, delete, search, and traversal operations. Include proper documentation and test cases.",
    dueDate: "2024-11-25T23:59:00",
    assignedDate: "2024-11-10T10:00:00",
    maxMarks: 100,
    faculty: "Dr. Ramesh Sharma",
    status: "pending", // pending, submitted, graded
    priority: "high", // high, medium, low
    allowLateSubmission: true,
    submittedFile: null,
    submittedDate: null,
    marksObtained: null,
    feedback: null,
    attachments: ["BST_Assignment_Questions.pdf"]
  },
  {
    id: 2,
    subject: "Database Management Systems",
    subjectCode: "CS502",
    title: "Design and Implementation of Library Management System",
    description: "Design a complete database schema for a library management system. Implement all required SQL queries and procedures.",
    dueDate: "2024-11-22T23:59:00",
    assignedDate: "2024-11-05T10:00:00",
    maxMarks: 100,
    faculty: "Prof. Anita Desai",
    status: "pending",
    priority: "high",
    allowLateSubmission: false,
    submittedFile: null,
    submittedDate: null,
    marksObtained: null,
    feedback: null,
    attachments: ["DBMS_Assignment_Guidelines.pdf"]
  },
  {
    id: 3,
    subject: "Operating Systems",
    subjectCode: "CS503",
    title: "CPU Scheduling Algorithms Implementation",
    description: "Implement FCFS, SJF, Priority, and Round Robin scheduling algorithms. Compare their performance with different inputs.",
    dueDate: "2024-11-28T23:59:00",
    assignedDate: "2024-11-12T10:00:00",
    maxMarks: 100,
    faculty: "Dr. Suresh Patel",
    status: "pending",
    priority: "medium",
    allowLateSubmission: true,
    submittedFile: null,
    submittedDate: null,
    marksObtained: null,
    feedback: null,
    attachments: ["OS_Assignment_Questions.pdf"]
  },
  {
    id: 4,
    subject: "Computer Networks",
    subjectCode: "CS504",
    title: "Network Protocol Analysis using Wireshark",
    description: "Capture and analyze network packets using Wireshark. Submit a detailed report on HTTP, TCP, and UDP protocols.",
    dueDate: "2024-12-05T23:59:00",
    assignedDate: "2024-11-15T10:00:00",
    maxMarks: 100,
    faculty: "Prof. Kavita Singh",
    status: "pending",
    priority: "low",
    allowLateSubmission: true,
    submittedFile: null,
    submittedDate: null,
    marksObtained: null,
    feedback: null,
    attachments: ["CN_Assignment_Instructions.pdf"]
  },
  {
    id: 5,
    subject: "Software Engineering",
    subjectCode: "CS505",
    title: "UML Diagrams for E-commerce Application",
    description: "Create comprehensive UML diagrams including use case, class, sequence, and activity diagrams for an e-commerce platform.",
    dueDate: "2024-11-18T23:59:00",
    assignedDate: "2024-11-01T10:00:00",
    maxMarks: 100,
    faculty: "Dr. Manoj Verma",
    status: "submitted",
    priority: "high",
    allowLateSubmission: false,
    submittedFile: "UML_Diagrams_Arjun_21CS101.pdf",
    submittedDate: "2024-11-17T18:30:00",
    marksObtained: 92,
    feedback: "Excellent work! Very detailed diagrams with proper notation. Minor improvements needed in sequence diagram.",
    attachments: ["SE_Assignment_Requirements.pdf"]
  }
];

export const getPendingAssignments = () => {
  return assignments.filter(a => a.status === 'pending');
};

export const getSubmittedAssignments = () => {
  return assignments.filter(a => a.status === 'submitted');
};

export const getGradedAssignments = () => {
  return assignments.filter(a => a.status === 'graded');
};

export const getUrgentAssignments = () => {
  const now = new Date();
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  return assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    return a.status === 'pending' && (dueDate - now) < twoDays;
  });
};
