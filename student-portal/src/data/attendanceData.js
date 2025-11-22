export const attendanceData = {
  overall: 82.5,
  required: 75,
  status: "good", // good, warning, danger
  subjects: [
    {
      subjectCode: "CS501",
      subjectName: "Data Structures",
      faculty: "Dr. Ramesh Sharma",
      totalClasses: 45,
      attended: 40,
      percentage: 88.9,
      status: "good"
    },
    {
      subjectCode: "CS502",
      subjectName: "Database Management Systems",
      faculty: "Prof. Anita Desai",
      totalClasses: 42,
      attended: 38,
      percentage: 90.5,
      status: "good"
    },
    {
      subjectCode: "CS503",
      subjectName: "Operating Systems",
      faculty: "Dr. Suresh Patel",
      totalClasses: 40,
      attended: 32,
      percentage: 80.0,
      status: "good"
    },
    {
      subjectCode: "CS504",
      subjectName: "Computer Networks",
      faculty: "Prof. Kavita Singh",
      totalClasses: 38,
      attended: 29,
      percentage: 76.3,
      status: "warning"
    },
    {
      subjectCode: "CS505",
      subjectName: "Software Engineering",
      faculty: "Dr. Manoj Verma",
      totalClasses: 41,
      attended: 33,
      percentage: 80.5,
      status: "good"
    },
    {
      subjectCode: "CS506",
      subjectName: "Machine Learning",
      faculty: "Dr. Priya Reddy",
      totalClasses: 36,
      attended: 27,
      percentage: 75.0,
      status: "warning"
    }
  ],
  recentAttendance: [
    { date: "2024-11-18", subject: "Data Structures", status: "present" },
    { date: "2024-11-18", subject: "DBMS", status: "present" },
    { date: "2024-11-17", subject: "Operating Systems", status: "present" },
    { date: "2024-11-17", subject: "Computer Networks", status: "absent" },
    { date: "2024-11-16", subject: "Software Engineering", status: "present" },
    { date: "2024-11-16", subject: "Machine Learning", status: "late" },
    { date: "2024-11-15", subject: "Data Structures", status: "present" },
    { date: "2024-11-15", subject: "DBMS", status: "present" }
  ]
};

export const getAttendanceStatus = (percentage) => {
  if (percentage >= 85) return 'good';
  if (percentage >= 75) return 'warning';
  return 'danger';
};

export const getAttendanceColor = (status) => {
  switch (status) {
    case 'good': return 'text-green-600 bg-green-50';
    case 'warning': return 'text-orange-600 bg-orange-50';
    case 'danger': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};
