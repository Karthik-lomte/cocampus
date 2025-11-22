export const scheduleData = {
  today: "Monday",

  todayClasses: [
    {
      id: 1,
      time: "09:00 AM - 10:00 AM",
      subject: "Data Structures",
      subjectCode: "CS501",
      class: "CSE-3A",
      room: "Lab-301",
      type: "Lab",
      status: "upcoming",
      studentsCount: 60
    },
    {
      id: 2,
      time: "10:15 AM - 11:15 AM",
      subject: "Database Management Systems",
      subjectCode: "CS502",
      class: "CSE-3A",
      room: "Room-205",
      type: "Theory",
      status: "upcoming",
      studentsCount: 60
    },
    {
      id: 3,
      time: "01:00 PM - 02:00 PM",
      subject: "Data Structures",
      subjectCode: "CS501",
      class: "CSE-3B",
      room: "Room-204",
      type: "Theory",
      status: "upcoming",
      studentsCount: 58
    },
    {
      id: 4,
      time: "02:15 PM - 03:15 PM",
      subject: "Software Engineering",
      subjectCode: "CS503",
      class: "CSE-4A",
      room: "Room-301",
      type: "Theory",
      status: "upcoming",
      studentsCount: 62
    }
  ],

  weeklySchedule: {
    Monday: [
      { time: "09:00-10:00", subject: "Data Structures", class: "CSE-3A", room: "Lab-301", type: "Lab" },
      { time: "10:15-11:15", subject: "DBMS", class: "CSE-3A", room: "Room-205", type: "Theory" },
      { time: "01:00-02:00", subject: "Data Structures", class: "CSE-3B", room: "Room-204", type: "Theory" },
      { time: "02:15-03:15", subject: "Software Engineering", class: "CSE-4A", room: "Room-301", type: "Theory" }
    ],
    Tuesday: [
      { time: "09:00-10:00", subject: "DBMS", class: "CSE-3A", room: "Room-205", type: "Theory" },
      { time: "11:30-12:30", subject: "Data Structures", class: "CSE-3A", room: "Room-204", type: "Theory" },
      { time: "02:15-03:15", subject: "Software Engineering", class: "CSE-4A", room: "Room-301", type: "Theory" }
    ],
    Wednesday: [
      { time: "10:15-11:15", subject: "Data Structures", class: "CSE-3B", room: "Lab-301", type: "Lab" },
      { time: "01:00-02:00", subject: "DBMS", class: "CSE-3A", room: "Lab-302", type: "Lab" }
    ],
    Thursday: [
      { time: "09:00-10:00", subject: "Software Engineering", class: "CSE-4A", room: "Room-301", type: "Theory" },
      { time: "10:15-11:15", subject: "Data Structures", class: "CSE-3A", room: "Room-204", type: "Theory" },
      { time: "02:15-03:15", subject: "Data Structures", class: "CSE-3B", room: "Room-205", type: "Theory" }
    ],
    Friday: [
      { time: "09:00-10:00", subject: "DBMS", class: "CSE-3A", room: "Room-205", type: "Theory" },
      { time: "11:30-12:30", subject: "Software Engineering", class: "CSE-4A", room: "Lab-303", type: "Lab" }
    ],
    Saturday: [],
    Sunday: []
  }
};
