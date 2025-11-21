export const studentData = {
  id: "CS2023001",
  rollNumber: "21CS101",
  name: "Arjun Kumar",
  email: "arjun.kumar@cocampus.edu",
  phone: "+91 98765 43210",
  department: "Computer Science & Engineering",
  semester: 5,
  section: "A",
  batch: "2021-2025",
  profileImage: "https://ui-avatars.com/api/?name=Arjun+Kumar&size=200&background=0ea5e9&color=fff",
  cgpa: 8.7,
  currentSemesterGPA: 8.9,
  address: {
    room: "B-204",
    hostel: "Boys Hostel - Block B",
    permanent: "123 Main Street, Bangalore, Karnataka - 560001"
  },
  parentInfo: {
    fatherName: "Rajesh Kumar",
    fatherPhone: "+91 98765 00001",
    motherName: "Priya Kumar",
    motherPhone: "+91 98765 00002"
  },
  achievements: [
    {
      id: 1,
      title: "First Prize in Hackathon 2024",
      category: "Technical competitions",
      date: "2024-03-15",
      description: "Won first prize in national level hackathon",
      certificate: "hackathon2024.pdf"
    },
    {
      id: 2,
      title: "Best Paper Award",
      category: "Research publications",
      date: "2024-02-10",
      description: "Best paper award in IEEE conference",
      certificate: "bestpaper2024.pdf"
    }
  ]
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Night';
};

export const getGreeting = (name) => {
  return `Good ${getTimeOfDay()}, ${name}!`;
};
