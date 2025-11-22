export const feeData = {
  feeStructure: {
    tuitionFee: 45000,
    developmentFee: 5000,
    examFee: 3000,
    libraryFee: 2000,
    sportsFee: 1500,
    total: 56500
  },

  paymentHistory: [
    {
      id: 1,
      semester: "Semester 1 - 2024",
      feeType: "Regular Semester Fee",
      amount: 56500,
      paymentDate: "2024-08-15",
      paymentMethod: "UPI",
      transactionId: "TXN2024081512345",
      status: "paid",
      receiptUrl: "#"
    },
    {
      id: 2,
      semester: "Semester 2 - 2024",
      feeType: "Regular Semester Fee",
      amount: 56500,
      paymentDate: "2025-01-10",
      paymentMethod: "Debit Card",
      transactionId: "TXN2025011098765",
      status: "paid",
      receiptUrl: "#"
    }
  ],

  pendingFees: [
    {
      id: 3,
      semester: "Semester 3 - 2025",
      feeType: "Regular Semester Fee",
      amount: 56500,
      dueDate: "2025-12-31",
      status: "pending",
      lateFee: 0
    }
  ],

  feeCategories: [
    "Regular Semester Fee",
    "Supply/Supplementary Exam Fee",
    "Re-evaluation Fee",
    "Condonation Fee",
    "Transcript Fee",
    "Fine Payments"
  ],

  paymentMethods: [
    {
      value: "upi",
      label: "UPI",
      icon: "Smartphone",
      description: "Pay using UPI apps"
    },
    {
      value: "debit_card",
      label: "Debit Card",
      icon: "CreditCard",
      description: "Pay using debit card"
    },
    {
      value: "credit_card",
      label: "Credit Card",
      icon: "CreditCard",
      description: "Pay using credit card"
    },
    {
      value: "net_banking",
      label: "Net Banking",
      icon: "Building",
      description: "Pay using online banking"
    }
  ]
};
