# Co-Campus MongoDB Schema Documentation

Complete database schema for all 45+ collections with field definitions, data types, and relationships.

---

## 1. USERS & AUTHENTICATION

### 1.1 users
```javascript
{
  _id: ObjectId,
  userId: String,              // Unique: "STU2024001", "FAC2020015", "ADMIN001"
  email: String,               // Unique
  password: String,            // Bcrypt hashed
  name: String,
  phone: String,
  role: String,                // enum: student, faculty, hod, principal, admin, warden, canteen, stall, sports, club
  department: String,          // Reference to departments
  status: String,              // enum: active, inactive, suspended

  // Role-specific fields
  // For Students:
  rollNumber: String,
  semester: Number,
  section: String,
  batch: String,
  cgpa: Number,
  currentSemesterGPA: Number,
  address: {
    room: String,
    hostel: String,
    permanent: String
  },
  parentInfo: {
    fatherName: String,
    fatherPhone: String,
    motherName: String,
    motherPhone: String
  },

  // For Faculty/HoD:
  employeeId: String,
  designation: String,
  qualification: String,
  specialization: String,
  experience: Number,
  joiningDate: Date,
  subjects: [String],          // Array of subject IDs

  // For Warden:
  assignedBlock: String,

  // For Canteen/Stall:
  businessName: String,
  licenseNumber: String,
  bankDetails: Object,

  // Common fields
  profile: {
    avatar: String,
    bio: String,
    achievements: [ObjectId]   // Reference to achievements
  },

  settings: {
    notifications: Boolean,
    emailAlerts: Boolean,
    language: String
  },

  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### 1.2 sessions
```javascript
{
  _id: ObjectId,
  userId: ObjectId,            // Reference to users
  token: String,               // JWT token
  refreshToken: String,
  deviceInfo: {
    userAgent: String,
    ip: String,
    platform: String
  },
  expiresAt: Date,
  createdAt: Date
}
```

### 1.3 otp_verifications
```javascript
{
  _id: ObjectId,
  email: String,
  phone: String,
  otp: String,
  purpose: String,             // enum: login, signup, password_reset
  verified: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

---

## 2. ACADEMIC MANAGEMENT

### 2.1 departments
```javascript
{
  _id: ObjectId,
  departmentId: String,        // Unique: "CSE", "ECE", "ME"
  name: String,
  code: String,                // 3-5 chars
  hodId: ObjectId,             // Reference to users
  yearEstablished: Number,
  email: String,
  phone: String,
  location: String,
  vision: String,
  mission: String,

  stats: {
    facultyCount: Number,
    studentCount: Number,
    labCount: Number
  },

  status: String,              // enum: active, inactive
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 subjects
```javascript
{
  _id: ObjectId,
  subjectCode: String,         // Unique: "CS501", "CS502L"
  name: String,
  credits: Number,
  type: String,                // enum: Theory, Lab, Elective
  semester: Number,            // 1-8
  department: String,          // Reference to departments
  syllabus: String,            // PDF URL
  prerequisites: [String],     // Array of subject codes

  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 semesters
```javascript
{
  _id: ObjectId,
  academicYear: String,        // "2024-2025"
  semester: Number,            // 1-8
  startDate: Date,
  endDate: Date,
  examSchedule: {
    mid1Start: Date,
    mid1End: Date,
    mid2Start: Date,
    mid2End: Date,
    finalStart: Date,
    finalEnd: Date
  },
  status: String,              // enum: upcoming, active, completed
  createdAt: Date
}
```

### 2.4 timetables
```javascript
{
  _id: ObjectId,
  department: String,
  semester: Number,
  section: String,
  academicYear: String,

  schedule: [
    {
      day: String,             // Monday, Tuesday, etc.
      periods: [
        {
          periodNumber: Number,
          startTime: String,   // "09:00"
          endTime: String,     // "09:50"
          subject: String,     // Reference to subjects
          subjectCode: String,
          facultyId: ObjectId,
          facultyName: String,
          room: String,
          type: String         // Theory, Lab, Break
        }
      ]
    }
  ],

  createdAt: Date,
  updatedAt: Date
}
```

### 2.5 assignments
```javascript
{
  _id: ObjectId,
  assignmentId: String,        // Unique: "ASG2024001"
  title: String,
  description: String,
  subject: String,
  subjectCode: String,
  facultyId: ObjectId,         // Reference to users
  facultyName: String,

  targetStudents: {
    department: String,
    semester: Number,
    section: String,
    class: String              // "CSE-3A"
  },

  assignedDate: Date,
  dueDate: Date,
  maxMarks: Number,
  allowLateSubmission: Boolean,
  lateSubmissionDeadline: Date,

  attachments: [
    {
      filename: String,
      url: String,
      size: Number
    }
  ],

  status: String,              // enum: active, closed, graded
  priority: String,            // enum: low, medium, high, urgent

  stats: {
    totalStudents: Number,
    submitted: Number,
    pending: Number,
    graded: Number
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 2.6 assignment_submissions
```javascript
{
  _id: ObjectId,
  submissionId: String,        // Unique
  assignmentId: ObjectId,      // Reference to assignments
  studentId: ObjectId,         // Reference to users
  studentName: String,
  rollNumber: String,

  submittedFile: {
    filename: String,
    url: String,
    size: Number,
    uploadedAt: Date
  },

  comments: String,
  submittedDate: Date,
  isLate: Boolean,

  // Grading
  marksObtained: Number,
  feedback: String,
  gradedBy: ObjectId,
  gradedDate: Date,
  status: String,              // enum: submitted, graded, resubmit_required

  createdAt: Date,
  updatedAt: Date
}
```

### 2.7 attendance
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,         // Reference to users, Unique
  rollNumber: String,
  name: String,
  department: String,
  semester: Number,
  section: String,
  academicYear: String,

  overall: {
    percentage: Number,
    totalClasses: Number,
    attended: Number,
    status: String             // enum: good, warning, danger
  },

  subjects: [
    {
      subjectCode: String,
      subjectName: String,
      facultyId: ObjectId,
      facultyName: String,
      totalClasses: Number,
      attended: Number,
      percentage: Number,
      status: String
    }
  ],

  updatedAt: Date
}
```

### 2.8 attendance_records
```javascript
{
  _id: ObjectId,
  recordId: String,
  date: Date,
  subject: String,
  subjectCode: String,
  facultyId: ObjectId,
  facultyName: String,
  class: String,               // "CSE-3A"
  department: String,
  semester: Number,
  section: String,

  periodNumber: Number,
  sessionType: String,         // enum: Regular, Extra Class, Substitution

  attendance: [
    {
      studentId: ObjectId,
      rollNumber: String,
      name: String,
      status: String,          // enum: present, absent, late
      remarks: String
    }
  ],

  stats: {
    totalStudents: Number,
    present: Number,
    absent: Number,
    late: Number
  },

  markedBy: ObjectId,
  markedAt: Date,
  createdAt: Date
}
```

### 2.9 marks
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,         // Reference to users
  rollNumber: String,
  name: String,
  subject: String,
  subjectCode: String,
  semester: Number,
  academicYear: String,

  evaluations: {
    mid1: {
      marks: Number,
      maxMarks: Number,
      date: Date,
      uploadedBy: ObjectId
    },
    mid2: {
      marks: Number,
      maxMarks: Number,
      date: Date,
      uploadedBy: ObjectId
    },
    internal: {
      marks: Number,
      maxMarks: Number,
      date: Date,
      uploadedBy: ObjectId
    },
    final: {
      marks: Number,
      maxMarks: Number,
      date: Date,
      uploadedBy: ObjectId
    }
  },

  total: Number,
  grade: String,               // A+, A, B+, B, C, D, F
  gradePoint: Number,
  status: String,              // enum: pass, fail

  createdAt: Date,
  updatedAt: Date
}
```

### 2.10 results
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,         // Reference to users
  rollNumber: String,
  name: String,
  department: String,
  semester: Number,
  academicYear: String,

  subjects: [
    {
      subjectCode: String,
      subjectName: String,
      credits: Number,
      mid1: Number,
      mid2: Number,
      internal: Number,
      total: Number,
      grade: String,
      gradePoint: Number
    }
  ],

  sgpa: Number,
  totalCredits: Number,
  status: String,              // enum: pass, fail, pending

  cumulativeResults: {
    cgpa: Number,
    totalCreditsEarned: Number,
    totalSemestersCompleted: Number
  },

  publishedDate: Date,
  createdAt: Date
}
```

### 2.11 academic_calendar
```javascript
{
  _id: ObjectId,
  eventId: String,
  title: String,
  description: String,
  eventType: String,           // enum: exam, holiday, event, academic
  startDate: Date,
  endDate: Date,
  isAllDay: Boolean,

  applicableTo: {
    departments: [String],     // Empty array = all departments
    semesters: [Number],       // Empty array = all semesters
    roles: [String]            // student, faculty, etc.
  },

  color: String,               // For calendar display
  priority: String,            // enum: low, medium, high

  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. APPROVAL & REQUEST MANAGEMENT

### 3.1 gate_pass_requests
```javascript
{
  _id: ObjectId,
  requestId: String,           // Unique: "GP-2024-001"
  studentId: ObjectId,         // Reference to users
  studentName: String,
  rollNumber: String,
  department: String,
  semester: Number,
  class: String,

  passType: String,            // enum: medical, family, official, early_departure, late_arrival
  reason: String,
  date: Date,
  outTime: String,
  expectedReturn: String,
  actualReturn: String,

  parentContact: String,
  supportingDocuments: [
    {
      filename: String,
      url: String,
      type: String
    }
  ],

  status: String,              // enum: pending, approved, rejected, completed, cancelled

  approvalWorkflow: [
    {
      approverRole: String,    // hod, warden, coordinator
      approverId: ObjectId,
      approverName: String,
      action: String,          // approved, rejected
      remarks: String,
      timestamp: Date
    }
  ],

  verifications: {
    exitVerified: Boolean,
    exitTime: Date,
    exitGuardId: ObjectId,
    entryVerified: Boolean,
    entryTime: Date,
    entryGuardId: ObjectId
  },

  requestDate: Date,
  approvedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 leave_requests
```javascript
{
  _id: ObjectId,
  requestId: String,           // Unique: "LR-2024-001"
  facultyId: ObjectId,         // Reference to users
  facultyName: String,
  employeeId: String,
  department: String,

  leaveType: String,           // enum: casual, medical, duty, academic, emergency
  fromDate: Date,
  toDate: Date,
  totalDays: Number,
  reason: String,

  substituteArranged: String,
  substituteFacultyId: ObjectId,
  affectedClasses: [
    {
      date: Date,
      class: String,
      subject: String,
      period: Number
    }
  ],

  supportingDocuments: [
    {
      filename: String,
      url: String,
      type: String
    }
  ],

  status: String,              // enum: pending, approved, rejected, cancelled

  approvedBy: ObjectId,        // HOD
  approverName: String,
  approvalRemarks: String,
  approvedDate: Date,

  requestDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.3 event_requests
```javascript
{
  _id: ObjectId,
  requestId: String,           // Unique: "EVT-2024-001"
  clubId: ObjectId,            // Reference to clubs
  clubName: String,

  basicDetails: {
    academicYear: String,
    quarter: String,           // Q1, Q2, Q3, Q4
    programType: String,       // Workshop, Seminar, Conference, Hackathon, Competition
    programTheme: String,
    activityName: String,
    duration: Number,          // hours
    modeOfDelivery: String,    // Offline, Online, Hybrid
    startDate: Date,
    endDate: Date
  },

  participants: {
    students: Number,
    faculty: Number,
    external: Number,
    total: Number
  },

  budget: {
    requested: Number,
    approved: Number,
    spent: Number,
    expenditureBreakdown: [
      {
        category: String,
        amount: Number,
        description: String
      }
    ]
  },

  activityLedBy: String,       // enum: Student Committee, Faculty Coordinator, Joint

  overview: {
    objective: String,
    benefitOutcome: String
  },

  attachments: {
    videoUrl: String,
    photograph1: String,
    photograph2: String,
    overallReport: String,
    additionalDoc: String
  },

  venue: {
    location: String,
    capacity: Number,
    equipment: [String]
  },

  status: String,              // enum: draft, submitted, pending, approved, rejected, completed

  approvalWorkflow: [
    {
      approverRole: String,    // principal, dean
      approverId: ObjectId,
      approverName: String,
      action: String,
      remarks: String,
      timestamp: Date
    }
  ],

  registrationOpen: Boolean,
  registrationDeadline: Date,
  maxRegistrations: Number,
  currentRegistrations: Number,

  submittedBy: ObjectId,
  submittedDate: Date,
  approvedDate: Date,
  completedDate: Date,

  createdAt: Date,
  updatedAt: Date
}
```

### 3.4 attendance_exemption_requests
```javascript
{
  _id: ObjectId,
  requestId: String,           // Unique: "AER-2024-001"
  clubId: ObjectId,            // Reference to clubs
  eventId: ObjectId,           // Reference to events/event_requests
  eventName: String,
  eventDate: Date,

  selectedStudents: [
    {
      studentId: ObjectId,
      rollNumber: String,
      name: String,
      department: String,
      semester: Number
    }
  ],

  totalStudents: Number,
  reason: String,

  affectedSubjects: [String],  // Which subjects to mark as exempt

  status: String,              // enum: pending, approved, rejected

  approvedBy: ObjectId,        // HOD
  approverName: String,
  approvalRemarks: String,
  approvedDate: Date,

  submittedBy: ObjectId,
  submittedDate: Date,
  createdAt: Date
}
```

### 3.5 certificate_requests
```javascript
{
  _id: ObjectId,
  requestId: String,           // Unique: "CRT-2024-001"
  studentId: ObjectId,         // Reference to users
  studentName: String,
  rollNumber: String,
  department: String,
  semester: Number,

  certificateType: String,     // enum: bonafide, semester_memorandum, character, course_completion, transfer, migration, fee_receipt
  purpose: String,
  numberOfCopies: Number,
  priority: String,            // enum: normal, urgent
  urgencyFee: Number,

  status: String,              // enum: pending, in_progress, ready, delivered, rejected

  generatedBy: ObjectId,
  generatedDate: Date,
  certificateUrl: String,

  approvedBy: ObjectId,
  approvalDate: Date,

  deliveryDetails: {
    method: String,            // collect, courier
    deliveredDate: Date,
    recipientSignature: String
  },

  requestDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. CLUB & EVENTS MANAGEMENT

### 4.1 clubs
```javascript
{
  _id: ObjectId,
  clubId: String,              // Unique: "CLB-001"
  name: String,
  category: String,            // Technical, Cultural, Sports, Literary
  description: String,
  logo: String,

  establishedYear: Number,

  leadership: {
    facultyAdvisor: ObjectId,
    facultyAdvisorName: String,
    president: ObjectId,
    presidentName: String,
    vicePresident: ObjectId,
    vicePresidentName: String,
    secretary: ObjectId,
    secretaryName: String
  },

  stats: {
    totalMembers: Number,
    activeMembers: Number,
    eventsOrganized: Number,
    upcomingEvents: Number
  },

  budget: {
    allocated: Number,
    spent: Number,
    remaining: Number
  },

  contact: {
    email: String,
    phone: String,
    socialMedia: {
      instagram: String,
      twitter: String,
      linkedin: String
    }
  },

  status: String,              // enum: active, inactive
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 club_members
```javascript
{
  _id: ObjectId,
  clubId: ObjectId,            // Reference to clubs
  studentId: ObjectId,         // Reference to users
  rollNumber: String,
  name: String,
  email: String,
  phone: String,
  department: String,
  year: Number,

  role: String,                // enum: member, core_member, lead, co-lead
  position: String,            // Technical Head, Design Lead, etc.

  joiningDate: Date,
  status: String,              // enum: active, inactive, alumni

  contributions: {
    eventsParticipated: Number,
    eventsOrganized: Number,
    achievementsEarned: Number
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 events
```javascript
{
  _id: ObjectId,
  eventId: String,             // Unique: "EVT-2024-001"
  eventRequestId: ObjectId,    // Reference to event_requests
  name: String,
  description: String,
  category: String,            // Workshop, Seminar, Competition, etc.

  organizingClub: ObjectId,    // Reference to clubs
  clubName: String,

  dateTime: {
    startDate: Date,
    endDate: Date,
    duration: Number,
    venue: String
  },

  registration: {
    isOpen: Boolean,
    fee: Number,
    maxParticipants: Number,
    currentParticipants: Number,
    deadline: Date,
    registrationType: String   // individual, team
  },

  eligibility: {
    departments: [String],
    semesters: [Number],
    openToExternal: Boolean
  },

  resources: {
    speakers: [String],
    sponsors: [String],
    prizes: [String]
  },

  banner: String,
  gallery: [String],

  status: String,              // enum: upcoming, ongoing, completed, cancelled

  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 event_participants
```javascript
{
  _id: ObjectId,
  registrationId: String,      // Unique: "REG-2024-001"
  eventId: ObjectId,           // Reference to events
  eventName: String,

  // For Individual Registration
  studentId: ObjectId,
  rollNumber: String,
  name: String,
  email: String,
  phone: String,
  department: String,
  year: Number,

  // For Team Registration
  isTeam: Boolean,
  teamDetails: {
    teamName: String,
    teamSize: Number,
    category: String,
    institution: String,
    members: [
      {
        name: String,
        email: String,
        phone: String,
        rollNumber: String
      }
    ],
    teamLeader: {
      name: String,
      rollNumber: String,
      email: String,
      phone: String
    }
  },

  registrationDate: Date,

  payment: {
    amount: Number,
    status: String,            // enum: pending, paid, refunded
    transactionId: String,
    paymentDate: Date,
    paymentMethod: String      // campus_coins, online
  },

  attendance: {
    checked: Boolean,
    checkInTime: Date,
    checkOutTime: Date
  },

  certificate: {
    issued: Boolean,
    certificateUrl: String,
    issuedDate: Date
  },

  status: String,              // enum: registered, attended, cancelled

  createdAt: Date,
  updatedAt: Date
}
```

### 4.5 club_departments
```javascript
{
  _id: ObjectId,
  clubId: ObjectId,            // Reference to clubs
  departmentName: String,      // Technical, Design, Marketing, etc.
  description: String,

  head: {
    studentId: ObjectId,
    name: String,
    contact: String
  },

  members: [
    {
      studentId: ObjectId,
      name: String,
      role: String
    }
  ],

  responsibilities: [String],

  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. HOSTEL MANAGEMENT

### 5.1 hostel_blocks
```javascript
{
  _id: ObjectId,
  blockId: String,             // Unique: "BLOCK-A", "BLOCK-B"
  name: String,
  type: String,                // enum: boys, girls
  totalFloors: Number,
  roomsPerFloor: Number,
  totalRooms: Number,

  warden: {
    wardenId: ObjectId,
    name: String,
    phone: String,
    email: String
  },

  facilities: [String],        // WiFi, Gym, Common Room, etc.

  stats: {
    totalCapacity: Number,
    occupied: Number,
    vacant: Number,
    underMaintenance: Number
  },

  status: String,              // enum: active, under_maintenance
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 hostel_rooms
```javascript
{
  _id: ObjectId,
  roomId: String,              // Unique: "A-101"
  blockId: ObjectId,           // Reference to hostel_blocks
  blockName: String,
  floor: Number,
  roomNumber: String,

  type: String,                // single, double, triple
  capacity: Number,
  currentOccupancy: Number,

  facilities: [String],        // AC, Attached Bath, etc.

  beds: [
    {
      bedNumber: Number,
      isOccupied: Boolean,
      studentId: ObjectId,
      studentName: String
    }
  ],

  maintenance: {
    status: String,            // enum: good, needs_repair, under_maintenance
    lastInspection: Date,
    issues: [String]
  },

  status: String,              // enum: available, occupied, full, maintenance
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 hostel_allocations
```javascript
{
  _id: ObjectId,
  allocationId: String,
  studentId: ObjectId,         // Reference to users
  studentName: String,
  rollNumber: String,
  department: String,
  semester: Number,

  blockId: ObjectId,
  blockName: String,
  roomId: ObjectId,
  roomNumber: String,
  bedNumber: Number,

  allocationDate: Date,
  validUntil: Date,

  feeDetails: {
    amount: Number,
    paid: Boolean,
    paymentDate: Date,
    receiptNumber: String
  },

  status: String,              // enum: active, vacated, suspended
  vacatedDate: Date,

  createdAt: Date,
  updatedAt: Date
}
```

### 5.4 mess_menu
```javascript
{
  _id: ObjectId,
  weekStartDate: Date,
  blockId: ObjectId,
  blockName: String,

  menu: [
    {
      day: String,             // Monday, Tuesday, etc.
      meals: {
        breakfast: {
          items: [String],
          time: String
        },
        lunch: {
          items: [String],
          time: String
        },
        snacks: {
          items: [String],
          time: String
        },
        dinner: {
          items: [String],
          time: String
        }
      }
    }
  ],

  specialNotes: String,

  publishedBy: ObjectId,
  publishedDate: Date,

  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. CANTEEN & FOOD SERVICE

### 6.1 canteen_stalls
```javascript
{
  _id: ObjectId,
  stallId: String,             // Unique: "STALL-001"
  name: String,
  category: String,            // Main Canteen, Snacks, Juice, Bakery, Fast Food
  description: String,
  image: String,

  owner: {
    ownerId: ObjectId,         // Reference to users
    name: String,
    phone: String,
    email: String
  },

  operatingHours: {
    open: String,              // "08:00"
    close: String,             // "20:00"
    weekdays: [String]         // ["Monday", "Tuesday", ...]
  },

  location: String,

  rating: {
    average: Number,
    totalReviews: Number
  },

  stats: {
    totalOrders: Number,
    totalRevenue: Number,
    todayOrders: Number,
    todayRevenue: Number
  },

  isOpen: Boolean,
  status: String,              // enum: active, inactive, suspended

  bankDetails: {
    accountNumber: String,
    ifsc: String,
    upiId: String
  },

  documents: {
    license: String,
    foodSafetyCertificate: String
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 6.2 menu_items
```javascript
{
  _id: ObjectId,
  itemId: String,              // Unique: "ITEM-001"
  stallId: ObjectId,           // Reference to canteen_stalls
  stallName: String,

  name: String,
  description: String,
  category: String,            // Breakfast, Lunch, Dinner, Snacks, Beverages
  price: Number,

  image: String,

  dietary: {
    isVeg: Boolean,
    isVegan: Boolean,
    isGlutenFree: Boolean,
    isNutFree: Boolean
  },

  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },

  availability: {
    isAvailable: Boolean,
    availableFrom: String,     // "08:00"
    availableTo: String,       // "11:00"
    daysAvailable: [String]
  },

  rating: {
    average: Number,
    totalRatings: Number
  },

  stats: {
    totalOrders: Number,
    popularityRank: Number
  },

  status: String,              // enum: available, out_of_stock, discontinued

  createdAt: Date,
  updatedAt: Date
}
```

### 6.3 orders
```javascript
{
  _id: ObjectId,
  orderNumber: String,         // Unique: "ORD-2024-001234"
  studentId: ObjectId,         // Reference to users
  studentName: String,
  rollNumber: String,
  phone: String,

  stallId: ObjectId,           // Reference to canteen_stalls
  stallName: String,

  items: [
    {
      itemId: ObjectId,
      itemName: String,
      quantity: Number,
      price: Number,
      subtotal: Number,
      specialInstructions: String
    }
  ],

  pricing: {
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number
  },

  payment: {
    method: String,            // campus_coins
    transactionId: String,
    status: String,            // enum: pending, paid, failed, refunded
    paidAt: Date
  },

  orderDate: Date,

  timeline: {
    placed: Date,
    confirmed: Date,
    preparing: Date,
    ready: Date,
    completed: Date,
    cancelled: Date
  },

  status: String,              // enum: pending, confirmed, preparing, ready, completed, cancelled

  pickupTime: String,
  estimatedTime: Number,       // minutes

  rating: {
    stars: Number,
    review: String,
    ratedAt: Date
  },

  cancelledBy: String,         // student, stall
  cancellationReason: String,

  createdAt: Date,
  updatedAt: Date
}
```

### 6.4 order_items
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,           // Reference to orders
  itemId: ObjectId,            // Reference to menu_items
  itemName: String,
  quantity: Number,
  price: Number,
  subtotal: Number
}
```

---

## 7. FINANCIAL MANAGEMENT

### 7.1 campus_coins_wallets
```javascript
{
  _id: ObjectId,
  walletId: String,            // Unique
  userId: ObjectId,            // Reference to users, Unique
  userType: String,            // student, faculty, staff

  balance: Number,

  stats: {
    totalEarned: Number,
    totalSpent: Number,
    monthlySpending: [
      {
        month: String,         // "2024-08"
        food: Number,
        events: Number,
        sports: Number,
        certificates: Number,
        other: Number,
        total: Number
      }
    ]
  },

  limits: {
    dailySpendingLimit: Number,
    monthlySpendingLimit: Number
  },

  security: {
    pin: String,               // Hashed
    pinSetAt: Date,
    isPinEnabled: Boolean
  },

  status: String,              // enum: active, frozen, suspended

  createdAt: Date,
  updatedAt: Date
}
```

### 7.2 transactions
```javascript
{
  _id: ObjectId,
  transactionId: String,       // Unique: "TXN-2024-001"
  walletId: ObjectId,          // Reference to campus_coins_wallets
  userId: ObjectId,            // Reference to users

  type: String,                // enum: credit, debit
  category: String,            // enum: topup, food, events, sports, certificates, transfer, refund
  amount: Number,

  description: String,

  // For specific transactions
  orderId: ObjectId,           // If food order
  eventId: ObjectId,           // If event registration
  bookingId: ObjectId,         // If sports booking
  certificateId: ObjectId,     // If certificate request

  vendor: {
    vendorId: ObjectId,
    vendorName: String,
    vendorType: String         // stall, club, sports
  },

  // For topup
  topupDetails: {
    method: String,            // upi, bank_transfer, card
    bankTransactionId: String,
    verifiedBy: ObjectId,
    verifiedAt: Date
  },

  balanceBefore: Number,
  balanceAfter: Number,

  status: String,              // enum: pending, completed, failed, reversed

  metadata: {
    ipAddress: String,
    deviceInfo: String,
    location: String
  },

  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 7.3 fee_structure
```javascript
{
  _id: ObjectId,
  academicYear: String,
  semester: Number,
  department: String,

  components: {
    tuitionFee: Number,
    developmentFee: Number,
    examFee: Number,
    libraryFee: Number,
    sportsFee: Number,
    labFee: Number,
    miscellaneous: Number
  },

  total: Number,

  dueDate: Date,
  lateFee: Number,

  applicableTo: {
    batches: [String],
    categories: [String]       // Regular, Lateral Entry, etc.
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 7.4 fee_payments
```javascript
{
  _id: ObjectId,
  paymentId: String,           // Unique: "PAY-2024-001"
  studentId: ObjectId,         // Reference to users
  rollNumber: String,
  name: String,
  department: String,
  semester: Number,
  academicYear: String,

  feeStructureId: ObjectId,    // Reference to fee_structure

  components: {
    tuitionFee: Number,
    developmentFee: Number,
    examFee: Number,
    libraryFee: Number,
    sportsFee: Number,
    labFee: Number,
    miscellaneous: Number,
    lateFee: Number
  },

  amount: Number,

  payment: {
    method: String,            // online, card, upi, bank_transfer
    transactionId: String,
    gateway: String,           // razorpay, paytm, etc.
    status: String,            // enum: pending, success, failed
    paidAt: Date
  },

  receiptNumber: String,
  receiptUrl: String,

  verifiedBy: ObjectId,
  verifiedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

### 7.5 receipts
```javascript
{
  _id: ObjectId,
  receiptNumber: String,       // Unique
  receiptType: String,         // fee_payment, certificate, misc

  studentId: ObjectId,
  studentName: String,
  rollNumber: String,

  amount: Number,
  purpose: String,

  paymentId: ObjectId,         // Reference to fee_payments or other payment

  pdfUrl: String,

  issuedBy: ObjectId,
  issuedDate: Date,

  createdAt: Date
}
```

---

## 8. SPORTS MANAGEMENT

### 8.1 sports_facilities
```javascript
{
  _id: ObjectId,
  facilityId: String,          // Unique: "FAC-001"
  name: String,
  type: String,                // Cricket, Volleyball, Badminton, Table Tennis, etc.
  description: String,

  specifications: {
    surfaceType: String,
    capacity: Number,
    courts: Number,             // For multi-court facilities
    equipment: [String]
  },

  images: [String],

  location: String,

  availability: {
    isAvailable: Boolean,
    openingHours: {
      weekdays: {
        open: String,
        close: String
      },
      weekends: {
        open: String,
        close: String
      }
    },
    closedDays: [String]
  },

  pricing: {
    studentRate: Number,       // per hour
    facultyRate: Number,
    guestRate: Number,
    premiumRate: Number        // for floodlight/AC facilities
  },

  bookingRules: {
    maxAdvanceBooking: Number,  // days
    minBookingDuration: Number, // hours
    maxBookingDuration: Number,
    cancellationPolicy: String
  },

  stats: {
    totalBookings: Number,
    revenueGenerated: Number
  },

  maintenanceSchedule: [
    {
      date: Date,
      type: String,
      description: String
    }
  ],

  status: String,              // enum: available, under_maintenance, closed

  createdAt: Date,
  updatedAt: Date
}
```

### 8.2 facility_bookings
```javascript
{
  _id: ObjectId,
  bookingId: String,           // Unique: "BKG-2024-001"

  facilityId: ObjectId,        // Reference to sports_facilities
  facilityName: String,

  bookedBy: {
    userId: ObjectId,
    userType: String,          // student, faculty, guest
    name: String,
    email: String,
    phone: String,
    rollNumber: String         // if student
  },

  bookingDate: Date,
  timeSlot: {
    startTime: String,         // "10:00"
    endTime: String,           // "11:00"
    duration: Number           // hours
  },

  purpose: String,
  numberOfPeople: Number,

  courtNumber: Number,         // if multi-court facility
  equipmentRequested: [String],

  pricing: {
    rateType: String,          // regular, premium
    baseAmount: Number,
    additionalCharges: Number,
    total: Number
  },

  payment: {
    method: String,            // campus_coins, online, pay_at_venue
    transactionId: String,
    status: String,            // enum: pending, paid, refunded
    paidAt: Date
  },

  status: String,              // enum: pending, confirmed, completed, cancelled, no_show

  approvalRequired: Boolean,
  approvedBy: ObjectId,
  approvedAt: Date,

  checkIn: {
    time: Date,
    verifiedBy: ObjectId
  },

  checkOut: {
    time: Date,
    verifiedBy: ObjectId
  },

  cancellation: {
    cancelledBy: String,       // user, admin
    reason: String,
    cancelledAt: Date,
    refundAmount: Number
  },

  createdAt: Date,
  updatedAt: Date
}
```

---

## 9. COMMUNICATION & NOTIFICATIONS

### 9.1 notices
```javascript
{
  _id: ObjectId,
  noticeId: String,            // Unique: "NOT-2024-001"
  title: String,
  content: String,
  category: String,            // enum: academic, examination, fee, event, placement, general

  priority: String,            // enum: low, medium, high, urgent

  attachment: {
    filename: String,
    url: String,
    size: Number
  },

  target: {
    departments: [String],     // Empty = all
    semesters: [Number],       // Empty = all
    roles: [String]            // student, faculty, etc.
  },

  isPinned: Boolean,
  pinExpiresAt: Date,

  visibility: {
    showOnWebsite: Boolean,
    showInApp: Boolean,
    sendEmail: Boolean,
    sendPush: Boolean
  },

  publishedBy: ObjectId,
  publisherName: String,
  publishDate: Date,

  expiryDate: Date,

  stats: {
    views: Number,
    downloads: Number
  },

  status: String,              // enum: draft, published, expired, archived

  createdAt: Date,
  updatedAt: Date
}
```

### 9.2 notifications
```javascript
{
  _id: ObjectId,
  notificationId: String,
  userId: ObjectId,            // Reference to users

  type: String,                // enum: assignment, result, approval, payment, event, general
  title: String,
  message: String,

  data: {
    referenceId: ObjectId,     // Reference to related document
    referenceType: String,     // assignment, gate_pass, event, etc.
    actionUrl: String
  },

  priority: String,            // enum: low, normal, high

  channels: {
    inApp: Boolean,
    email: Boolean,
    sms: Boolean,
    push: Boolean
  },

  isRead: Boolean,
  readAt: Date,

  deliveryStatus: {
    inApp: String,             // sent, delivered, failed
    email: String,
    sms: String,
    push: String
  },

  createdAt: Date,
  expiresAt: Date
}
```

### 9.3 feedback
```javascript
{
  _id: ObjectId,
  feedbackId: String,          // Unique
  studentId: ObjectId,         // Reference to users
  studentName: String,
  isAnonymous: Boolean,

  feedbackType: String,        // enum: faculty, infrastructure, hostel, canteen, general

  // For Faculty Feedback
  facultyId: ObjectId,
  facultyName: String,
  subject: String,
  semester: Number,
  academicYear: String,

  ratings: {
    teachingClarity: Number,   // 1-5
    subjectKnowledge: Number,
    punctuality: Number,
    interaction: Number,
    overallRating: Number
  },

  // For Infrastructure/Hostel/Canteen
  targetEntity: {
    entityType: String,        // lab, classroom, hostel_block, canteen_stall
    entityId: ObjectId,
    entityName: String
  },

  comments: String,
  suggestions: String,

  status: String,              // enum: submitted, reviewed, action_taken

  response: {
    respondedBy: ObjectId,
    respondedAt: Date,
    comment: String
  },

  submittedDate: Date,
  createdAt: Date
}
```

### 9.4 achievements
```javascript
{
  _id: ObjectId,
  achievementId: String,       // Unique
  studentId: ObjectId,         // Reference to users
  studentName: String,
  rollNumber: String,
  department: String,

  title: String,
  category: String,            // enum: academic, sports, cultural, technical, research, certification, internship
  description: String,

  date: Date,

  certificate: {
    filename: String,
    url: String,
    size: Number
  },

  details: {
    organizer: String,
    level: String,             // college, university, state, national, international
    position: String,          // First, Second, Third, Participation
    teamSize: Number
  },

  visibility: String,          // enum: public, private

  verification: {
    isVerified: Boolean,
    verifiedBy: ObjectId,
    verifiedAt: Date,
    remarks: String
  },

  status: String,              // enum: pending, approved, rejected

  uploadedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 10. RESOURCES & INFRASTRUCTURE

### 10.1 laboratories
```javascript
{
  _id: ObjectId,
  labId: String,               // Unique
  name: String,
  department: String,
  labNumber: String,

  capacity: Number,
  totalSystems: Number,
  functionalSystems: Number,

  software: [
    {
      name: String,
      version: String,
      licenses: Number,
      expiryDate: Date
    }
  ],

  equipment: [
    {
      name: String,
      quantity: Number,
      condition: String        // good, needs_repair, damaged
    }
  ],

  incharge: {
    facultyId: ObjectId,
    name: String,
    contact: String
  },

  timetable: [
    {
      day: String,
      periods: [
        {
          startTime: String,
          endTime: String,
          class: String,
          subject: String,
          faculty: String
        }
      ]
    }
  ],

  maintenance: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    issues: [String]
  },

  status: String,              // enum: operational, under_maintenance, closed

  createdAt: Date,
  updatedAt: Date
}
```

### 10.2 equipment
```javascript
{
  _id: ObjectId,
  equipmentId: String,         // Unique
  name: String,
  category: String,            // Computer, Projector, Lab Equipment, etc.

  location: {
    type: String,              // lab, classroom, department
    locationId: ObjectId,
    locationName: String
  },

  specifications: String,

  quantity: {
    total: Number,
    working: Number,
    underMaintenance: Number,
    damaged: Number
  },

  purchase: {
    date: Date,
    cost: Number,
    vendor: String,
    warrantyUntil: Date
  },

  maintenance: {
    schedule: String,          // weekly, monthly, quarterly
    lastService: Date,
    nextService: Date,
    serviceProvider: String
  },

  status: String,              // enum: working, needs_repair, under_maintenance, damaged

  createdAt: Date,
  updatedAt: Date
}
```

### 10.3 budget_allocations
```javascript
{
  _id: ObjectId,
  allocationId: String,
  academicYear: String,
  department: String,

  total: Number,
  utilized: Number,
  pending: Number,

  categories: [
    {
      name: String,            // Lab Equipment, Software, Furniture, etc.
      allocated: Number,
      spent: Number,
      remaining: Number,
      expenses: [
        {
          date: Date,
          description: String,
          amount: Number,
          vendor: String,
          invoiceNumber: String
        }
      ]
    }
  ],

  approvedBy: ObjectId,
  approvedDate: Date,

  createdAt: Date,
  updatedAt: Date
}
```

---

## RELATIONSHIPS SUMMARY

### Primary Relationships:
- users → departments (Many-to-One)
- users → campus_coins_wallets (One-to-One)
- assignments → users (faculty) (Many-to-One)
- assignment_submissions → assignments (Many-to-One)
- assignment_submissions → users (student) (Many-to-One)
- attendance → users (student) (One-to-One)
- attendance_records → users (faculty) (Many-to-One)
- marks → users (student) (Many-to-One)
- results → users (student) (Many-to-One)
- gate_pass_requests → users (student) (Many-to-One)
- leave_requests → users (faculty) (Many-to-One)
- event_requests → clubs (Many-to-One)
- events → clubs (Many-to-One)
- event_participants → events (Many-to-One)
- event_participants → users (Many-to-One)
- club_members → clubs (Many-to-One)
- club_members → users (Many-to-One)
- hostel_allocations → users (student) (One-to-One)
- hostel_allocations → hostel_rooms (Many-to-One)
- orders → users (student) (Many-to-One)
- orders → canteen_stalls (Many-to-One)
- menu_items → canteen_stalls (Many-to-One)
- transactions → campus_coins_wallets (Many-to-One)
- facility_bookings → sports_facilities (Many-to-One)
- facility_bookings → users (Many-to-One)
- notifications → users (Many-to-One)
- achievements → users (Many-to-One)

---

## INDEXES REQUIRED (Performance Critical)

### Unique Indexes:
- users: email, userId
- departments: departmentId, code
- subjects: subjectCode
- assignments: assignmentId
- gate_pass_requests: requestId
- leave_requests: requestId
- event_requests: requestId
- orders: orderNumber
- transactions: transactionId
- campus_coins_wallets: userId

### Compound Indexes:
- attendance: { studentId: 1, semester: 1 }
- attendance_records: { date: 1, subject: 1, class: 1 }
- marks: { studentId: 1, semester: 1, subject: 1 }
- orders: { studentId: 1, orderDate: -1 }
- transactions: { userId: 1, date: -1 }
- notifications: { userId: 1, isRead: 1, createdAt: -1 }
- facility_bookings: { facilityId: 1, bookingDate: 1 }

---

**Total Collections: 45**
**Total Entities: 50+**
**Total Relationships: 30+**

This schema is optimized for:
✅ CRUD operations
✅ Query performance
✅ Data integrity
✅ Scalability
✅ Flexible structure

**Ready for implementation!** 🚀
