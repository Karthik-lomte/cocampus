export const campusCoins = {
  balance: 2450,
  totalEarned: 5000,
  totalSpent: 2550,
  transactions: [
    {
      id: 1,
      type: "credit",
      amount: 500,
      description: "Added to wallet",
      date: "2024-11-18T10:30:00",
      status: "completed",
      category: "topup"
    },
    {
      id: 2,
      type: "debit",
      amount: 150,
      description: "Canteen - Main Canteen",
      date: "2024-11-18T13:45:00",
      status: "completed",
      category: "food",
      vendor: "Main Canteen"
    },
    {
      id: 3,
      type: "debit",
      amount: 200,
      description: "Event Registration - AI/ML Workshop",
      date: "2024-11-17T16:20:00",
      status: "completed",
      category: "events",
      eventName: "AI/ML Workshop"
    },
    {
      id: 4,
      type: "debit",
      amount: 80,
      description: "Canteen - Snacks Corner",
      date: "2024-11-17T11:15:00",
      status: "completed",
      category: "food",
      vendor: "Snacks Corner"
    },
    {
      id: 5,
      type: "credit",
      amount: 1000,
      description: "Added to wallet",
      date: "2024-11-15T09:00:00",
      status: "completed",
      category: "topup"
    },
    {
      id: 6,
      type: "debit",
      amount: 100,
      description: "Sports Fee - Annual Sports Meet",
      date: "2024-11-14T14:30:00",
      status: "completed",
      category: "sports",
      eventName: "Annual Sports Meet"
    },
    {
      id: 7,
      type: "debit",
      amount: 120,
      description: "Canteen - Main Canteen",
      date: "2024-11-14T13:00:00",
      status: "completed",
      category: "food",
      vendor: "Main Canteen"
    },
    {
      id: 8,
      type: "debit",
      amount: 50,
      description: "Certificate - Bonafide Certificate (Urgent)",
      date: "2024-11-13T10:45:00",
      status: "completed",
      category: "certificates"
    },
    {
      id: 9,
      type: "credit",
      amount: 1500,
      description: "Added to wallet",
      date: "2024-11-10T08:30:00",
      status: "completed",
      category: "topup"
    },
    {
      id: 10,
      type: "debit",
      amount: 200,
      description: "Hackathon Registration Fee",
      date: "2024-11-09T15:20:00",
      status: "completed",
      category: "events",
      eventName: "Hackathon 24hrs"
    }
  ],
  monthlySpending: [
    { month: "Nov", food: 450, events: 400, sports: 100, other: 100 },
    { month: "Oct", food: 520, events: 300, sports: 0, other: 80 },
    { month: "Sep", food: 480, events: 200, sports: 150, other: 50 },
    { month: "Aug", food: 410, events: 150, sports: 0, other: 40 }
  ]
};

export const getRecentTransactions = (count = 5) => {
  return campusCoins.transactions.slice(0, count);
};

export const getTransactionsByType = (type) => {
  return campusCoins.transactions.filter(t => t.type === type);
};

export const getTransactionsByCategory = (category) => {
  return campusCoins.transactions.filter(t => t.category === category);
};

export const getTotalSpentByCategory = () => {
  const categories = {};
  campusCoins.transactions.filter(t => t.type === 'debit').forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });
  return categories;
};
