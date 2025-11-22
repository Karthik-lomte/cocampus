export const hostelData = {
  studentInfo: {
    hostelName: "Boys Hostel - Block A",
    roomNumber: "A-204",
    floor: "2nd Floor",
    roomType: "Double Sharing",
    roommate: {
      name: "Kiran Patel",
      rollNo: "CS21B1035",
      contact: "+91 9876543211"
    }
  },

  weeklyMenu: {
    Monday: {
      breakfast: ["Idli", "Sambar", "Chutney", "Tea/Coffee"],
      lunch: ["Rice", "Dal", "Mixed Veg Curry", "Chapati", "Curd"],
      snacks: ["Vada", "Tea/Coffee"],
      dinner: ["Rice", "Sambar", "Potato Fry", "Chapati", "Buttermilk"]
    },
    Tuesday: {
      breakfast: ["Dosa", "Chutney", "Potato Masala", "Tea/Coffee"],
      lunch: ["Rice", "Rasam", "Beans Curry", "Chapati", "Curd"],
      snacks: ["Bonda", "Tea/Coffee"],
      dinner: ["Rice", "Dal", "Cabbage Curry", "Chapati", "Curd"]
    },
    Wednesday: {
      breakfast: ["Upma", "Chutney", "Banana", "Tea/Coffee"],
      lunch: ["Rice", "Sambar", "Drumstick Curry", "Chapati", "Curd"],
      snacks: ["Samosa", "Tea/Coffee"],
      dinner: ["Rice", "Rasam", "Carrot Peas Curry", "Chapati", "Buttermilk"]
    },
    Thursday: {
      breakfast: ["Puri", "Potato Curry", "Boiled Egg", "Tea/Coffee"],
      lunch: ["Veg Biryani", "Raita", "Chips", "Sweet"],
      snacks: ["Pakora", "Tea/Coffee"],
      dinner: ["Rice", "Dal", "Tomato Curry", "Chapati", "Curd"]
    },
    Friday: {
      breakfast: ["Poha", "Chutney", "Tea/Coffee"],
      lunch: ["Rice", "Sambar", "Ladies Finger Fry", "Chapati", "Curd"],
      snacks: ["Bread Pakora", "Tea/Coffee"],
      dinner: ["Rice", "Dal", "Brinjal Curry", "Chapati", "Buttermilk"]
    },
    Saturday: {
      breakfast: ["Idli", "Vada", "Sambar", "Chutney", "Tea/Coffee"],
      lunch: ["Curd Rice", "Pickle", "Papad", "Mixed Veg", "Sweet"],
      snacks: ["Biscuits", "Tea/Coffee"],
      dinner: ["Fried Rice", "Gobi Manchurian", "Soup"]
    },
    Sunday: {
      breakfast: ["Paratha", "Curd", "Pickle", "Tea/Coffee"],
      lunch: ["Special Meals", "Rice", "Chapati", "Special Curry", "Sweet", "Salad"],
      snacks: ["Mixture", "Tea/Coffee"],
      dinner: ["Rice", "Dal Tadka", "Paneer Curry", "Chapati", "Ice Cream"]
    }
  },

  services: {
    laundry: {
      available: true,
      schedule: "Monday, Wednesday, Friday",
      timings: "9:00 AM - 5:00 PM"
    },
    maintenance: {
      available: true,
      contact: "+91 9876543200",
      timings: "24/7 Emergency Support"
    },
    wifi: {
      available: true,
      speed: "100 Mbps",
      username: "student_wifi"
    }
  },

  gatePassHistory: [
    {
      id: 1,
      reason: "Home Visit",
      outDate: "2025-11-15",
      outTime: "18:00",
      inDate: "2025-11-17",
      inTime: "20:00",
      status: "approved",
      approvedBy: "Warden - Mr. Suresh Kumar"
    },
    {
      id: 2,
      reason: "Medical Emergency",
      outDate: "2025-11-01",
      outTime: "10:00",
      inDate: "2025-11-01",
      inTime: "16:00",
      status: "completed",
      approvedBy: "Warden - Mr. Suresh Kumar"
    }
  ]
};
