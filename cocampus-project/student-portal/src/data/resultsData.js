export const resultsData = {
  currentSemester: 5,
  cgpa: 8.7,
  totalCredits: 160,
  semesters: [
    {
      semester: 5,
      academicYear: "2024",
      sgpa: 8.9,
      status: "In Progress",
      subjects: [
        {
          code: "CS501",
          name: "Data Structures",
          credits: 4,
          mid1: 28,
          mid2: 27,
          internal: 35,
          total: 90,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS502",
          name: "Database Management Systems",
          credits: 4,
          mid1: 26,
          mid2: 28,
          internal: 34,
          total: 88,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS503",
          name: "Operating Systems",
          credits: 4,
          mid1: 24,
          mid2: 25,
          internal: 32,
          total: 81,
          grade: "A",
          gradePoint: 9
        },
        {
          code: "CS504",
          name: "Computer Networks",
          credits: 4,
          mid1: 25,
          mid2: 26,
          internal: 33,
          total: 84,
          grade: "A",
          gradePoint: 9
        },
        {
          code: "CS505",
          name: "Software Engineering",
          credits: 3,
          mid1: 27,
          mid2: 28,
          internal: 36,
          total: 91,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS506",
          name: "Machine Learning",
          credits: 3,
          mid1: 26,
          mid2: 27,
          internal: 35,
          total: 88,
          grade: "A+",
          gradePoint: 10
        }
      ]
    },
    {
      semester: 4,
      academicYear: "2024",
      sgpa: 8.8,
      status: "Completed",
      subjects: [
        {
          code: "CS401",
          name: "Design and Analysis of Algorithms",
          credits: 4,
          mid1: 27,
          mid2: 28,
          internal: 36,
          total: 91,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS402",
          name: "Theory of Computation",
          credits: 4,
          mid1: 25,
          mid2: 26,
          internal: 33,
          total: 84,
          grade: "A",
          gradePoint: 9
        },
        {
          code: "CS403",
          name: "Microprocessors",
          credits: 4,
          mid1: 26,
          mid2: 27,
          internal: 34,
          total: 87,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS404",
          name: "Web Technologies",
          credits: 4,
          mid1: 28,
          mid2: 29,
          internal: 37,
          total: 94,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS405",
          name: "Computer Graphics",
          credits: 3,
          mid1: 24,
          mid2: 25,
          internal: 31,
          total: 80,
          grade: "A",
          gradePoint: 9
        },
        {
          code: "CS406",
          name: "Artificial Intelligence",
          credits: 3,
          mid1: 26,
          mid2: 27,
          internal: 35,
          total: 88,
          grade: "A+",
          gradePoint: 10
        }
      ]
    },
    {
      semester: 3,
      academicYear: "2023",
      sgpa: 8.6,
      status: "Completed",
      subjects: [
        {
          code: "CS301",
          name: "Object Oriented Programming",
          credits: 4,
          total: 87,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS302",
          name: "Discrete Mathematics",
          credits: 4,
          total: 82,
          grade: "A",
          gradePoint: 9
        },
        {
          code: "CS303",
          name: "Digital Logic Design",
          credits: 4,
          total: 85,
          grade: "A",
          gradePoint: 9
        },
        {
          code: "CS304",
          name: "Computer Organization",
          credits: 4,
          total: 88,
          grade: "A+",
          gradePoint: 10
        },
        {
          code: "CS305",
          name: "Probability and Statistics",
          credits: 3,
          total: 83,
          grade: "A",
          gradePoint: 9
        },
        {
          code: "HS301",
          name: "Professional Communication",
          credits: 2,
          total: 90,
          grade: "A+",
          gradePoint: 10
        }
      ]
    }
  ],
  performanceAnalysis: {
    strengths: ["Web Technologies", "Data Structures", "Software Engineering"],
    improvements: ["Computer Graphics", "Discrete Mathematics"],
    trend: "improving"
  }
};

export const getCurrentSemesterResults = () => {
  return resultsData.semesters.find(s => s.semester === resultsData.currentSemester);
};

export const getAllSemesters = () => {
  return resultsData.semesters;
};

export const calculateSGPA = (subjects) => {
  const totalCredits = subjects.reduce((sum, sub) => sum + sub.credits, 0);
  const totalGradePoints = subjects.reduce((sum, sub) => sum + (sub.gradePoint * sub.credits), 0);
  return (totalGradePoints / totalCredits).toFixed(2);
};
