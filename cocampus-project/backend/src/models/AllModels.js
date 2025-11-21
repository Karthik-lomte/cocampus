/**
 * ALL MONGOOSE MODELS FOR CO-CAMPUS
 * This file contains all 45+ models needed for the system
 * You can split these into separate files if preferred
 */

const mongoose = require('mongoose');

// ============================================
// 1. USER & AUTHENTICATION MODELS
// ============================================

// User model is in separate file (User.js)

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: String,
  refreshToken: String,
  deviceInfo: {
    userAgent: String,
    ip: String,
    platform: String
  },
  expiresAt: Date
}, { timestamps: true });

const OTPVerificationSchema = new mongoose.Schema({
  email: String,
  phone: String,
  otp: String,
  purpose: {
    type: String,
    enum: ['login', 'signup', 'password_reset']
  },
  verified: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
}, { timestamps: true });

// ============================================
// 2. ACADEMIC MODELS
// ============================================

const DepartmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  hodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

const SubjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Theory', 'Lab', 'Elective'],
    required: true
  },
  semester: Number,
  department: String,
  syllabus: String,
  prerequisites: [String]
}, { timestamps: true });

const AssignmentSchema = new mongoose.Schema({
  assignmentId: {
    type: String,
    unique: true
  },
  title: String,
  description: String,
  subject: String,
  subjectCode: String,
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  facultyName: String,
  targetStudents: {
    department: String,
    semester: Number,
    section: String,
    class: String
  },
  assignedDate: Date,
  dueDate: Date,
  maxMarks: Number,
  allowLateSubmission: Boolean,
  lateSubmissionDeadline: Date,
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'graded'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  stats: {
    totalStudents: Number,
    submitted: Number,
    pending: Number,
    graded: Number
  }
}, { timestamps: true });

const AssignmentSubmissionSchema = new mongoose.Schema({
  submissionId: String,
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
  marksObtained: Number,
  feedback: String,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedDate: Date,
  status: {
    type: String,
    enum: ['submitted', 'graded', 'resubmit_required'],
    default: 'submitted'
  }
}, { timestamps: true });

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
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
    status: String
  },
  subjects: [{
    subjectCode: String,
    subjectName: String,
    facultyId: mongoose.Schema.Types.ObjectId,
    facultyName: String,
    totalClasses: Number,
    attended: Number,
    percentage: Number,
    status: String
  }],
  updatedAt: Date
});

const AttendanceRecordSchema = new mongoose.Schema({
  recordId: String,
  date: Date,
  subject: String,
  subjectCode: String,
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  facultyName: String,
  class: String,
  department: String,
  semester: Number,
  section: String,
  periodNumber: Number,
  sessionType: {
    type: String,
    enum: ['Regular', 'Extra Class', 'Substitution']
  },
  attendance: [{
    studentId: mongoose.Schema.Types.ObjectId,
    rollNumber: String,
    name: String,
    status: {
      type: String,
      enum: ['present', 'absent', 'late']
    },
    remarks: String
  }],
  stats: {
    totalStudents: Number,
    present: Number,
    absent: Number,
    late: Number
  },
  markedBy: mongoose.Schema.Types.ObjectId,
  markedAt: Date
}, { timestamps: true });

const MarksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
      uploadedBy: mongoose.Schema.Types.ObjectId
    },
    mid2: {
      marks: Number,
      maxMarks: Number,
      date: Date,
      uploadedBy: mongoose.Schema.Types.ObjectId
    },
    internal: {
      marks: Number,
      maxMarks: Number,
      date: Date,
      uploadedBy: mongoose.Schema.Types.ObjectId
    },
    final: {
      marks: Number,
      maxMarks: Number,
      date: Date,
      uploadedBy: mongoose.Schema.Types.ObjectId
    }
  },
  total: Number,
  grade: String,
  gradePoint: Number,
  status: {
    type: String,
    enum: ['pass', 'fail']
  }
}, { timestamps: true });

const ResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rollNumber: String,
  name: String,
  department: String,
  semester: Number,
  academicYear: String,
  subjects: [{
    subjectCode: String,
    subjectName: String,
    credits: Number,
    mid1: Number,
    mid2: Number,
    internal: Number,
    total: Number,
    grade: String,
    gradePoint: Number
  }],
  sgpa: Number,
  totalCredits: Number,
  status: {
    type: String,
    enum: ['pass', 'fail', 'pending']
  },
  cumulativeResults: {
    cgpa: Number,
    totalCreditsEarned: Number,
    totalSemestersCompleted: Number
  },
  publishedDate: Date
}, { timestamps: true });

// ============================================
// 3. APPROVAL & REQUEST MODELS
// ============================================

const GatePassRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  studentName: String,
  rollNumber: String,
  department: String,
  semester: Number,
  class: String,
  passType: {
    type: String,
    enum: ['medical', 'family', 'official', 'early_departure', 'late_arrival']
  },
  reason: String,
  date: Date,
  outTime: String,
  expectedReturn: String,
  actualReturn: String,
  parentContact: String,
  supportingDocuments: [{
    filename: String,
    url: String,
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  approvalWorkflow: [{
    approverRole: String,
    approverId: mongoose.Schema.Types.ObjectId,
    approverName: String,
    action: String,
    remarks: String,
    timestamp: Date
  }],
  verifications: {
    exitVerified: Boolean,
    exitTime: Date,
    exitGuardId: mongoose.Schema.Types.ObjectId,
    entryVerified: Boolean,
    entryTime: Date,
    entryGuardId: mongoose.Schema.Types.ObjectId
  },
  requestDate: Date,
  approvedDate: Date
}, { timestamps: true });

const LeaveRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  facultyName: String,
  employeeId: String,
  department: String,
  leaveType: {
    type: String,
    enum: ['casual', 'medical', 'duty', 'academic', 'emergency']
  },
  fromDate: Date,
  toDate: Date,
  totalDays: Number,
  reason: String,
  substituteArranged: String,
  substituteFacultyId: mongoose.Schema.Types.ObjectId,
  affectedClasses: [{
    date: Date,
    class: String,
    subject: String,
    period: Number
  }],
  supportingDocuments: [{
    filename: String,
    url: String,
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: mongoose.Schema.Types.ObjectId,
  approverName: String,
  approvalRemarks: String,
  approvedDate: Date,
  requestDate: Date
}, { timestamps: true });

const EventRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  clubName: String,
  basicDetails: {
    academicYear: String,
    quarter: String,
    programType: String,
    programTheme: String,
    activityName: String,
    duration: Number,
    modeOfDelivery: String,
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
    expenditureBreakdown: [{
      category: String,
      amount: Number,
      description: String
    }]
  },
  activityLedBy: String,
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
  status: {
    type: String,
    enum: ['draft', 'submitted', 'pending', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  approvalWorkflow: [{
    approverRole: String,
    approverId: mongoose.Schema.Types.ObjectId,
    approverName: String,
    action: String,
    remarks: String,
    timestamp: Date
  }],
  registrationOpen: Boolean,
  registrationDeadline: Date,
  maxRegistrations: Number,
  currentRegistrations: Number,
  submittedBy: mongoose.Schema.Types.ObjectId,
  submittedDate: Date,
  approvedDate: Date,
  completedDate: Date
}, { timestamps: true });

// ============================================
// 4. CLUB & EVENTS MODELS
// ============================================

const ClubSchema = new mongoose.Schema({
  clubId: {
    type: String,
    unique: true
  },
  name: String,
  category: String,
  description: String,
  logo: String,
  establishedYear: Number,
  leadership: {
    facultyAdvisor: mongoose.Schema.Types.ObjectId,
    facultyAdvisorName: String,
    president: mongoose.Schema.Types.ObjectId,
    presidentName: String,
    vicePresident: mongoose.Schema.Types.ObjectId,
    vicePresidentName: String,
    secretary: mongoose.Schema.Types.ObjectId,
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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

const ClubMemberSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rollNumber: String,
  name: String,
  email: String,
  phone: String,
  department: String,
  year: Number,
  role: {
    type: String,
    enum: ['member', 'core_member', 'lead', 'co-lead']
  },
  position: String,
  joiningDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'alumni'],
    default: 'active'
  },
  contributions: {
    eventsParticipated: Number,
    eventsOrganized: Number,
    achievementsEarned: Number
  }
}, { timestamps: true });

// ============================================
// 5. FINANCIAL MODELS
// ============================================

const CampusCoinsWalletSchema = new mongoose.Schema({
  walletId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  userType: String,
  balance: {
    type: Number,
    default: 0
  },
  stats: {
    totalEarned: Number,
    totalSpent: Number,
    monthlySpending: [{
      month: String,
      food: Number,
      events: Number,
      sports: Number,
      certificates: Number,
      other: Number,
      total: Number
    }]
  },
  limits: {
    dailySpendingLimit: Number,
    monthlySpendingLimit: Number
  },
  security: {
    pin: String,
    pinSetAt: Date,
    isPinEnabled: Boolean
  },
  status: {
    type: String,
    enum: ['active', 'frozen', 'suspended'],
    default: 'active'
  }
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true
  },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampusCoinsWallet'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['credit', 'debit']
  },
  category: {
    type: String,
    enum: ['topup', 'food', 'events', 'sports', 'certificates', 'transfer', 'refund']
  },
  amount: Number,
  description: String,
  orderId: mongoose.Schema.Types.ObjectId,
  eventId: mongoose.Schema.Types.ObjectId,
  bookingId: mongoose.Schema.Types.ObjectId,
  certificateId: mongoose.Schema.Types.ObjectId,
  vendor: {
    vendorId: mongoose.Schema.Types.ObjectId,
    vendorName: String,
    vendorType: String
  },
  topupDetails: {
    method: String,
    bankTransactionId: String,
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verifiedAt: Date
  },
  balanceBefore: Number,
  balanceAfter: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'reversed'],
    default: 'completed'
  },
  metadata: {
    ipAddress: String,
    deviceInfo: String,
    location: String
  },
  date: Date
}, { timestamps: true });

// ============================================
// 6. CANTEEN MODELS
// ============================================

const CanteenStallSchema = new mongoose.Schema({
  stallId: {
    type: String,
    unique: true
  },
  name: String,
  category: String,
  description: String,
  image: String,
  owner: {
    ownerId: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    email: String
  },
  operatingHours: {
    open: String,
    close: String,
    weekdays: [String]
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    upiId: String
  },
  documents: {
    license: String,
    foodSafetyCertificate: String
  }
}, { timestamps: true });

const MenuItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    unique: true
  },
  stallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CanteenStall'
  },
  stallName: String,
  name: String,
  description: String,
  category: String,
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
    availableFrom: String,
    availableTo: String,
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
  status: {
    type: String,
    enum: ['available', 'out_of_stock', 'discontinued'],
    default: 'available'
  }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  studentName: String,
  rollNumber: String,
  phone: String,
  stallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CanteenStall'
  },
  stallName: String,
  items: [{
    itemId: mongoose.Schema.Types.ObjectId,
    itemName: String,
    quantity: Number,
    price: Number,
    subtotal: Number,
    specialInstructions: String
  }],
  pricing: {
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number
  },
  payment: {
    method: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded']
    },
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
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupTime: String,
  estimatedTime: Number,
  rating: {
    stars: Number,
    review: String,
    ratedAt: Date
  },
  cancelledBy: String,
  cancellationReason: String
}, { timestamps: true });

// ============================================
// 7. SPORTS MODELS
// ============================================

const SportsFacilitySchema = new mongoose.Schema({
  facilityId: {
    type: String,
    unique: true
  },
  name: String,
  type: String,
  description: String,
  specifications: {
    surfaceType: String,
    capacity: Number,
    courts: Number,
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
    studentRate: Number,
    facultyRate: Number,
    guestRate: Number,
    premiumRate: Number
  },
  bookingRules: {
    maxAdvanceBooking: Number,
    minBookingDuration: Number,
    maxBookingDuration: Number,
    cancellationPolicy: String
  },
  stats: {
    totalBookings: Number,
    revenueGenerated: Number
  },
  maintenanceSchedule: [{
    date: Date,
    type: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['available', 'under_maintenance', 'closed'],
    default: 'available'
  }
}, { timestamps: true });

const FacilityBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SportsFacility'
  },
  facilityName: String,
  bookedBy: {
    userId: mongoose.Schema.Types.ObjectId,
    userType: String,
    name: String,
    email: String,
    phone: String,
    rollNumber: String
  },
  bookingDate: Date,
  timeSlot: {
    startTime: String,
    endTime: String,
    duration: Number
  },
  purpose: String,
  numberOfPeople: Number,
  courtNumber: Number,
  equipmentRequested: [String],
  pricing: {
    rateType: String,
    baseAmount: Number,
    additionalCharges: Number,
    total: Number
  },
  payment: {
    method: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded']
    },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  approvalRequired: Boolean,
  approvedBy: mongoose.Schema.Types.ObjectId,
  approvedAt: Date,
  checkIn: {
    time: Date,
    verifiedBy: mongoose.Schema.Types.ObjectId
  },
  checkOut: {
    time: Date,
    verifiedBy: mongoose.Schema.Types.ObjectId
  },
  cancellation: {
    cancelledBy: String,
    reason: String,
    cancelledAt: Date,
    refundAmount: Number
  }
}, { timestamps: true });

// ============================================
// 8. COMMUNICATION MODELS
// ============================================

const NoticeSchema = new mongoose.Schema({
  noticeId: {
    type: String,
    unique: true
  },
  title: String,
  content: String,
  category: {
    type: String,
    enum: ['academic', 'examination', 'fee', 'event', 'placement', 'general']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent']
  },
  attachment: {
    filename: String,
    url: String,
    size: Number
  },
  target: {
    departments: [String],
    semesters: [Number],
    roles: [String]
  },
  isPinned: Boolean,
  pinExpiresAt: Date,
  visibility: {
    showOnWebsite: Boolean,
    showInApp: Boolean,
    sendEmail: Boolean,
    sendPush: Boolean
  },
  publishedBy: mongoose.Schema.Types.ObjectId,
  publisherName: String,
  publishDate: Date,
  expiryDate: Date,
  stats: {
    views: Number,
    downloads: Number
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'expired', 'archived'],
    default: 'draft'
  }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  notificationId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['assignment', 'result', 'approval', 'payment', 'event', 'general']
  },
  title: String,
  message: String,
  data: {
    referenceId: mongoose.Schema.Types.ObjectId,
    referenceType: String,
    actionUrl: String
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high']
  },
  channels: {
    inApp: Boolean,
    email: Boolean,
    sms: Boolean,
    push: Boolean
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  deliveryStatus: {
    inApp: String,
    email: String,
    sms: String,
    push: String
  },
  expiresAt: Date
}, { timestamps: true });

const AchievementSchema = new mongoose.Schema({
  achievementId: String,
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  studentName: String,
  rollNumber: String,
  department: String,
  title: String,
  category: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'technical', 'research', 'certification', 'internship']
  },
  description: String,
  date: Date,
  certificate: {
    filename: String,
    url: String,
    size: Number
  },
  details: {
    organizer: String,
    level: String,
    position: String,
    teamSize: Number
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  verification: {
    isVerified: Boolean,
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verifiedAt: Date,
    remarks: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  uploadedDate: Date
}, { timestamps: true });

// ============================================
// EXPORT ALL MODELS
// ============================================

module.exports = {
  Session: mongoose.model('Session', SessionSchema),
  OTPVerification: mongoose.model('OTPVerification', OTPVerificationSchema),
  Department: mongoose.model('Department', DepartmentSchema),
  Subject: mongoose.model('Subject', SubjectSchema),
  Assignment: mongoose.model('Assignment', AssignmentSchema),
  AssignmentSubmission: mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema),
  Attendance: mongoose.model('Attendance', AttendanceSchema),
  AttendanceRecord: mongoose.model('AttendanceRecord', AttendanceRecordSchema),
  Marks: mongoose.model('Marks', MarksSchema),
  Result: mongoose.model('Result', ResultSchema),
  GatePassRequest: mongoose.model('GatePassRequest', GatePassRequestSchema),
  LeaveRequest: mongoose.model('LeaveRequest', LeaveRequestSchema),
  EventRequest: mongoose.model('EventRequest', EventRequestSchema),
  Club: mongoose.model('Club', ClubSchema),
  ClubMember: mongoose.model('ClubMember', ClubMemberSchema),
  CampusCoinsWallet: mongoose.model('CampusCoinsWallet', CampusCoinsWalletSchema),
  Transaction: mongoose.model('Transaction', TransactionSchema),
  CanteenStall: mongoose.model('CanteenStall', CanteenStallSchema),
  MenuItem: mongoose.model('MenuItem', MenuItemSchema),
  Order: mongoose.model('Order', OrderSchema),
  SportsFacility: mongoose.model('SportsFacility', SportsFacilitySchema),
  FacilityBooking: mongoose.model('FacilityBooking', FacilityBookingSchema),
  Notice: mongoose.model('Notice', NoticeSchema),
  Notification: mongoose.model('Notification', NotificationSchema),
  Achievement: mongoose.model('Achievement', AchievementSchema)
};
