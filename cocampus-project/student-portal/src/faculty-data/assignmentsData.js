export const facultyAssignmentsData = {
  createdAssignments: [
    {
      id: 1,
      title: "Implement Binary Search Tree",
      subject: "Data Structures",
      subjectCode: "CS501",
      class: "CSE-3A",
      description: "Implement BST with insert, delete, search and traversal operations",
      dueDate: "2025-12-01",
      maxMarks: 20,
      submittedCount: 45,
      totalStudents: 60,
      status: "active",
      createdDate: "2025-11-15"
    },
    {
      id: 2,
      title: "Database Normalization Assignment",
      subject: "Database Management Systems",
      subjectCode: "CS502",
      class: "CSE-3A",
      description: "Normalize the given database schema up to 3NF",
      dueDate: "2025-11-25",
      maxMarks: 15,
      submittedCount: 58,
      totalStudents: 60,
      status: "active",
      createdDate: "2025-11-10"
    },
    {
      id: 3,
      title: "Software Testing Report",
      subject: "Software Engineering",
      subjectCode: "CS503",
      class: "CSE-4A",
      description: "Prepare test cases and test report for a given application",
      dueDate: "2025-11-20",
      maxMarks: 25,
      submittedCount: 62,
      totalStudents: 62,
      status: "completed",
      createdDate: "2025-11-01"
    }
  ],

  pendingEvaluations: [
    {
      assignmentId: 1,
      title: "Implement Binary Search Tree",
      class: "CSE-3A",
      submittedCount: 45,
      evaluatedCount: 20,
      pendingCount: 25
    },
    {
      assignmentId: 2,
      title: "Database Normalization Assignment",
      class: "CSE-3A",
      submittedCount: 58,
      evaluatedCount: 18,
      pendingCount: 40
    }
  ]
};
