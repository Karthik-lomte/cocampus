import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Filter } from 'lucide-react';
import { resultsData, getCurrentSemesterResults } from '../data/resultsData';

const Results = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState(resultsData.currentSemester);

  // Group semesters by year
  const groupedSemesters = resultsData.semesters.reduce((acc, sem) => {
    const year = sem.academicYear || '2024';
    if (!acc[year]) acc[year] = [];
    acc[year].push(sem);
    return acc;
  }, {});

  // Get years from the data
  const years = Object.keys(groupedSemesters).sort((a, b) => b - a);

  // Get semesters for selected year
  const semestersForYear = groupedSemesters[selectedYear] || [];

  const semesterData = resultsData.semesters.find(s => s.semester === selectedSemester);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Results</h1>
          <p className="text-gray-600 mt-1">View your semester grades and CGPA</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Overall CGPA</p>
            <p className="text-3xl font-bold text-blue-600">{resultsData.cgpa}</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                // Auto-select first semester of the year
                const firstSem = groupedSemesters[e.target.value]?.[0];
                if (firstSem) setSelectedSemester(firstSem.semester);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year} - {parseInt(year) + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {semestersForYear.map((sem) => (
                <option key={sem.semester} value={sem.semester}>
                  Semester {sem.semester} - SGPA: {sem.sgpa}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Semester {selectedSemester} Results</h2>
            <span className={`px-4 py-2 rounded-lg font-bold text-lg ${
              semesterData.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              SGPA: {semesterData.sgpa}
            </span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                {semesterData.subjects[0].mid1 !== undefined && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mid-1</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mid-2</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Internal</th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {semesterData.subjects.map((subject, index) => (
                <motion.tr
                  key={subject.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {subject.credits}
                  </td>
                  {subject.mid1 !== undefined && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subject.mid1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subject.mid2}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subject.internal}</td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {subject.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      subject.grade.includes('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {subject.grade}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {semesterData.subjects.map((subject, index) => (
            <motion.div
              key={subject.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{subject.code} • {subject.credits} Credits</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  subject.grade.includes('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {subject.grade}
                </span>
              </div>

              {subject.mid1 !== undefined && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Mid-1</p>
                    <p className="text-lg font-bold text-blue-600">{subject.mid1}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Mid-2</p>
                    <p className="text-lg font-bold text-purple-600">{subject.mid2}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Internal</p>
                    <p className="text-lg font-bold text-green-600">{subject.internal}</p>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-3 text-center">
                <p className="text-xs opacity-90">Total Marks</p>
                <p className="text-2xl font-bold">{subject.total} / 100</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
