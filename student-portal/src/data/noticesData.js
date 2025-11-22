export const notices = [
  {
    id: 1,
    title: "Mid-term Examination Schedule Released",
    category: "Examination updates",
    date: "2024-11-18T10:00:00",
    priority: "high",
    isPinned: true,
    department: "All Departments",
    content: "The mid-term examination schedule for all departments has been released. Exams will commence from December 5th, 2024. Students are advised to check their respective department notice boards for detailed timetables.",
    attachments: ["Mid_Term_Schedule_2024.pdf"],
    postedBy: "Examination Cell"
  },
  {
    id: 2,
    title: "Fee Payment Reminder - Last Date Extended",
    category: "Fee reminders",
    date: "2024-11-17T14:30:00",
    priority: "high",
    isPinned: true,
    department: "All Departments",
    content: "The last date for semester fee payment has been extended to November 30th, 2024. Late fee will be applicable from December 1st onwards. Students can pay online through the portal or visit the accounts section.",
    attachments: [],
    postedBy: "Accounts Department"
  },
  {
    id: 3,
    title: "Placement Drive - Tech Giants",
    category: "Placement notifications",
    date: "2024-11-16T11:00:00",
    priority: "high",
    isPinned: false,
    department: "CSE, IT, ECE",
    content: "Leading tech companies including Google, Microsoft, and Amazon will be conducting campus placement drives from December 15th. Eligible students should register through the T&P portal by November 25th.",
    attachments: ["Placement_Companies_List.pdf", "Registration_Guidelines.pdf"],
    postedBy: "Training & Placement Cell"
  },
  {
    id: 4,
    title: "Winter Break Holiday Notice",
    category: "General circulars",
    date: "2024-11-15T09:00:00",
    priority: "medium",
    isPinned: false,
    department: "All Departments",
    content: "The college will remain closed from December 24th to January 5th for winter break. Hostel students planning to go home should submit their travel details to the hostel warden.",
    attachments: [],
    postedBy: "Administration"
  },
  {
    id: 5,
    title: "Guest Lecture on AI & Machine Learning",
    category: "Event announcements",
    date: "2024-11-14T15:00:00",
    priority: "medium",
    isPinned: false,
    department: "Computer Science & Engineering",
    content: "A guest lecture on 'Future of AI and Machine Learning' by Dr. Rajesh Kumar (IIT Delhi) will be conducted on November 25th at 2:00 PM in the main auditorium. All CSE students are encouraged to attend.",
    attachments: ["Guest_Lecture_Details.pdf"],
    postedBy: "CSE Department"
  },
  {
    id: 6,
    title: "Library Book Return Reminder",
    category: "Academic notices",
    date: "2024-11-13T10:30:00",
    priority: "low",
    isPinned: false,
    department: "All Departments",
    content: "Students having overdue library books are requested to return them by November 20th to avoid fine. The library will conduct a book audit from November 21st onwards.",
    attachments: [],
    postedBy: "Library"
  },
  {
    id: 7,
    title: "Annual Sports Meet Registration Open",
    category: "Event announcements",
    date: "2024-11-12T12:00:00",
    priority: "medium",
    isPinned: false,
    department: "All Departments",
    content: "Registration for the Annual Sports Meet is now open. Students interested in participating in various sports events should register through the student portal by November 25th. Registration fee: ₹100 (using Campus Coins).",
    attachments: ["Sports_Events_List.pdf"],
    postedBy: "Sports Committee"
  },
  {
    id: 8,
    title: "Hostel Maintenance Schedule",
    category: "General circulars",
    date: "2024-11-11T08:00:00",
    priority: "low",
    isPinned: false,
    department: "Hostel Students",
    content: "Regular hostel maintenance work will be carried out from November 22nd to November 24th. Students are requested to cooperate with the maintenance staff and keep their rooms accessible.",
    attachments: [],
    postedBy: "Hostel Administration"
  },
  {
    id: 9,
    title: "Workshop on Web Development",
    category: "Event announcements",
    date: "2024-11-10T16:00:00",
    priority: "medium",
    isPinned: false,
    department: "Computer Science & Engineering",
    content: "Tech Club is organizing a 3-day workshop on Full Stack Web Development from November 23rd to 25th. Limited seats available. Registration fee: ₹50. Certificate will be provided on completion.",
    attachments: ["Workshop_Schedule.pdf"],
    postedBy: "Tech Club"
  },
  {
    id: 10,
    title: "Condonation of Attendance - Application Process",
    category: "Academic notices",
    date: "2024-11-09T11:00:00",
    priority: "medium",
    isPinned: false,
    department: "All Departments",
    content: "Students with attendance shortage can apply for condonation through the student portal. Applications should be submitted with proper medical certificates or valid reasons by November 20th.",
    attachments: ["Condonation_Application_Form.pdf"],
    postedBy: "Academic Section"
  }
];

export const getPinnedNotices = () => {
  return notices.filter(n => n.isPinned);
};

export const getNoticesByCategory = (category) => {
  return notices.filter(n => n.category === category);
};

export const getRecentNotices = (count = 5) => {
  return notices.slice(0, count);
};

export const getNoticePriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
