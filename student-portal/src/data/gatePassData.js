export const gatePassData = {
  passTypes: [
    {
      value: "medical",
      label: "Medical Emergency",
      icon: "Heart",
      requiresDocs: true
    },
    {
      value: "family",
      label: "Family Function",
      icon: "Users",
      requiresDocs: false
    },
    {
      value: "official",
      label: "Official Work",
      icon: "Briefcase",
      requiresDocs: true
    },
    {
      value: "early_departure",
      label: "Early Departure",
      icon: "Clock",
      requiresDocs: false
    },
    {
      value: "late_arrival",
      label: "Late Arrival",
      icon: "Clock",
      requiresDocs: false
    }
  ],

  requestHistory: [
    {
      id: 1,
      passType: "Family Function",
      reason: "Sister's wedding",
      date: "2025-11-25",
      outTime: "14:00",
      expectedReturn: "20:00",
      parentContact: "+91 9876543200",
      status: "approved",
      requestDate: "2025-11-18",
      approvedBy: "Class Coordinator - Dr. Kumar",
      approvedDate: "2025-11-18"
    },
    {
      id: 2,
      passType: "Medical Emergency",
      reason: "Dental appointment",
      date: "2025-11-10",
      outTime: "10:00",
      expectedReturn: "14:00",
      parentContact: "+91 9876543200",
      status: "completed",
      requestDate: "2025-11-08",
      approvedBy: "Class Coordinator - Dr. Kumar",
      approvedDate: "2025-11-08"
    },
    {
      id: 3,
      passType: "Early Departure",
      reason: "Important family matter",
      date: "2025-11-20",
      outTime: "15:00",
      expectedReturn: "Next Day",
      parentContact: "+91 9876543200",
      status: "pending",
      requestDate: "2025-11-19",
      approvedBy: null,
      approvedDate: null
    }
  ]
};
