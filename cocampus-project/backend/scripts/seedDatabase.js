/**
 * Database Seeding Script
 * Run this to populate the database with sample data
 * Usage: node scripts/seedDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const {
  Department,
  Subject,
  Club,
  CanteenStall,
  MenuItem,
  SportsFacility,
  CampusCoinsWallet
} = require('../src/models/AllModels');

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data (optional - comment out in production)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Club.deleteMany({});
    await CanteenStall.deleteMany({});
    await MenuItem.deleteMany({});
    await SportsFacility.deleteMany({});
    await CampusCoinsWallet.deleteMany({});

    // 1. Create Admin User
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      userId: 'ADMIN001',
      email: process.env.ADMIN_EMAIL || 'admin@cocampus.edu',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      name: process.env.ADMIN_NAME || 'System Administrator',
      phone: '+91 9999999999',
      role: 'admin',
      department: 'Administration',
      status: 'active'
    });
    console.log('✅ Admin user created');

    // 2. Create Departments
    console.log('\n🏛️  Creating departments...');
    const departments = await Department.insertMany([
      {
        departmentId: 'CSE',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        yearEstablished: 2010,
        email: 'cse@cocampus.edu',
        phone: '+91 9876543210',
        location: 'Block A',
        vision: 'To be a center of excellence in Computer Science Education',
        mission: 'Providing quality education and research opportunities',
        stats: { facultyCount: 15, studentCount: 240, labCount: 5 },
        status: 'active'
      },
      {
        departmentId: 'ECE',
        name: 'Electronics & Communication Engineering',
        code: 'ECE',
        yearEstablished: 2010,
        email: 'ece@cocampus.edu',
        phone: '+91 9876543211',
        location: 'Block B',
        stats: { facultyCount: 12, studentCount: 200, labCount: 4 },
        status: 'active'
      },
      {
        departmentId: 'ME',
        name: 'Mechanical Engineering',
        code: 'ME',
        yearEstablished: 2011,
        email: 'me@cocampus.edu',
        phone: '+91 9876543212',
        location: 'Block C',
        stats: { facultyCount: 10, studentCount: 180, labCount: 3 },
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${departments.length} departments`);

    // 3. Create Sample Faculty
    console.log('\n👨‍🏫 Creating sample faculty...');
    const faculty1 = await User.create({
      userId: 'FAC2024001',
      email: 'john.doe@cocampus.edu',
      password: 'Faculty@123',
      name: 'Dr. John Doe',
      phone: '+91 9876543220',
      role: 'faculty',
      department: 'Computer Science & Engineering',
      employeeId: 'EMP2024001',
      designation: 'Associate Professor',
      qualification: 'Ph.D',
      specialization: 'Machine Learning',
      experience: 10,
      joiningDate: new Date('2020-07-01'),
      status: 'active'
    });
    console.log('✅ Created sample faculty');

    // 4. Create Sample Students
    console.log('\n👨‍🎓 Creating sample students...');
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const student = await User.create({
        userId: `STU2024${String(i).padStart(3, '0')}`,
        email: `student${i}@cocampus.edu`,
        password: 'Student@123',
        name: `Student ${i}`,
        phone: `+91 987654${String(3220 + i)}`,
        role: 'student',
        department: 'Computer Science & Engineering',
        rollNumber: `21CS${String(100 + i)}`,
        semester: 5,
        section: 'A',
        batch: '2021-2025',
        cgpa: 8.0 + (i * 0.1),
        currentSemesterGPA: 8.5,
        address: {
          permanent: `${i} Main Street, City, State - 560001`
        },
        parentInfo: {
          fatherName: `Father ${i}`,
          fatherPhone: `+91 9876540${String(i).padStart(3, '0')}`,
          motherName: `Mother ${i}`,
          motherPhone: `+91 9876541${String(i).padStart(3, '0')}`
        },
        status: 'active'
      });

      // Create Campus Coins Wallet
      await CampusCoinsWallet.create({
        walletId: `WALLET-${student.userId}`,
        userId: student._id,
        userType: 'student',
        balance: 1000,
        stats: { totalEarned: 1000, totalSpent: 0, monthlySpending: [] },
        limits: { dailySpendingLimit: 5000, monthlySpendingLimit: 15000 },
        status: 'active'
      });

      students.push(student);
    }
    console.log(`✅ Created ${students.length} students with Campus Coins wallets`);

    // 5. Create Subjects
    console.log('\n📚 Creating subjects...');
    const subjects = await Subject.insertMany([
      {
        subjectCode: 'CS501',
        name: 'Data Structures & Algorithms',
        credits: 4,
        type: 'Theory',
        semester: 5,
        department: 'Computer Science & Engineering'
      },
      {
        subjectCode: 'CS502L',
        name: 'Data Structures Lab',
        credits: 2,
        type: 'Lab',
        semester: 5,
        department: 'Computer Science & Engineering'
      },
      {
        subjectCode: 'CS503',
        name: 'Database Management Systems',
        credits: 4,
        type: 'Theory',
        semester: 5,
        department: 'Computer Science & Engineering'
      }
    ]);
    console.log(`✅ Created ${subjects.length} subjects`);

    // 6. Create Clubs
    console.log('\n🎭 Creating clubs...');
    const clubs = await Club.insertMany([
      {
        clubId: 'CLB-001',
        name: 'Tech Club',
        category: 'Technical',
        description: 'For technology enthusiasts',
        establishedYear: 2015,
        stats: { totalMembers: 50, activeMembers: 45, eventsOrganized: 12, upcomingEvents: 2 },
        budget: { allocated: 50000, spent: 25000, remaining: 25000 },
        contact: { email: 'techclub@cocampus.edu', phone: '+91 9876543230' },
        status: 'active'
      },
      {
        clubId: 'CLB-002',
        name: 'Cultural Club',
        category: 'Cultural',
        description: 'Promoting arts and culture',
        establishedYear: 2015,
        stats: { totalMembers: 80, activeMembers: 70, eventsOrganized: 15, upcomingEvents: 3 },
        budget: { allocated: 75000, spent: 40000, remaining: 35000 },
        contact: { email: 'cultural@cocampus.edu', phone: '+91 9876543231' },
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${clubs.length} clubs`);

    // 7. Create Canteen Stalls
    console.log('\n🍽️  Creating canteen stalls...');
    const stall = await CanteenStall.create({
      stallId: 'STALL-001',
      name: 'Main Canteen',
      category: 'Main Canteen',
      description: 'Main cafeteria serving variety of food',
      image: 'https://via.placeholder.com/400',
      operatingHours: { open: '08:00', close: '20:00', weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      location: 'Ground Floor, Block A',
      rating: { average: 4.5, totalReviews: 120 },
      stats: { totalOrders: 1500, totalRevenue: 125000, todayOrders: 0, todayRevenue: 0 },
      isOpen: true,
      status: 'active'
    });

    // Create Menu Items
    const menuItems = await MenuItem.insertMany([
      {
        itemId: 'ITEM-001',
        stallId: stall._id,
        stallName: 'Main Canteen',
        name: 'Masala Dosa',
        description: 'Crispy dosa with potato filling',
        category: 'Breakfast',
        price: 40,
        dietary: { isVeg: true, isVegan: false },
        availability: { isAvailable: true, availableFrom: '08:00', availableTo: '11:00', daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        rating: { average: 4.5, totalRatings: 200 },
        status: 'available'
      },
      {
        itemId: 'ITEM-002',
        stallId: stall._id,
        stallName: 'Main Canteen',
        name: 'Veg Thali',
        description: 'Complete vegetarian meal',
        category: 'Lunch',
        price: 60,
        dietary: { isVeg: true, isVegan: false },
        availability: { isAvailable: true, availableFrom: '12:00', availableTo: '15:00', daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        rating: { average: 4.7, totalRatings: 350 },
        status: 'available'
      },
      {
        itemId: 'ITEM-003',
        stallId: stall._id,
        stallName: 'Main Canteen',
        name: 'Tea',
        description: 'Hot tea',
        category: 'Beverages',
        price: 10,
        dietary: { isVeg: true, isVegan: false },
        availability: { isAvailable: true, availableFrom: '08:00', availableTo: '18:00', daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        rating: { average: 4.0, totalRatings: 500 },
        status: 'available'
      }
    ]);
    console.log(`✅ Created canteen stall with ${menuItems.length} menu items`);

    // 8. Create Sports Facilities
    console.log('\n🏃 Creating sports facilities...');
    const facilities = await SportsFacility.insertMany([
      {
        facilityId: 'FAC-001',
        name: 'Cricket Ground',
        type: 'Cricket',
        description: 'Full-size cricket ground with practice nets',
        specifications: { surfaceType: 'Natural Turf', capacity: 100, courts: 1, equipment: ['Stumps', 'Nets', 'Boundary Markers'] },
        location: 'Sports Complex',
        availability: {
          isAvailable: true,
          openingHours: {
            weekdays: { open: '06:00', close: '18:00' },
            weekends: { open: '06:00', close: '20:00' }
          }
        },
        pricing: { studentRate: 100, facultyRate: 150, guestRate: 500, premiumRate: 200 },
        bookingRules: { maxAdvanceBooking: 30, minBookingDuration: 1, maxBookingDuration: 3, cancellationPolicy: 'Free cancellation up to 24 hours before booking' },
        stats: { totalBookings: 0, revenueGenerated: 0 },
        status: 'available'
      },
      {
        facilityId: 'FAC-002',
        name: 'Badminton Courts',
        type: 'Badminton',
        description: 'Indoor badminton courts',
        specifications: { surfaceType: 'Wooden', capacity: 20, courts: 4, equipment: ['Nets', 'Shuttlecocks available for rent'] },
        location: 'Indoor Sports Hall',
        availability: {
          isAvailable: true,
          openingHours: {
            weekdays: { open: '06:00', close: '22:00' },
            weekends: { open: '06:00', close: '22:00' }
          }
        },
        pricing: { studentRate: 50, facultyRate: 75, guestRate: 200, premiumRate: 100 },
        bookingRules: { maxAdvanceBooking: 7, minBookingDuration: 1, maxBookingDuration: 2, cancellationPolicy: 'Free cancellation up to 2 hours before booking' },
        stats: { totalBookings: 0, revenueGenerated: 0 },
        status: 'available'
      }
    ]);
    console.log(`✅ Created ${facilities.length} sports facilities`);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - Admin User: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log(`   - Departments: ${departments.length}`);
    console.log(`   - Faculty: 1`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Subjects: ${subjects.length}`);
    console.log(`   - Clubs: ${clubs.length}`);
    console.log(`   - Canteen Stalls: 1`);
    console.log(`   - Menu Items: ${menuItems.length}`);
    console.log(`   - Sports Facilities: ${facilities.length}`);
    console.log('\n🚀 You can now start the server and login with the admin credentials!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
