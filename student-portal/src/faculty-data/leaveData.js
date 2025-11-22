export const leaveData = {
  balance: {
    casualLeave: 8,
    medicalLeave: 7,
    earnedLeave: 12,
    dutyLeave: 5
  },

  leaveHistory: [
    {
      id: 1,
      type: "Casual Leave",
      from: "2025-11-10",
      to: "2025-11-12",
      days: 3,
      reason: "Family function",
      status: "approved",
      appliedDate: "2025-11-05",
      approvedBy: "Dr. Suresh Kumar (HOD)",
      substitute: "Prof. Anjali Sharma"
    },
    {
      id: 2,
      type: "Medical Leave",
      from: "2025-10-15",
      to: "2025-10-16",
      days: 2,
      reason: "Fever and cold",
      status: "approved",
      appliedDate: "2025-10-14",
      approvedBy: "Dr. Suresh Kumar (HOD)",
      substitute: "Dr. Mohammed Ali",
      documents: "medical-cert.pdf"
    },
    {
      id: 3,
      type: "Casual Leave",
      from: "2025-12-05",
      to: "2025-12-05",
      days: 1,
      reason: "Personal work",
      status: "pending",
      appliedDate: "2025-11-18",
      approvedBy: null,
      substitute: "Prof. Priya Patel"
    }
  ],

  leaveTypes: [
    { value: "casual", label: "Casual Leave", available: 8 },
    { value: "medical", label: "Medical Leave", available: 7 },
    { value: "earned", label: "Earned Leave", available: 12 },
    { value: "duty", label: "Duty Leave", available: 5 },
    { value: "academic", label: "Academic Leave", available: 3 }
  ]
};
