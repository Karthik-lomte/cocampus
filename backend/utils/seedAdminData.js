import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import Notice from '../models/Notice.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Sample departments
const departments = [
  {
    name: 'Computer Science',
    code: 'CSE',
    hodName: 'Dr. Rajesh Kumar',
    facultyCount: 45,
    studentCount: 850,
    performance: 88,
    yearEstablished: 1995,
    email: 'cse@cocampus.edu',
    phone: '+91-9876543210',
    location: 'Block A, Room 101-120',
    vision: 'To be a globally recognized center of excellence in computer science education and research.',
    mission: 'To produce industry-ready professionals with strong technical foundations and ethical values.',
  },
  {
    name: 'Electronics & Communication',
    code: 'ECE',
    hodName: 'Dr. Priya Sharma',
    facultyCount: 32,
    studentCount: 620,
    performance: 85,
    yearEstablished: 1998,
    email: 'ece@cocampus.edu',
    phone: '+91-9876543211',
    location: 'Block B, Room 201-215',
    vision: 'To lead in electronics and communication innovations that transform society.',
    mission: 'To nurture engineers who excel in design, development, and research of electronic systems.',
  },
  {
    name: 'Mechanical Engineering',
    code: 'ME',
    hodName: 'Dr. Amit Singh',
    facultyCount: 30,
    studentCount: 580,
    performance: 82,
    yearEstablished: 1990,
    email: 'me@cocampus.edu',
    phone: '+91-9876543212',
    location: 'Block C, Room 301-318',
    vision: 'To be a premier institution for mechanical engineering education and sustainable innovation.',
    mission: 'To develop skilled engineers capable of solving complex mechanical challenges.',
  },
  {
    name: 'Civil Engineering',
    code: 'CE',
    hodName: 'Dr. Neha Gupta',
    facultyCount: 25,
    studentCount: 450,
    performance: 80,
    yearEstablished: 1992,
    email: 'ce@cocampus.edu',
    phone: '+91-9876543213',
    location: 'Block D, Room 401-412',
    vision: 'To shape the future of infrastructure through innovative civil engineering practices.',
    mission: 'To educate civil engineers who build sustainable and resilient infrastructure.',
  },
  {
    name: 'Information Technology',
    code: 'IT',
    hodName: 'Dr. Vikram Patel',
    facultyCount: 28,
    studentCount: 520,
    performance: 86,
    yearEstablished: 2000,
    email: 'it@cocampus.edu',
    phone: '+91-9876543214',
    location: 'Block A, Room 201-215',
    vision: 'To be at the forefront of information technology advancements and digital transformation.',
    mission: 'To produce IT professionals who drive innovation and digital solutions globally.',
  },
];

// Sample subjects
const subjects = [
  { code: 'CS101', name: 'Introduction to Programming', credits: 4, type: 'Theory', department: 'Computer Science', semester: 1 },
  { code: 'CS102', name: 'Data Structures', credits: 4, type: 'Theory', department: 'Computer Science', semester: 2 },
  { code: 'CS103L', name: 'Programming Lab', credits: 2, type: 'Lab', department: 'Computer Science', semester: 1 },
  { code: 'CS201', name: 'Database Management Systems', credits: 4, type: 'Theory', department: 'Computer Science', semester: 3 },
  { code: 'CS202L', name: 'DBMS Lab', credits: 2, type: 'Lab', department: 'Computer Science', semester: 3 },
  { code: 'CS301E', name: 'Machine Learning', credits: 3, type: 'Elective', department: 'Computer Science', semester: 5 },
  { code: 'EC101', name: 'Basic Electronics', credits: 4, type: 'Theory', department: 'Electronics & Communication', semester: 1 },
  { code: 'EC102L', name: 'Electronics Lab', credits: 2, type: 'Lab', department: 'Electronics & Communication', semester: 1 },
  { code: 'EC201', name: 'Digital Signal Processing', credits: 4, type: 'Theory', department: 'Electronics & Communication', semester: 4 },
  { code: 'ME101', name: 'Engineering Mechanics', credits: 4, type: 'Theory', department: 'Mechanical Engineering', semester: 1 },
  { code: 'ME102L', name: 'Workshop Practice', credits: 2, type: 'Lab', department: 'Mechanical Engineering', semester: 1 },
  { code: 'CE101', name: 'Surveying', credits: 4, type: 'Theory', department: 'Civil Engineering', semester: 2 },
  { code: 'IT101', name: 'Web Technologies', credits: 4, type: 'Theory', department: 'Information Technology', semester: 3 },
  { code: 'IT102L', name: 'Web Development Lab', credits: 2, type: 'Lab', department: 'Information Technology', semester: 3 },
  { code: 'MATH101', name: 'Engineering Mathematics I', credits: 4, type: 'Theory', department: 'Mathematics', semester: 1 },
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Get admin user for notices
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ Admin user not found. Please run seedUsers.js first!');
      process.exit(1);
    }

    // Clear existing data
    await Department.deleteMany();
    await Subject.deleteMany();
    await Notice.deleteMany();
    console.log('🗑️  Cleared existing admin data');

    // Create departments
    await Department.insertMany(departments);
    console.log('✅ Departments created');

    // Create subjects
    await Subject.insertMany(subjects);
    console.log('✅ Subjects created');

    // Sample notices
    const notices = [
      {
        title: 'End Semester Examination Schedule',
        content: 'The end semester examinations for all branches will commence from January 20, 2024. Students are advised to collect their hall tickets from the examination cell.',
        category: 'Exam',
        priority: 'High',
        pinned: true,
        postedBy: adminUser._id,
        postedByName: 'Admin',
        targetAudience: ['all'],
      },
      {
        title: 'Fee Payment Deadline Extended',
        content: 'The last date for fee payment has been extended to January 25, 2024. Students who have not yet paid are requested to do so before the deadline.',
        category: 'Fee',
        priority: 'High',
        pinned: true,
        postedBy: adminUser._id,
        postedByName: 'Admin',
        targetAudience: ['student'],
      },
      {
        title: 'Annual Sports Day 2024',
        content: 'The Annual Sports Day will be held on February 15, 2024. All students interested in participating should register with their department sports coordinators.',
        category: 'Event',
        priority: 'Medium',
        pinned: false,
        postedBy: adminUser._id,
        postedByName: 'Admin',
        targetAudience: ['all'],
      },
      {
        title: 'Library Timings Changed',
        content: 'The library will remain open from 8:00 AM to 10:00 PM during the examination period. Students can avail 24/7 access to digital resources.',
        category: 'General',
        priority: 'Low',
        pinned: false,
        postedBy: adminUser._id,
        postedByName: 'Librarian',
        targetAudience: ['all'],
      },
    ];

    await Notice.insertMany(notices);
    console.log('✅ Notices created');

    console.log('\n✅ Admin data seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Departments: ${departments.length}`);
    console.log(`   - Subjects: ${subjects.length}`);
    console.log(`   - Notices: ${notices.length}`);

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();
    await Department.deleteMany();
    await Subject.deleteMany();
    await Notice.deleteMany();
    console.log('🗑️  Admin data destroyed!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run based on command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
