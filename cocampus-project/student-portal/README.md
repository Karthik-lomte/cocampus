# Co-Campus Student Portal

A modern, beautiful, and feature-rich student portal for campus management. Built with React, Tailwind CSS, and Framer Motion.

## Features

### Dashboard
- **Welcome Card** with personalized greeting and next class information
- **Quick Stats** showing Attendance, Pending Assignments, Campus Coins balance, and CGPA
- **Pending Assignments** list with due dates and priorities
- **Recent Transactions** from Campus Coins wallet
- **Latest Notices** from campus administration

### Assignments
- View all assignments (pending, submitted, graded)
- Filter by status
- Submit assignments with file upload
- View grades and faculty feedback
- Priority indicators for urgent assignments

### Attendance
- Overall attendance percentage with visual indicators
- Subject-wise attendance breakdown
- Color-coded status (good, warning, danger)
- Detailed attendance records

### Results
- Semester-wise grade display
- CGPA and SGPA tracking
- Detailed marks breakdown (Mid-1, Mid-2, Internal, Total)
- Grade and performance tracking

### Events
- Browse campus and club events
- Filter by category (college, clubs, registered)
- Event registration with Campus Coins
- Event details with venue, date, and capacity information

### Canteen
- Browse multiple canteen stalls
- Menu with images, descriptions, and ratings
- Add items to cart
- Real-time cart total calculation
- Checkout with Campus Coins

### Campus Coins
- Digital wallet for campus transactions
- View balance and transaction history
- Add money to wallet
- Spending analytics by category
- Transaction categorization

### Timetable
- Weekly class schedule
- Today's classes highlight
- Subject, faculty, and room information
- Color-coded class types (Lecture, Lab, Activity)

### Notices
- View all campus notices
- Filter by category
- Pinned important notices
- Priority indicators
- Download attachments

### Profile
- Personal information
- Academic details
- Parent information
- Achievements showcase

## Technology Stack

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

## Installation

```bash
# Navigate to the student-portal directory
cd student-portal

# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Development Server

The application is currently running at: **http://localhost:5173/**

## Project Structure

```
student-portal/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar and header
│   ├── pages/
│   │   ├── Dashboard.jsx       # Dashboard page
│   │   ├── Assignments.jsx     # Assignments page
│   │   ├── Attendance.jsx      # Attendance page
│   │   ├── Results.jsx         # Results page
│   │   ├── Events.jsx          # Events page
│   │   ├── Canteen.jsx         # Canteen page
│   │   ├── CampusCoins.jsx     # Campus Coins page
│   │   ├── Timetable.jsx       # Timetable page
│   │   ├── Notices.jsx         # Notices page
│   │   └── Profile.jsx         # Profile page
│   ├── data/
│   │   ├── studentData.js      # Student information
│   │   ├── assignmentsData.js  # Assignments data
│   │   ├── attendanceData.js   # Attendance data
│   │   ├── eventsData.js       # Events data
│   │   ├── campusCoinsData.js  # Campus Coins data
│   │   ├── resultsData.js      # Results data
│   │   ├── canteenData.js      # Canteen data
│   │   ├── timetableData.js    # Timetable data
│   │   └── noticesData.js      # Notices data
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Demo Data

The application comes with comprehensive demo data:

- **Student**: Arjun Kumar (21CS101, CSE, Semester 5)
- **5 Assignments** with varying statuses
- **6 Subjects** with attendance tracking
- **6 Campus Events** (some registered, some open)
- **4 Canteen Stalls** with full menus
- **Campus Coins** wallet with ₹2,450 balance
- **Results** for 3 semesters with detailed marks
- **Weekly Timetable** with all class schedules
- **10 Notices** from various departments
- **2 Achievements** displayed in profile

## Key Features

### Beautiful UI/UX
- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive navigation
- Color-coded status indicators

### Interactive Components
- Animated page transitions
- Hover effects on cards
- Interactive charts and graphs
- Real-time data updates
- Smooth scrolling

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Collapsible sidebar on mobile
- Touch-friendly interface

## Color Scheme

- **Primary**: Blue (Dashboard, General UI)
- **Secondary**: Purple (Assignments, Academics)
- **Success**: Green (Attendance, Achievements)
- **Warning**: Orange/Yellow (Alerts, Pending)
- **Danger**: Red (Notices, Urgent)
- **Accent**: Amber (Campus Coins)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- Real backend integration
- User authentication
- Push notifications
- Dark mode
- Offline support
- Mobile app (React Native)
- PDF generation for certificates
- QR code for gate pass
- Biometric attendance

## License

This is a demo/prototype application for Co-Campus project.

## Contact

For any queries or suggestions, please contact the development team.

---

**Built with ❤️ for making campus life easier!**
