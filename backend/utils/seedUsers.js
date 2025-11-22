import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

// Test users for all 10 portals
const users = [
  // 1. Student Portal
  {
    name: 'Rahul Sharma',
    email: 'student@cocampus.com',
    password: 'password123',
    phone: '+91-9876543210',
    role: 'student',
    userId: 'STU2024001',
    rollNumber: 'CSE2022001',
    department: 'Computer Science',
    semester: 5,
    year: 2022,
  },
  // 2. Faculty Portal
  {
    name: 'Dr. Priya Patel',
    email: 'faculty@cocampus.com',
    password: 'password123',
    phone: '+91-9876543211',
    role: 'faculty',
    userId: 'FAC2024001',
    employeeId: 'EMP20180001',
    department: 'Computer Science',
  },
  // 3. HoD Portal
  {
    name: 'Dr. Rajesh Kumar',
    email: 'hod@cocampus.com',
    password: 'password123',
    phone: '+91-9876543212',
    role: 'hod',
    userId: 'HOD2024001',
    employeeId: 'HOD2018001',
    department: 'Computer Science',
  },
  // 4. Principal Portal
  {
    name: 'Dr. Anita Desai',
    email: 'principal@cocampus.com',
    password: 'password123',
    phone: '+91-9876543213',
    role: 'principal',
    userId: 'PRI2024001',
    employeeId: 'PRI2015001',
    department: 'Administration',
  },
  // 5. Admin Portal
  {
    name: 'Admin User',
    email: 'admin@cocampus.com',
    password: 'password123',
    phone: '+91-9876543214',
    role: 'admin',
    userId: 'ADM2024001',
    employeeId: 'ADM2020001',
    department: 'Administration',
  },
  // 6. Warden (Hostel Portal)
  {
    name: 'Mr. Suresh Nair',
    email: 'warden@cocampus.com',
    password: 'password123',
    phone: '+91-9876543215',
    role: 'warden',
    userId: 'WAR2024001',
    employeeId: 'WAR2019001',
    department: 'Hostel',
  },
  // 7. Canteen Manager (Canteen Portal)
  {
    name: 'Mrs. Kavita Reddy',
    email: 'canteen@cocampus.com',
    password: 'password123',
    phone: '+91-9876543216',
    role: 'canteen_manager',
    userId: 'CAN2024001',
    employeeId: 'CAN2021001',
    department: 'Canteen',
  },
  // 8. Stall Owner (Stall Portal)
  {
    name: 'Mr. Ravi Singh',
    email: 'stall@cocampus.com',
    password: 'password123',
    phone: '+91-9876543217',
    role: 'stall_owner',
    userId: 'STA2024001',
    department: 'Canteen',
  },
  // 9. Club Admin (Club Portal)
  {
    name: 'Neha Gupta',
    email: 'club@cocampus.com',
    password: 'password123',
    phone: '+91-9876543218',
    role: 'club_admin',
    userId: 'CLB2024001',
    department: 'Student Activities',
  },
  // 10. Guest (Sports Portal)
  {
    name: 'Vikram Mehta',
    email: 'guest@cocampus.com',
    password: 'password123',
    phone: '+91-9876543219',
    role: 'guest',
    userId: 'GST2024001',
    department: 'External',
  },
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();
    console.log('🗑️  Cleared existing users');

    // Create new users (use create instead of insertMany to trigger pre-save hooks)
    await Promise.all(users.map(user => User.create(user)));
    console.log('✅ Test users created successfully!');

    console.log('\n📋 Login Credentials for Testing:');
    console.log('═══════════════════════════════════════════════════════════');

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.role.toUpperCase()} Portal:`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name:     ${user.name}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('\n✅ Database seeded successfully!');
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
    await User.deleteMany();
    console.log('🗑️  Data destroyed!');
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
