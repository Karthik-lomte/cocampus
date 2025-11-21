export const events = [
  {
    id: 1,
    name: "TechFest 2024",
    category: "college",
    organizer: "CSE Department",
    date: "2024-12-15",
    time: "09:00 AM",
    venue: "Main Auditorium",
    description: "Annual technical festival featuring coding competitions, tech talks, and project exhibitions.",
    registrationFee: 0,
    maxCapacity: 500,
    registeredCount: 342,
    status: "upcoming", // upcoming, ongoing, completed
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    features: ["Coding Competition", "Tech Talks", "Project Exhibition", "Prizes worth ₹50,000"],
    isRegistered: false,
    registrationDeadline: "2024-12-10"
  },
  {
    id: 2,
    name: "Annual Sports Meet",
    category: "college",
    organizer: "Sports Committee",
    date: "2024-11-30",
    time: "07:00 AM",
    venue: "College Sports Ground",
    description: "Inter-department sports competition including cricket, volleyball, badminton, and athletics.",
    registrationFee: 100,
    maxCapacity: 300,
    registeredCount: 287,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    features: ["Cricket", "Volleyball", "Badminton", "Athletics", "Medals & Trophies"],
    isRegistered: true,
    registrationDeadline: "2024-11-25"
  },
  {
    id: 3,
    name: "AI/ML Workshop",
    category: "clubs",
    organizer: "Tech Club",
    date: "2024-11-23",
    time: "02:00 PM",
    venue: "Computer Lab - Block A",
    description: "Hands-on workshop on Machine Learning fundamentals and practical implementation using Python.",
    registrationFee: 50,
    maxCapacity: 60,
    registeredCount: 58,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800",
    features: ["Hands-on Training", "Certificate", "Resource Materials", "Industry Expert"],
    isRegistered: true,
    registrationDeadline: "2024-11-20"
  },
  {
    id: 4,
    name: "Cultural Night",
    category: "clubs",
    organizer: "Cultural Club",
    date: "2024-12-20",
    time: "06:00 PM",
    venue: "Open Air Theater",
    description: "Showcase of talent featuring music, dance, drama, and standup comedy performances.",
    registrationFee: 0,
    maxCapacity: 800,
    registeredCount: 521,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    features: ["Music", "Dance", "Drama", "Comedy", "Food Stalls"],
    isRegistered: false,
    registrationDeadline: "2024-12-15"
  },
  {
    id: 5,
    name: "Hackathon 24hrs",
    category: "college",
    organizer: "Innovation Cell",
    date: "2024-12-01",
    time: "09:00 AM",
    venue: "Innovation Lab",
    description: "24-hour coding marathon to build innovative solutions for real-world problems.",
    registrationFee: 200,
    maxCapacity: 100,
    registeredCount: 96,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    features: ["24hrs Coding", "Mentorship", "Food & Refreshments", "Prizes worth ₹1,00,000"],
    isRegistered: true,
    registrationDeadline: "2024-11-25"
  },
  {
    id: 6,
    name: "Placement Preparation Seminar",
    category: "college",
    organizer: "Training & Placement Cell",
    date: "2024-11-22",
    time: "10:00 AM",
    venue: "Seminar Hall",
    description: "Comprehensive seminar on placement preparation covering aptitude, technical skills, and interview techniques.",
    registrationFee: 0,
    maxCapacity: 200,
    registeredCount: 178,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    features: ["Expert Guidance", "Resume Building", "Mock Interviews", "Study Materials"],
    isRegistered: false,
    registrationDeadline: "2024-11-20"
  }
];

export const getUpcomingEvents = () => {
  return events.filter(e => e.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getMyRegistrations = () => {
  return events.filter(e => e.isRegistered);
};

export const getEventsByCategory = (category) => {
  return events.filter(e => e.category === category);
};
