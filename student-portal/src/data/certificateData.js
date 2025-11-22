export const certificateData = {
  certificateTypes: [
    "Bonafide Certificate",
    "Semester Memorandum",
    "Character Certificate",
    "Course Completion Certificate",
    "Transfer Certificate",
    "Migration Certificate",
    "Fee Payment Receipt"
  ],

  requestHistory: [
    {
      id: 1,
      type: "Bonafide Certificate",
      purpose: "Bank loan application",
      copies: 2,
      priority: "urgent",
      status: "approved",
      requestDate: "2025-11-10",
      completedDate: "2025-11-12",
      downloadUrl: "#"
    },
    {
      id: 2,
      type: "Fee Payment Receipt",
      purpose: "Income tax filing",
      copies: 1,
      priority: "normal",
      status: "completed",
      requestDate: "2025-10-25",
      completedDate: "2025-10-28",
      downloadUrl: "#"
    },
    {
      id: 3,
      type: "Character Certificate",
      purpose: "Internship application",
      copies: 1,
      priority: "normal",
      status: "in_progress",
      requestDate: "2025-11-15",
      completedDate: null,
      downloadUrl: null
    }
  ]
};
