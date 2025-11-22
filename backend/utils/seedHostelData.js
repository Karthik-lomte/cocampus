import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import HostelBlock from '../models/HostelBlock.js';
import Room from '../models/Room.js';
import RoomAllocation from '../models/RoomAllocation.js';
import User from '../models/User.js';

dotenv.config();

const hostelBlocks = [
  { name: 'Block A - Boys', code: 'BLK-A', type: 'Boys', floors: 4, roomsPerFloor: 20, facilities: ['WiFi', 'Common Room', 'Laundry', 'Gym'] },
  { name: 'Block B - Boys', code: 'BLK-B', type: 'Boys', floors: 3, roomsPerFloor: 15, facilities: ['WiFi', 'Common Room', 'Laundry'] },
  { name: 'Block C - Girls', code: 'BLK-C', type: 'Girls', floors: 4, roomsPerFloor: 25, facilities: ['WiFi', 'Common Room', 'Laundry', 'Gym', 'Reading Room'] },
  { name: 'Block D - Girls', code: 'BLK-D', type: 'Girls', floors: 3, roomsPerFloor: 18, facilities: ['WiFi', 'Common Room', 'Laundry'] }
];

const seedHostelData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await HostelBlock.deleteMany();
    await Room.deleteMany();
    await RoomAllocation.deleteMany();

    console.log('🗑️  Cleared existing hostel data');

    // Create hostel blocks
    const createdBlocks = await HostelBlock.insertMany(hostelBlocks);
    console.log(`✅ Created ${createdBlocks.length} hostel blocks`);

    // Create rooms for each block
    let roomCount = 0;
    for (const block of createdBlocks) {
      const rooms = [];

      for (let floor = 1; floor <= block.floors; floor++) {
        for (let roomNum = 1; roomNum <= block.roomsPerFloor; roomNum++) {
          const roomNumber = `${floor}${String(roomNum).padStart(2, '0')}`;

          // Vary room types
          let capacity, type;
          const rand = Math.random();
          if (rand < 0.3) {
            capacity = 2;
            type = 'Double';
          } else if (rand < 0.7) {
            capacity = 3;
            type = 'Triple';
          } else {
            capacity = 4;
            type = 'Four-Bed';
          }

          rooms.push({
            block: block._id,
            roomNumber,
            floor,
            capacity,
            type,
            facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan']
          });
        }
      }

      await Room.insertMany(rooms);
      roomCount += rooms.length;
    }

    console.log(`✅ Created ${roomCount} rooms`);

    // Create sample allocations
    const students = await User.find({ role: 'Student' }).limit(20);

    if (students.length > 0) {
      const rooms = await Room.find().limit(10);
      const sampleAllocations = [];

      for (let i = 0; i < Math.min(students.length, rooms.length); i++) {
        const student = students[i];
        const room = rooms[i];

        sampleAllocations.push({
          student: student._id,
          studentId: student.userId || `STU202200${i + 1}`,
          studentName: student.name,
          studentContact: student.phone || '',
          block: room.block,
          room: room._id,
          bedNumber: 1,
          academicYear: '2024-25',
          semester: 'Odd',
          feesAmount: 15000,
          feesPaid: i % 3 === 0
        });

        // Update room occupancy
        room.currentOccupancy = 1;
        await room.save();
      }

      const createdAllocations = await RoomAllocation.insertMany(sampleAllocations);
      console.log(`✅ Created ${createdAllocations.length} sample allocations`);
    }

    console.log('✅ Hostel data seeded successfully!');
    console.log('');
    console.log('Hostel Blocks:');
    createdBlocks.forEach(block => {
      console.log(`  ${block.name} (${block.code}): ${block.totalRooms} rooms`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hostel data:', error);
    process.exit(1);
  }
};

const deleteHostelData = async () => {
  try {
    await connectDB();
    await HostelBlock.deleteMany();
    await Room.deleteMany();
    await RoomAllocation.deleteMany();
    console.log('✅ Hostel data deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting hostel data:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  deleteHostelData();
} else {
  seedHostelData();
}
