export const payrollData = {
  currentMonth: {
    month: "November 2025",
    basicPay: 65000,
    hra: 26000,
    da: 13000,
    ta: 3000,
    medicalAllowance: 2000,
    otherAllowances: 1500,
    grossSalary: 110500,

    deductions: {
      pf: 7800,
      professionalTax: 200,
      tds: 5500,
      insurance: 1500,
      totalDeductions: 15000
    },

    netSalary: 95500,
    paymentDate: "2025-11-30",
    status: "pending"
  },

  salaryHistory: [
    {
      month: "October 2025",
      grossSalary: 110500,
      deductions: 15000,
      netSalary: 95500,
      paymentDate: "2025-10-31",
      status: "paid"
    },
    {
      month: "September 2025",
      grossSalary: 110500,
      deductions: 15000,
      netSalary: 95500,
      paymentDate: "2025-09-30",
      status: "paid"
    },
    {
      month: "August 2025",
      grossSalary: 110500,
      deductions: 15000,
      netSalary: 95500,
      paymentDate: "2025-08-31",
      status: "paid"
    }
  ],

  taxInfo: {
    financialYear: "2025-26",
    totalIncome: 1326000,
    taxDeducted: 66000,
    form16Available: true,
    form16Url: "#"
  },

  ytdEarnings: {
    basicPay: 520000,
    allowances: 364000,
    gross: 884000,
    deductions: 120000,
    netPay: 764000
  }
};
