# Co-Campus: Complete Campus Management System PRD
## Comprehensive Product Requirements Document - Version 5.0
### Including All Portals with AI-Ready Specifications

---

## TABLE OF CONTENTS

1. **Executive Summary**
2. **System Architecture**
3. **Student Portal** (Complete Specifications)
4. **Faculty Portal** (Complete Specifications)
5. **HOD Portal** (Complete Specifications)
6. **Principal Portal** (Complete Specifications)
7. **Admin Portal** (Complete Specifications)
8. **Club Portal** (Complete Specifications)
9. **Canteen Portal** (Complete Specifications)
10. **Hostel Portal** (Complete Specifications)
11. **Guest Portal** (Sports Booking System)
12. **Campus Coins System**
13. **Integration Workflows**
14. **Technical Specifications**
15. **Implementation Roadmap**

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Vision
Co-Campus is a comprehensive campus management platform that streamlines educational institution operations by connecting students, faculty, administration, campus services, and external guests through a unified digital system. The platform focuses on practical, essential features that solve real campus challenges while providing revenue generation opportunities through facility booking.

### 1.2 Core Objectives
- **Unified Platform**: Single system for all campus stakeholders including guests
- **Digital Operations**: Complete paperless campus management
- **Process Automation**: Streamline all administrative tasks
- **Campus Economy**: Digital payment system via Campus Coins
- **Real-time Communication**: Instant updates and notifications
- **Revenue Generation**: Monetize sports facilities through guest bookings
- **Data-Driven Decisions**: Analytics and reporting for informed management

### 1.3 User Roles
```javascript
const userRoles = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  HOD: 'hod',
  PRINCIPAL: 'principal',
  ADMIN: 'admin',
  CLUB_ADMIN: 'club_admin',
  CANTEEN_VENDOR: 'canteen_vendor',
  HOSTEL_WARDEN: 'hostel_warden',
  GUEST: 'guest'
};
```

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Portal Structure
```
Principal Portal ←→ HOD Portal ←→ Faculty Portal
       ↓                ↓              ↓
   Admin Portal ←→ Student Portal ←→ Club Portal
       ↓                ↓              ↓
 Canteen Portal ←→ Campus Coins ←→ Hostel Portal
       ↓
  Guest Portal (Sports Booking System)
```

### 2.2 Technology Stack
- **Frontend**: React Native (mobile), React.js (web)
- **Backend**: Node.js with microservices architecture
- **Database**: PostgreSQL (primary), MongoDB (documents), Redis (caching)
- **Authentication**: JWT with OTP verification
- **Payment Gateway**: Razorpay/Stripe integration
- **Real-time Updates**: WebSocket for live notifications
- **Cloud Infrastructure**: AWS/Azure with auto-scaling
- **Notifications**: Firebase Cloud Messaging

---

## 3. STUDENT PORTAL - DETAILED SPECIFICATIONS

### 3.1 Student Dashboard

```javascript
const StudentDashboard = {
  layout: "grid",
  columns: 3,
  gap: "20px",
  padding: "20px",
  
  widgets: [
    {
      id: "welcome_card",
      gridColumn: "span 3",
      height: "120px",
      background: "gradient",
      content: {
        greeting: "Good {timeOfDay}, {studentName}!",
        subtitle: "Roll No: {rollNumber} | {department} | Semester {semester}",
        todayClasses: "You have {count} classes today",
        nextClass: "Next: {subject} at {time} in {room}"
      }
    },
    {
      id: "attendance_card",
      gridColumn: "span 1",
      title: "Attendance",
      content: {
        percentage: {
          value: "attendance_percentage",
          fontSize: "36px",
          color: "conditional(>75:green, >65:orange, <65:red)"
        },
        subjects: {
          type: "list",
          items: "subject_attendance_list",
          showTop: 3
        },
        link: "/attendance/detailed"
      }
    },
    {
      id: "assignments_card",
      gridColumn: "span 1",
      title: "Pending Assignments",
      badge: "pending_count",
      content: {
        list: {
          items: "pending_assignments",
          fields: ["subject", "title", "due_date"],
          showTop: 5
        },
        button: {
          text: "View All",
          link: "/assignments"
        }
      }
    },
    {
      id: "campus_coins_card",
      gridColumn: "span 1",
      title: "Campus Coins",
      content: {
        balance: {
          value: "coin_balance",
          fontSize: "36px",
          prefix: "₹"
        },
        recentTransactions: {
          items: "last_3_transactions",
          fields: ["description", "amount", "time"]
        },
        buttons: [
          { text: "Add Coins", action: "open_add_coins_modal" },
          { text: "History", link: "/coins/history" }
        ]
      }
    }
  ]
};
```

### 3.2 Assignment Submission System

#### Features:
- **Assignment View Dashboard**
  - List of active assignments with due dates
  - Subject-wise categorization
  - Status indicators (Pending/Submitted/Graded)
  - Priority marking for urgent assignments

- **Submission Process**
  - Multiple file format support (PDF, DOC, ZIP)
  - File size limit: 50MB per submission
  - Submission confirmation with timestamp
  - Late submission tracking with remarks

```javascript
const AssignmentSubmissionModal = {
  size: "medium",
  title: "Submit Assignment: {assignment_title}",
  
  form: {
    fields: [
      {
        type: "file_upload",
        name: "assignment_file",
        label: "Upload Assignment",
        required: true,
        accept: ".pdf,.doc,.docx,.zip",
        maxSize: "50MB",
        multiple: false,
        dragDrop: true,
        preview: true
      },
      {
        type: "textarea",
        name: "comments",
        label: "Comments (Optional)",
        placeholder: "Add any comments or notes for the faculty",
        rows: 4,
        maxLength: 500,
        showCharCount: true
      },
      {
        type: "checkbox",
        name: "confirm_submission",
        label: "I confirm this is my original work",
        required: true
      }
    ],
    
    buttons: [
      {
        type: "cancel",
        text: "Cancel",
        variant: "outline"
      },
      {
        type: "submit",
        text: "Submit Assignment",
        variant: "primary",
        loadingText: "Submitting..."
      }
    ]
  }
};
```

#### Process Flow:
```
Student logs in → Views assignments dashboard → 
Selects assignment → Uploads file → 
Confirms submission → Receives confirmation → 
Faculty grades → Student views feedback & marks
```

### 3.3 Academic Calendar

```javascript
const AcademicCalendarPage = {
  layout: "full_width",
  
  header: {
    title: "Academic Calendar",
    viewToggle: ["Month", "Week", "Day", "List"],
    defaultView: "Month"
  },
  
  calendar: {
    type: "full_calendar",
    
    eventTemplate: {
      title: "{event_title}",
      time: "{start_time} - {end_time}",
      color: "{event_color}",
      onClick: "show_event_detail_modal"
    },
    
    dayTemplate: {
      showDate: true,
      maxEventsDisplay: 3,
      moreLink: true
    }
  }
};
```

### 3.4 Certificate Request System

#### Available Certificates:
- Bonafide certificate
- Semester memorandum  
- Character certificate
- Course completion certificate
- Transfer certificate
- Migration certificate
- Fee payment receipt

```javascript
const CertificateRequestForm = {
  fields: [
    {
      type: "select",
      name: "certificate_type",
      label: "Certificate Type",
      required: true,
      placeholder: "Select certificate type",
      options: [
        "Bonafide Certificate",
        "Semester Memorandum",
        "Character Certificate",
        "Course Completion Certificate",
        "Transfer Certificate",
        "Migration Certificate",
        "Fee Payment Receipt"
      ]
    },
    {
      type: "textarea",
      name: "purpose",
      label: "Purpose",
      required: true,
      placeholder: "Enter the purpose for requesting this certificate",
      rows: 3,
      maxLength: 200
    },
    {
      type: "number",
      name: "copies",
      label: "Number of Copies",
      required: true,
      min: 1,
      max: 5,
      defaultValue: 1
    },
    {
      type: "radio",
      name: "priority",
      label: "Processing Priority",
      required: true,
      options: [
        { value: "normal", label: "Normal", description: "Standard processing time" },
        { value: "urgent", label: "Urgent", description: "50% faster (Additional ₹100)" }
      ],
      defaultValue: "normal"
    }
  ]
};
```

### 3.5 Events Management

```javascript
const EventsPage = {
  header: {
    title: "Campus Events",
    tabs: [
      { id: "all", label: "All Events" },
      { id: "college", label: "College Events" },
      { id: "clubs", label: "Club Events" },
      { id: "registered", label: "My Registrations" }
    ]
  },
  
  eventCard: {
    content: {
      badge: "{event_category}",
      title: "{event_name}",
      organizer: "By {organizing_club}",
      
      details: [
        { icon: "calendar", text: "{event_date}" },
        { icon: "clock", text: "{event_time}" },
        { icon: "location", text: "{venue}" },
        { icon: "users", text: "{registered_count}/{max_capacity} registered" }
      ],
      
      fee: {
        show: true,
        text: "Registration Fee: ₹{fee_amount}",
        freeText: "Free Entry"
      }
    },
    
    actions: {
      buttons: [
        {
          text: "View Details",
          variant: "outline",
          action: "open_event_modal"
        },
        {
          text: "Register",
          variant: "primary",
          action: "register_for_event",
          condition: "!is_registered && status === 'upcoming'"
        }
      ]
    }
  }
};
```

### 3.6 Feedback System

#### Feedback Categories:
- **Faculty Feedback**: Teaching methodology, Subject knowledge, Punctuality, Student interaction
- **Infrastructure Feedback**: Classroom facilities, Laboratory equipment, Library resources
- **Hostel Services Feedback**: Room conditions, Mess quality, Hostel staff

```javascript
const FacultyFeedbackForm = {
  anonymous: true,
  
  sections: [
    {
      title: "Teaching Effectiveness",
      questions: [
        {
          type: "rating",
          name: "teaching_clarity",
          label: "Clarity in teaching and explanation",
          required: true,
          scale: 5,
          labels: ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
          type: "rating",
          name: "subject_knowledge",
          label: "Subject knowledge and expertise",
          required: true,
          scale: 5
        }
      ]
    },
    {
      title: "Additional Comments",
      questions: [
        {
          type: "textarea",
          name: "suggestions",
          label: "Suggestions for improvement (Optional)",
          rows: 4,
          maxLength: 500
        }
      ]
    }
  ]
};
```

### 3.7 Fee Management

```javascript
const FeeManagement = {
  feeCategories: [
    "Regular semester fee",
    "Supply/supplementary exam fee",
    "Re-evaluation fee",
    "Condonation fee",
    "Transcript fee",
    "Fine payments"
  ],
  
  paymentForm: {
    fields: [
      {
        type: "select",
        name: "fee_type",
        label: "Fee Type",
        required: true,
        options: "feeCategories"
      },
      {
        type: "number",
        name: "amount",
        label: "Amount",
        required: true,
        prefix: "₹",
        disabled: "auto_calculated"
      },
      {
        type: "radio",
        name: "payment_method",
        label: "Payment Method",
        required: true,
        options: [
          { value: "online_banking", label: "Online Banking", icon: "bank" },
          { value: "debit_card", label: "Debit Card", icon: "card" },
          { value: "credit_card", label: "Credit Card", icon: "card" },
          { value: "upi", label: "UPI", icon: "upi" }
        ]
      }
    ]
  }
};
```

### 3.8 Hostel Integration

#### Features:
- **Weekly Menu Preview**: Breakfast, lunch, dinner menus with day-wise display
- **Gate Pass System**: Digital pass request with parent notification
- **Room Services**: Maintenance requests, Roommate information, Laundry scheduling

### 3.9 Notice Board

```javascript
const NoticeBoard = {
  categories: [
    "Academic notices",
    "Examination updates",
    "Fee reminders",
    "Event announcements",
    "Placement notifications",
    "General circulars"
  ],
  
  features: {
    filtering: "department_wise",
    sorting: "date_wise",
    pinning: "important_notices",
    attachments: "downloadable",
    notifications: "push_for_urgent"
  }
};
```

### 3.10 Results Portal

```javascript
const ResultsPortal = {
  resultTypes: [
    "Mid-1 examination marks",
    "Mid-2 examination marks",
    "Internal assessment marks",
    "Final semester results",
    "Cumulative results",
    "CGPA calculation"
  ],
  
  marksTable: {
    columns: [
      { key: "subject_code", label: "Code", width: "10%" },
      { key: "subject_name", label: "Subject", width: "30%" },
      { key: "credits", label: "Credits", width: "10%" },
      { key: "mid1", label: "Mid-1 (30)", width: "10%" },
      { key: "mid2", label: "Mid-2 (30)", width: "10%" },
      { key: "internal", label: "Internal (40)", width: "10%" },
      { key: "total", label: "Total (100)", width: "10%" },
      { key: "grade", label: "Grade", width: "10%", badge: true }
    ]
  }
};
```

### 3.11 Campus Commerce (Canteen)

```javascript
const CanteenPage = {
  stallCategories: [
    "Main canteen",
    "Snacks corner",
    "Juice center",
    "Bakery",
    "Tea/Coffee stall",
    "Fast food outlets"
  ],
  
  orderingProcess: {
    steps: [
      "Browse stalls",
      "Select items",
      "Add to cart",
      "Choose pickup time",
      "Pay with Campus Coins",
      "Receive order number",
      "Pickup notification",
      "Collect order"
    ]
  },
  
  menuItem: {
    display: {
      image: "{item_image}",
      name: "{item_name}",
      description: "{item_description}",
      price: "₹{item_price}",
      rating: "{item_rating}"
    },
    
    actions: {
      quantitySelector: {
        type: "counter",
        min: 0,
        max: 10
      },
      addButton: "Add to Cart"
    }
  }
};
```

### 3.12 Gate Pass (Day Scholars)

```javascript
const GatePassRequest = {
  passTypes: [
    "Medical emergency",
    "Family function",
    "Official work",
    "Early departure",
    "Late arrival"
  ],
  
  requiredFields: [
    {
      type: "select",
      name: "pass_type",
      label: "Reason for Leave",
      required: true
    },
    {
      type: "datetime",
      name: "duration",
      label: "Duration",
      required: true
    },
    {
      type: "tel",
      name: "parent_contact",
      label: "Parent Contact",
      required: true
    },
    {
      type: "file_upload",
      name: "supporting_docs",
      label: "Supporting Documents",
      condition: "if_required"
    }
  ]
};
```

### 3.13 Achievement Upload

```javascript
const AchievementUpload = {
  categories: [
    "Academic excellence",
    "Sports achievements",
    "Cultural activities",
    "Technical competitions",
    "Research publications",
    "Certifications",
    "Internships"
  ],
  
  uploadForm: {
    fields: [
      {
        type: "select",
        name: "achievement_type",
        label: "Achievement Type",
        required: true
      },
      {
        type: "file_upload",
        name: "certificate",
        label: "Upload Certificate/Proof",
        required: true,
        accept: ".pdf,.jpg,.png",
        maxSize: "5MB"
      },
      {
        type: "textarea",
        name: "description",
        label: "Description",
        rows: 4,
        maxLength: 500
      },
      {
        type: "radio",
        name: "visibility",
        label: "Visibility",
        options: ["Public", "Private"],
        defaultValue: "Public"
      }
    ]
  }
};
```

---

## 4. FACULTY PORTAL - DETAILED SPECIFICATIONS

### 4.1 Faculty Dashboard

```javascript
const FacultyDashboard = {
  header: {
    greeting: "Welcome, {faculty_name}",
    subtitle: "Department: {department} | Employee ID: {employee_id}"
  },
  
  todaySchedule: {
    title: "Today's Schedule",
    type: "timeline",
    
    items: [
      {
        time: "{class_time}",
        title: "{subject_name}",
        subtitle: "Class: {class_section} | Room: {room_number}",
        status: "{status}",
        actions: [
          { text: "Take Attendance", icon: "check" },
          { text: "View Students", icon: "users" }
        ]
      }
    ]
  },
  
  statsCards: [
    {
      title: "Classes Today",
      value: "{today_classes_count}",
      icon: "calendar"
    },
    {
      title: "Pending Evaluations",
      value: "{pending_evaluations}",
      icon: "edit"
    },
    {
      title: "Leave Balance",
      value: "{leave_balance}",
      icon: "briefcase"
    },
    {
      title: "Students Taught",
      value: "{total_students}",
      icon: "users"
    }
  ]
};
```

### 4.2 Attendance Management (Manual System)

```javascript
const AttendanceMarkingPage = {
  classSelector: {
    layout: "horizontal",
    fields: [
      {
        type: "date",
        name: "attendance_date",
        label: "Date",
        defaultValue: "today",
        max: "today"
      },
      {
        type: "select",
        name: "class_section",
        label: "Class & Section",
        required: true,
        options: "assigned_classes",
        placeholder: "Select Class"
      },
      {
        type: "select",
        name: "subject",
        label: "Subject",
        required: true,
        options: "assigned_subjects",
        placeholder: "Select Subject"
      },
      {
        type: "select",
        name: "session_type",
        label: "Session Type",
        required: true,
        options: ["Regular", "Extra Class", "Substitution"],
        defaultValue: "Regular"
      }
    ]
  },
  
  studentList: {
    table: {
      columns: [
        { key: "roll_no", label: "Roll No", width: "10%" },
        { key: "student_name", label: "Student Name", width: "30%" },
        { key: "photo", label: "Photo", width: "10%", type: "image" },
        { key: "attendance_percentage", label: "Attendance %", width: "15%" },
        { key: "status", label: "Status", width: "20%" },
        { key: "remarks", label: "Remarks", width: "15%" }
      ],
      
      rowTemplate: {
        status: {
          type: "button_group",
          buttons: [
            {
              text: "P",
              value: "present",
              color: "green",
              tooltip: "Present"
            },
            {
              text: "A",
              value: "absent",
              color: "red",
              tooltip: "Absent"
            },
            {
              text: "L",
              value: "late",
              color: "orange",
              tooltip: "Late"
            }
          ],
          defaultValue: "present"
        }
      }
    }
  }
};
```

#### Process Flow:
```
Faculty login → Select class details → 
Student list loads → Mark attendance individually → 
Save attendance → Auto-calculate percentages → 
Generate reports
```

### 4.3 Marks Upload System

```javascript
const MarksUploadSystem = {
  evaluationTypes: [
    { value: "mid1", label: "Mid-1 Exam", maxMarks: 30 },
    { value: "mid2", label: "Mid-2 Exam", maxMarks: 30 },
    { value: "internal", label: "Internal Assessment", maxMarks: 40 },
    { value: "assignment", label: "Assignment", maxMarks: "custom" },
    { value: "lab", label: "Lab Evaluation", maxMarks: "custom" }
  ],
  
  marksEntry: {
    bulkUpload: {
      enabled: true,
      formats: [".xlsx", ".csv"],
      template: "downloadable"
    },
    
    manualEntry: {
      type: "table",
      validation: {
        min: 0,
        max: "max_marks",
        decimal: true
      }
    }
  }
};
```

### 4.4 Timetable Management

```javascript
const FacultyTimetable = {
  views: ["Week", "Day", "Month"],
  
  features: {
    substitutionRequest: true,
    extraClassScheduling: true,
    roomBooking: true,
    conflictDetection: true
  }
};
```

### 4.5 Assignment Management

```javascript
const AssignmentCreation = {
  form: {
    fields: [
      {
        type: "text",
        name: "title",
        label: "Assignment Title",
        required: true,
        maxLength: 100
      },
      {
        type: "textarea",
        name: "description",
        label: "Description",
        required: true,
        rows: 5
      },
      {
        type: "file_upload",
        name: "question_paper",
        label: "Upload Questions/Resources",
        accept: ".pdf,.doc,.docx",
        maxSize: "10MB"
      },
      {
        type: "datetime",
        name: "deadline",
        label: "Submission Deadline",
        required: true,
        min: "today"
      },
      {
        type: "number",
        name: "max_marks",
        label: "Maximum Marks",
        required: true
      },
      {
        type: "checkbox",
        name: "late_submission",
        label: "Allow Late Submission",
        defaultValue: false
      }
    ]
  }
};
```

### 4.6 Leave Management

```javascript
const LeaveApplication = {
  leaveTypes: [
    "Casual leave",
    "Medical leave",
    "Duty leave",
    "Academic leave",
    "Emergency leave"
  ],
  
  applicationForm: {
    fields: [
      {
        type: "select",
        name: "leave_type",
        label: "Leave Type",
        required: true
      },
      {
        type: "date_range",
        name: "leave_dates",
        label: "Leave Period",
        required: true
      },
      {
        type: "textarea",
        name: "reason",
        label: "Reason",
        required: true,
        rows: 4
      },
      {
        type: "file_upload",
        name: "documents",
        label: "Supporting Documents",
        condition: "medical_leave"
      },
      {
        type: "select",
        name: "substitute",
        label: "Suggest Substitute Faculty",
        options: "department_faculty_list"
      }
    ]
  }
};
```

### 4.7 Payroll Dashboard

```javascript
const PayrollDashboard = {
  sections: [
    {
      title: "Monthly Salary Slip",
      downloadable: true,
      fields: ["basic_pay", "allowances", "deductions", "net_pay"]
    },
    {
      title: "Tax Information",
      fields: ["tax_deducted", "tax_declaration", "form_16"]
    },
    {
      title: "Leave Balance",
      fields: ["casual_leave", "medical_leave", "earned_leave"]
    }
  ]
};
```

---

## 5. HEAD OF DEPARTMENT (HOD) PORTAL

### 5.1 HOD Dashboard

```javascript
const HODDashboard = {
  header: {
    title: "Department Head Dashboard",
    department: "{department_name}",
    academicYear: "{current_academic_year}"
  },
  
  departmentStats: {
    cards: [
      {
        title: "Total Faculty",
        value: "{faculty_count}",
        subtext: "{present_today} present today"
      },
      {
        title: "Total Students",
        value: "{student_count}",
        subtext: "Across {sections_count} sections"
      },
      {
        title: "Pending Approvals",
        value: "{pending_approvals}",
        subtext: "{leave_requests} leaves, {gate_passes} passes"
      },
      {
        title: "Department Rating",
        value: "{department_rating}/5",
        subtext: "Based on feedback"
      }
    ]
  }
};
```

### 5.2 Faculty Management

```javascript
const FacultyManagement = {
  facultyList: {
    table: {
      columns: [
        { key: "faculty_id", label: "ID", width: "10%" },
        { key: "faculty_name", label: "Name", width: "25%" },
        { key: "designation", label: "Designation", width: "20%" },
        { key: "subjects", label: "Subjects", width: "25%" },
        { key: "workload", label: "Workload", width: "10%" },
        { key: "actions", label: "Actions", width: "10%" }
      ]
    }
  },
  
  subjectAllocation: {
    form: {
      fields: [
        {
          type: "select",
          name: "faculty",
          label: "Select Faculty",
          required: true,
          searchable: true
        },
        {
          type: "multiselect",
          name: "subjects",
          label: "Assign Subjects",
          required: true,
          options: "available_subjects"
        },
        {
          type: "multiselect",
          name: "classes",
          label: "Assign Classes",
          required: true,
          options: "department_classes"
        }
      ]
    }
  }
};
```

### 5.3 Leave Approval System

#### Process Flow:
```
Receive leave request → Review application → 
Check department strength → Verify substitute → 
Approve/Reject with remarks → Update all stakeholders
```

### 5.4 Student Performance Monitoring

```javascript
const StudentPerformance = {
  analytics: {
    metrics: [
      "Class-wise performance",
      "Subject-wise analysis",
      "Individual student tracking",
      "Attendance correlation",
      "Semester comparison"
    ]
  },
  
  reports: {
    types: [
      "Top performers list",
      "Students needing attention",
      "Department performance",
      "Comparative analysis"
    ]
  }
};
```

### 5.5 Timetable Assignment

```javascript
const TimetableManagement = {
  features: {
    dragDrop: true,
    conflictDetection: true,
    facultyPreferences: true,
    roomAvailability: true,
    labScheduling: true
  }
};
```

### 5.6 Resource Management

```javascript
const ResourceCategories = {
  laboratory: {
    items: ["Equipment", "Chemicals", "Software licenses"],
    tracking: ["Inventory", "Maintenance", "Usage"]
  },
  
  classroom: {
    items: ["Projectors", "Computers", "Furniture"],
    tracking: ["Condition", "Allocation", "Repairs"]
  },
  
  budget: {
    management: ["Fund allocation", "Expense tracking", "Purchase requests"]
  }
};
```

### 5.7 Gate Pass Approvals

```javascript
const GatePassApproval = {
  workflow: {
    steps: [
      "View pending requests",
      "Review student reason",
      "Check attendance record",
      "Approve/Reject",
      "Add remarks"
    ]
  }
};
```

---

## 6. PRINCIPAL PORTAL

### 6.1 Executive Dashboard

```javascript
const PrincipalDashboard = {
  header: {
    title: "Principal Dashboard",
    institution: "{institution_name}",
    greeting: "Good {timeOfDay}, {principal_name}"
  },
  
  institutionMetrics: {
    cards: [
      {
        title: "Total Strength",
        metrics: [
          { label: "Students", value: "{total_students}" },
          { label: "Faculty", value: "{total_faculty}" },
          { label: "Staff", value: "{total_staff}" }
        ]
      },
      {
        title: "Academic Performance",
        metrics: [
          { label: "Pass %", value: "{pass_percentage}" },
          { label: "Average CGPA", value: "{average_cgpa}" },
          { label: "Toppers", value: "{toppers_count}" }
        ]
      },
      {
        title: "Financial Overview",
        metrics: [
          { label: "Fee Collection", value: "₹{fee_collected}" },
          { label: "Pending Dues", value: "₹{pending_dues}" },
          { label: "Budget Utilized", value: "{budget_percentage}%" }
        ]
      }
    ]
  }
};
```

### 6.2 Department Management

```javascript
const DepartmentManagement = {
  overview: {
    table: {
      columns: [
        { key: "department", label: "Department" },
        { key: "hod", label: "HOD" },
        { key: "faculty_count", label: "Faculty" },
        { key: "student_count", label: "Students" },
        { key: "performance_score", label: "Performance", type: "progress" }
      ]
    }
  },
  
  actions: {
    viewDetails: true,
    comparePerformance: true,
    allocateResources: true,
    generateReports: true
  }
};
```

### 6.3 Performance Analytics

```javascript
const InstitutionAnalytics = {
  metrics: [
    "Faculty performance ratings",
    "Student satisfaction scores",
    "Academic results analysis",
    "Research output",
    "Department rankings"
  ],
  
  reports: {
    frequency: ["Monthly", "Quarterly", "Annual"],
    formats: ["Dashboard", "PDF", "Excel"]
  }
};
```

### 6.4 Event Approvals

#### Process Flow:
```
Receive event proposal → Review budget → 
Check venue availability → Assess resources → 
Approve/Reject → Provide feedback
```

### 6.5 Club Management

```javascript
const ClubManagement = {
  features: {
    viewAllClubs: true,
    memberLists: true,
    activityTracking: true,
    budgetAllocation: true,
    performanceMonitoring: true
  }
};
```

---

## 7. ADMIN PORTAL

### 7.1 User Management

```javascript
const UserManagement = {
  operations: {
    crud: ["Create", "Read", "Update", "Delete"],
    bulk: ["Import", "Export", "Update", "Delete"],
    
    userForm: {
      fields: [
        {
          type: "text",
          name: "user_id",
          label: "User ID",
          required: true,
          pattern: "[A-Z0-9]{6,10}"
        },
        {
          type: "text",
          name: "full_name",
          label: "Full Name",
          required: true
        },
        {
          type: "email",
          name: "email",
          label: "Email",
          required: true
        },
        {
          type: "select",
          name: "role",
          label: "Role",
          required: true,
          options: "all_roles"
        },
        {
          type: "select",
          name: "department",
          label: "Department",
          required: true,
          options: "all_departments"
        },
        {
          type: "password",
          name: "password",
          label: "Initial Password",
          required: true,
          generateButton: true
        }
      ]
    }
  }
};
```

### 7.2 System Configuration

```javascript
const SystemSettings = {
  configurations: [
    "Academic year setup",
    "Fee structure configuration",
    "Grading system",
    "Attendance rules",
    "Holiday calendar",
    "Notification templates",
    "Email/SMS configuration"
  ]
};
```

### 7.3 Data Management

```javascript
const DataManagement = {
  operations: {
    import: {
      formats: [".csv", ".xlsx", ".json"],
      validation: true,
      preview: true
    },
    
    export: {
      formats: ["CSV", "Excel", "PDF"],
      scheduling: true
    },
    
    backup: {
      frequency: "Daily",
      retention: "30 days",
      restoration: true
    }
  }
};
```

### 7.4 Security Management

```javascript
const SecuritySettings = {
  features: [
    "Access logs monitoring",
    "Security policies configuration",
    "Password policies",
    "Session management",
    "Audit trails",
    "IP whitelisting",
    "Two-factor authentication"
  ]
};
```

---

## 8. CLUB PORTAL

### 8.1 Member Management

```javascript
const ClubMemberManagement = {
  database: {
    fields: [
      "member_id",
      "name",
      "role",
      "department",
      "contact",
      "joining_date",
      "status"
    ]
  },
  
  registration: {
    process: [
      "Online application",
      "Review by club admin",
      "Interview/Selection",
      "Member onboarding",
      "ID card generation"
    ]
  }
};
```

### 8.2 Event Organization

```javascript
const ClubEventManagement = {
  eventCreation: {
    fields: [
      {
        type: "text",
        name: "event_name",
        label: "Event Name",
        required: true
      },
      {
        type: "textarea",
        name: "description",
        label: "Event Description",
        required: true
      },
      {
        type: "datetime",
        name: "event_date",
        label: "Event Date & Time",
        required: true
      },
      {
        type: "text",
        name: "venue",
        label: "Venue",
        required: true
      },
      {
        type: "number",
        name: "budget",
        label: "Budget Required",
        prefix: "₹"
      },
      {
        type: "number",
        name: "max_participants",
        label: "Maximum Participants"
      }
    ]
  },
  
  approvalFlow: [
    "Create proposal",
    "Submit to Principal",
    "Review and approval",
    "Budget allocation",
    "Event execution",
    "Report submission"
  ]
};
```

### 8.3 Financial Management

```javascript
const ClubFinances = {
  tracking: {
    income: ["Member fees", "Sponsorships", "College funding"],
    expenses: ["Events", "Equipment", "Workshops", "Miscellaneous"]
  },
  
  reports: {
    frequency: "Monthly",
    approvals: "Faculty advisor",
    submission: "Principal"
  }
};
```

---

## 9. CANTEEN PORTAL

### 9.1 Stall Registration

```javascript
const StallRegistration = {
  requirements: {
    documents: [
      "Business license",
      "Food safety certificate",
      "Owner ID proof",
      "Bank details",
      "Menu with pricing"
    ]
  },
  
  registrationForm: {
    fields: [
      {
        type: "text",
        name: "business_name",
        label: "Business Name",
        required: true
      },
      {
        type: "text",
        name: "owner_name",
        label: "Owner Name",
        required: true
      },
      {
        type: "file_upload",
        name: "license",
        label: "Upload License",
        required: true,
        accept: ".pdf,.jpg"
      },
      {
        type: "tel",
        name: "contact",
        label: "Contact Number",
        required: true
      },
      {
        type: "text",
        name: "bank_account",
        label: "Bank Account Number",
        required: true
      }
    ]
  }
};
```

### 9.2 Product Management

```javascript
const MenuManagement = {
  operations: {
    addItem: {
      fields: [
        "item_name",
        "category",
        "price",
        "description",
        "image",
        "availability"
      ]
    },
    
    pricing: {
      currency: "Campus Coins",
      conversion: "1 Coin = ₹1",
      updates: "Real-time"
    }
  }
};
```

### 9.3 Order Management

```javascript
const OrderSystem = {
  flow: [
    "Receive order",
    "Confirm order",
    "Prepare food",
    "Mark ready",
    "Customer pickup",
    "Complete transaction"
  ],
  
  features: {
    realTimeQueue: true,
    estimatedTime: true,
    orderHistory: true,
    dailySummary: true
  }
};
```

### 9.4 Inventory Management

```javascript
const Inventory = {
  tracking: {
    items: ["Raw materials", "Packaging", "Beverages"],
    alerts: ["Low stock", "Expiry dates", "Reorder points"]
  }
};
```

---

## 10. HOSTEL PORTAL

### 10.1 Room Management

```javascript
const RoomManagement = {
  allocation: {
    process: [
      "Application submission",
      "Merit/lottery selection",
      "Room assignment",
      "Roommate matching",
      "Check-in process"
    ]
  },
  
  tracking: {
    occupancy: "Real-time",
    maintenance: "Scheduled",
    assets: "Per room inventory"
  }
};
```

### 10.2 Gate Pass System

```javascript
const HostelGatePass = {
  requestTypes: [
    "Regular outing",
    "Night pass",
    "Home visit",
    "Medical emergency",
    "Academic purpose"
  ],
  
  workflow: [
    "Student request",
    "Warden review",
    "Parent notification",
    "Pass generation",
    "Security verification",
    "Exit/Entry logging"
  ]
};
```

### 10.3 Mess Management

```javascript
const MessManagement = {
  features: {
    menuDisplay: {
      type: "Weekly",
      meals: ["Breakfast", "Lunch", "Snacks", "Dinner"]
    },
    
    feedback: {
      categories: ["Food quality", "Hygiene", "Service", "Menu variety"],
      frequency: "Weekly"
    },
    
    guestMeals: {
      booking: true,
      payment: "At counter"
    }
  }
};
```

### 10.4 Complaint Management

```javascript
const ComplaintSystem = {
  categories: [
    "Room maintenance",
    "Electrical issues",
    "Plumbing problems",
    "Internet connectivity",
    "Housekeeping"
  ],
  
  workflow: [
    "Raise complaint",
    "Ticket generation",
    "Staff assignment",
    "Work completion",
    "Student confirmation",
    "Ticket closure"
  ]
};
```

---

## 11. GUEST PORTAL (SPORTS BOOKING SYSTEM)

### 11.1 Guest Registration

```javascript
const GuestRegistration = {
  fields: [
    {
      type: "text",
      name: "full_name",
      label: "Full Name",
      required: true,
      minLength: 3,
      maxLength: 50
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      required: true,
      validation: "email"
    },
    {
      type: "tel",
      name: "phone",
      label: "Phone Number",
      required: true,
      pattern: "[0-9]{10}"
    },
    {
      type: "select",
      name: "id_proof_type",
      label: "ID Proof Type",
      required: true,
      options: ["Aadhaar Card", "PAN Card", "Driving License", "Passport"]
    },
    {
      type: "text",
      name: "id_proof_number",
      label: "ID Proof Number",
      required: true
    },
    {
      type: "textarea",
      name: "address",
      label: "Address",
      required: true,
      rows: 3,
      maxLength: 200
    },
    {
      type: "password",
      name: "password",
      label: "Create Password",
      required: true,
      minLength: 8,
      showStrength: true
    }
  ],
  
  verification: {
    email: true,
    adminApproval: true
  }
};
```

### 11.2 Sports Facilities

```javascript
const SportsFacilities = {
  cricket: {
    name: "Cricket Stadium",
    capacity: "22 players",
    surface: "Natural Turf",
    features: [
      "Practice Nets (4 lanes)",
      "Pavilion",
      "Electronic Scoreboard",
      "Floodlights"
    ],
    pricing: {
      regular: "₹5000/hour",
      premium: "₹7500/hour"
    }
  },
  
  volleyball: {
    name: "Volleyball Courts",
    quantity: 3,
    surface: "Synthetic",
    pricing: {
      perCourt: {
        regular: "₹800/hour",
        premium: "₹1200/hour"
      }
    }
  },
  
  kabaddi: {
    name: "Kabaddi Courts",
    quantity: 2,
    surface: "Clay/Mat",
    pricing: {
      perCourt: {
        regular: "₹600/hour",
        premium: "₹900/hour"
      }
    }
  },
  
  badminton: {
    name: "Badminton Courts",
    quantity: 6,
    type: "Indoor",
    features: ["AC", "Wooden floor"],
    pricing: {
      perCourt: {
        regular: "₹400/hour",
        premium: "₹600/hour"
      }
    }
  },
  
  tableTennis: {
    name: "Table Tennis",
    quantity: 8,
    location: "Indoor Complex",
    pricing: {
      perTable: {
        regular: "₹200/hour",
        premium: "₹300/hour"
      }
    }
  }
};
```

### 11.3 Booking System

```javascript
const BookingSystem = {
  process: [
    "Select facility",
    "Check availability",
    "Select date/time",
    "Choose court (if multiple)",
    "Add services (equipment, coaching)",
    "Review booking",
    "Make payment/Pay at venue",
    "Admin approval",
    "Confirmation"
  ],
  
  policies: {
    maxAdvanceBooking: "30 days",
    maxConsecutiveHours: 4,
    cancellation: {
      "24+ hours": "Full refund",
      "12-24 hours": "50% refund",
      "<12 hours": "No refund"
    }
  },
  
  paymentOptions: [
    "Online payment",
    "Pay at venue (requires approval)"
  ]
};
```

### 11.4 Admin Management for Guest Bookings

```javascript
const GuestBookingAdmin = {
  dashboard: {
    pendingApprovals: {
      table: {
        columns: [
          "booking_id",
          "guest_name",
          "facility",
          "date_time",
          "amount",
          "payment_status",
          "actions"
        ]
      }
    },
    
    approvalActions: [
      "View Details",
      "Check Availability",
      "Approve",
      "Reject",
      "Request More Info"
    ]
  },
  
  guestDatabase: {
    tracking: [
      "Total bookings",
      "Revenue generated",
      "Booking history",
      "Block/Unblock guests"
    ]
  }
};
```

---

## 12. CAMPUS COINS SYSTEM

### 12.1 Digital Wallet

```javascript
const CampusCoinsWallet = {
  features: {
    conversion: {
      rate: "1 Campus Coin = ₹1",
      minimum: 100,
      maximum: 10000
    },
    
    purchaseProcess: [
      "Initiate purchase",
      "Select amount",
      "Choose payment method",
      "Complete bank transfer",
      "Admin verification",
      "Coins credited"
    ],
    
    usage: [
      "Canteen payments",
      "Event registrations",
      "Certificate requests (urgent)",
      "Sports facility booking",
      "Any campus vendor"
    ]
  },
  
  security: {
    pin: true,
    transactionLimits: true,
    dailyCap: 5000,
    parentalControls: "optional"
  }
};
```

### 12.2 Transaction Management

```javascript
const TransactionSystem = {
  types: [
    "Credit (Add money)",
    "Debit (Spend)",
    "Transfer (Between students)",
    "Refund"
  ],
  
  tracking: {
    history: "Complete",
    receipts: "Downloadable",
    statements: "Monthly"
  }
};
```

---

## 13. KEY INTEGRATION WORKFLOWS

### 13.1 Assignment Submission Flow
```
Faculty creates → Students notified → View details → 
Upload work → System confirms → Faculty evaluates → 
Students view grades
```

### 13.2 Leave Application Flow (Faculty)
```
Faculty applies → HOD notification → HOD reviews → 
Department check → Approval/Rejection → Calendar update → 
Students notified
```

### 13.3 Event Organization Flow
```
Club plans → Create proposal → Principal review → 
Budget check → Approval → Registration opens → 
Campus Coins payment → Event conducted → Certificates issued
```

### 13.4 Gate Pass Flow (Hostel)
```
Student requests → Warden reviews → Manual approval → 
Parent notified → Pass generated → Security verification → 
Exit/Entry logged
```

### 13.5 Guest Booking Flow
```
Guest registers → Email verification → Browse facilities → 
Check availability → Book slots → Payment → 
Admin approval → Confirmation → Facility usage
```

### 13.6 Campus Coins Flow
```
Student initiates → Bank transfer → Admin verifies → 
Coins credited → Use at vendors → Transaction recorded
```

---

## 14. TECHNICAL SPECIFICATIONS

### 14.1 API Structure

```javascript
const APIEndpoints = {
  baseURL: "https://api.co-campus.edu",
  
  auth: {
    login: "POST /auth/login",
    logout: "POST /auth/logout",
    refreshToken: "POST /auth/refresh",
    verifyOTP: "POST /auth/verify-otp"
  },
  
  student: {
    dashboard: "GET /student/dashboard",
    assignments: "GET /student/assignments",
    results: "GET /student/results",
    certificates: "POST /student/certificates/request",
    fees: "GET /student/fees",
    events: "GET /student/events",
    campusCoins: "GET /student/coins/balance"
  },
  
  faculty: {
    dashboard: "GET /faculty/dashboard",
    attendance: "POST /faculty/attendance/mark",
    marks: "POST /faculty/marks/upload",
    assignments: "POST /faculty/assignments/create",
    leave: "POST /faculty/leave/apply"
  },
  
  guest: {
    register: "POST /guest/auth/register",
    facilities: "GET /guest/facilities",
    booking: "POST /guest/bookings",
    payment: "POST /guest/payments"
  }
};
```

### 14.2 Security Measures

```javascript
const Security = {
  authentication: {
    type: "JWT",
    expiry: "30 minutes",
    refresh: "7 days",
    mfa: "OTP verification"
  },
  
  encryption: {
    data: "AES-256",
    transmission: "HTTPS/TLS 1.3",
    storage: "Encrypted at rest"
  },
  
  rateLimit: {
    api: "100 requests/minute",
    login: "5 attempts/hour",
    registration: "3 per IP/hour"
  },
  
  compliance: {
    standards: ["GDPR", "PCI-DSS", "ISO 27001"],
    audit: "Quarterly",
    penetrationTesting: "Bi-annual"
  }
};
```

### 14.3 Performance Requirements

```javascript
const Performance = {
  response: {
    pageLoad: "< 2 seconds",
    apiResponse: "< 500ms",
    searchResults: "< 1 second"
  },
  
  scalability: {
    concurrentUsers: "5000+",
    databaseSize: "100GB+",
    fileStorage: "1TB+"
  },
  
  availability: {
    uptime: "99.9%",
    maintenanceWindow: "Sunday 2-4 AM",
    backup: "Daily incremental, Weekly full"
  }
};
```

### 14.4 Responsive Design

```javascript
const ResponsiveBreakpoints = {
  mobile: {
    max: "767px",
    columns: 1,
    navigation: "bottom_tabs"
  },
  
  tablet: {
    range: "768px-1023px",
    columns: 2,
    navigation: "collapsible_sidebar"
  },
  
  desktop: {
    range: "1024px-1439px",
    columns: 3,
    navigation: "fixed_sidebar"
  },
  
  largeDesktop: {
    min: "1440px",
    columns: 4,
    navigation: "fixed_sidebar"
  }
};
```

---

## 15. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Months 1-2)
- Core infrastructure setup
- Database design and setup
- Authentication system
- Admin portal development
- User management system

### Phase 2: Core Portals (Months 3-4)
- Student portal development
- Faculty portal development
- Basic features implementation
- Testing and debugging

### Phase 3: Management Portals (Months 5-6)
- HOD portal development
- Principal portal development
- Integration with existing portals
- Workflow implementation

### Phase 4: Service Portals (Months 7-8)
- Canteen portal development
- Hostel portal development
- Club portal development
- Campus Coins system

### Phase 5: Guest Portal & Integration (Months 9-10)
- Guest portal for sports booking
- Complete system integration
- End-to-end testing
- Performance optimization

### Phase 6: Deployment & Training (Months 11-12)
- Pilot deployment
- User training programs
- Feedback collection
- System refinement
- Full campus-wide launch

---

## 16. SUCCESS METRICS

### 16.1 Adoption Metrics
- User registration: 100% within first month
- Daily active users: 70% minimum
- Feature utilization: 60% of all features
- Mobile app downloads: 80% of users

### 16.2 Efficiency Metrics
- Paper reduction: 80%
- Process time reduction: 50%
- Query resolution time: < 4 hours
- Administrative cost savings: 30%

### 16.3 Financial Metrics
- Campus Coins adoption: 80% students
- Transaction volume: 500+ daily
- Sports facility booking revenue: ₹50,000+ monthly
- Cost savings: 25% administrative costs

### 16.4 Satisfaction Metrics
- Student satisfaction: > 4/5
- Faculty satisfaction: > 4/5
- Parent satisfaction: > 4/5
- Guest user satisfaction: > 4/5

---

## CONCLUSION

Co-Campus represents a complete digital transformation of campus operations, integrating:

1. **9 Primary Portals** for all stakeholder management
2. **Guest Portal** for external revenue generation
3. **Campus Coins** for cashless transactions
4. **100+ Modules** covering all campus operations
5. **Complete Automation** of administrative processes
6. **Real-time Analytics** for data-driven decisions
7. **Mobile-First Design** for accessibility
8. **Robust Security** ensuring data protection

This comprehensive PRD provides:
- ✅ Complete UI/UX specifications for every portal
- ✅ Detailed field definitions with validation rules
- ✅ Process workflows for all operations
- ✅ API structure and endpoints
- ✅ Security and compliance measures
- ✅ Implementation roadmap with timelines
- ✅ Success metrics for evaluation

The system is designed to be:
- **Scalable**: Grows with institution needs
- **Modular**: Portals can be implemented independently
- **User-Friendly**: Intuitive interfaces for all users
- **Secure**: Enterprise-grade security measures
- **Efficient**: Automates repetitive tasks
- **Integrated**: Seamless data flow between portals

---

*Document Version: 5.0 - Complete System PRD*
*Last Updated: November 2024*
*Status: Ready for Implementation*
*Purpose: Comprehensive guide for Co-Campus development*