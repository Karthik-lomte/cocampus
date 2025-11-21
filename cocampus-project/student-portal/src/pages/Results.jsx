import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Filter } from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Results = () => {
  const toast = useToast();
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getResults();
      setResultsData(data);
      if (data?.currentSemester) {
        setSelectedSemester(data.currentSemester);
      }
    } catch (err) {
      console.error('Results error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading results..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadResults} fullScreen />;
  if (!resultsData) return null;

  // Group semesters by year
  const groupedSemesters = (resultsData.semesters || []).reduce((acc, sem) => {
    const year = sem.academicYear || '2024';
    if (!acc[year]) acc[year] = [];
    acc[year].push(sem);
    return acc;
  }, {});

  const years = Object.keys(groupedSemesters).sort((a, b) => b - a);
  const semestersForYear = groupedSemesters[selectedYear] || [];
  const semesterData = (resultsData.semesters || []).find(s => s.semester === selectedSemester);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Results</h1>
          <p className="text-gray-600 mt-1">View your semester-wise results</p>
        </div>
      </div>

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Current CGPA</p>
            <Award size={24} className="text-white/50" />
          </div>
          <p className="text-4xl font-bold">{resultsData.cgpa || 'N/A'}</p>
          <p className="text-sm text-blue-100 mt-1">Out of 10.0</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Current Semester</p>
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{resultsData.currentSemesterGPA || 'N/A'}</p>
          <p className="text-sm text-gray-500 mt-1">Semester {selectedSemester || 'N/A'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Total Credits</p>
            <Award size={24} className="text-amber-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{resultsData.totalCredits || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {semestersForYear.map(sem => (
          <button
            key={sem.semester}
            onClick={() => setSelectedSemester(sem.semester)}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedSemester === sem.semester
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            Semester {sem.semester}
          </button>
        ))}
      </div>

      {/* Results Table */}
      {semesterData ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Semester {semesterData.semester} Results</h2>
                <p className="text-sm text-gray-600 mt-1">Academic Year: {semesterData.academicYear}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Semester GPA</p>
                <p className="text-3xl font-bold text-blue-600">{semesterData.gpa}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject Name</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Credits</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Grade</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Grade Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {semesterData.subjects?.map((subject, index) => (
                  <motion.tr
                    key={subject._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{subject.code || subject.subjectCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{subject.name || subject.subjectName}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">{subject.credits}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        subject.grade === 'A+' || subject.grade === 'A' ? 'bg-green-100 text-green-700' :
                        subject.grade === 'B+' || subject.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                        subject.grade === 'C' || subject.grade === 'C+' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {subject.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-900">{subject.gradePoints}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <Award className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results available</h3>
          <p className="text-gray-600">Results for this semester will be published soon</p>
        </div>
      )}
    </div>
  );
};

export default Results;
