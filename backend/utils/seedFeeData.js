import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import FeeStructure from '../models/FeeStructure.js';
import FeePayment from '../models/FeePayment.js';
import User from '../models/User.js';

dotenv.config();

const feeStructures = [
  { semester: 1, tuition: 45000, development: 5000, exam: 2000, library: 1500, sports: 1000, lab: 3000 },
  { semester: 2, tuition: 45000, development: 5000, exam: 2000, library: 1500, sports: 1000, lab: 3000 },
  { semester: 3, tuition: 48000, development: 5500, exam: 2500, library: 1500, sports: 1000, lab: 3500 },
  { semester: 4, tuition: 48000, development: 5500, exam: 2500, library: 1500, sports: 1000, lab: 3500 },
  { semester: 5, tuition: 50000, development: 6000, exam: 3000, library: 2000, sports: 1500, lab: 4000 },
  { semester: 6, tuition: 50000, development: 6000, exam: 3000, library: 2000, sports: 1500, lab: 4000 },
  { semester: 7, tuition: 52000, development: 6500, exam: 3000, library: 2000, sports: 1500, lab: 4500 },
  { semester: 8, tuition: 52000, development: 6500, exam: 3000, library: 2000, sports: 1500, lab: 4500 }
];

const seedFeeData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await FeeStructure.deleteMany();
    await FeePayment.deleteMany();

    console.log('🗑️  Cleared existing fee data');

    // Create fee structures
    const createdStructures = await FeeStructure.insertMany(feeStructures);
    console.log(`✅ Created ${createdStructures.length} fee structures`);

    // Get a student user for sample payments
    const student = await User.findOne({ role: 'Student' });

    if (student) {
      // Create sample payments
      const samplePayments = [
        {
          student: student._id,
          studentId: student.userId || 'STU2022001',
          studentName: student.name,
          semester: 5,
          totalAmount: 66500,
          paidAmount: 66500,
          status: 'Paid',
          paymentMethod: 'Online',
          transactionId: 'TXN' + Date.now(),
          paymentDate: new Date('2024-01-15'),
          receiptNumber: 'RCP' + Date.now()
        },
        {
          student: student._id,
          studentId: student.userId || 'STU2022002',
          studentName: 'Priya Patel',
          semester: 5,
          totalAmount: 66500,
          paidAmount: 0,
          status: 'Pending',
          dueDate: new Date('2024-02-01')
        },
        {
          student: student._id,
          studentId: 'STU2022003',
          studentName: 'Amit Kumar',
          semester: 3,
          totalAmount: 61500,
          paidAmount: 30750,
          status: 'Partial',
          paymentMethod: 'Bank Transfer',
          transactionId: 'TXN' + (Date.now() + 100),
          paymentDate: new Date('2024-01-10'),
          dueDate: new Date('2024-02-01')
        }
      ];

      const createdPayments = await FeePayment.insertMany(samplePayments);
      console.log(`✅ Created ${createdPayments.length} sample payments`);
    }

    console.log('✅ Fee data seeded successfully!');
    console.log('');
    console.log('Fee Structures:');
    createdStructures.forEach(fee => {
      console.log(`  Semester ${fee.semester}: ₹${fee.totalAmount}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding fee data:', error);
    process.exit(1);
  }
};

const deleteFeeData = async () => {
  try {
    await connectDB();
    await FeeStructure.deleteMany();
    await FeePayment.deleteMany();
    console.log('✅ Fee data deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting fee data:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  deleteFeeData();
} else {
  seedFeeData();
}
