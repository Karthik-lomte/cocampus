import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, Download } from 'lucide-react';
import { facultyData } from '../faculty-data/facultyData';
import { studentsData } from '../faculty-data/studentsData';

function MarksUpload() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [evaluationType, setEvaluationType] = useState('');
  const [marks, setMarks] = useState({});

  const classes = ['CSE-3A', 'CSE-3B', 'CSE-4A'];
  const evaluationTypes = [
    { value: 'mid1', label: 'Mid-1 Exam', maxMarks: 30 },
    { value: 'mid2', label: 'Mid-2 Exam', maxMarks: 30 },
    { value: 'internal', label: 'Internal Assessment', maxMarks: 40 },
    { value: 'assignment', label: 'Assignment', maxMarks: 20 },
    { value: 'lab', label: 'Lab Evaluation', maxMarks: 50 }
  ];

  const students = selectedClass ? (studentsData[selectedClass] || []) : [];
  const maxMarks = evaluationTypes.find(e => e.value === evaluationType)?.maxMarks || 100;

  const handleMarksChange = (rollNo, value) => {
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 0 && numValue <= maxMarks)) {
      setMarks(prev => ({
        ...prev,
        [rollNo]: value
      }));
    }
  };

  const handleSaveMarks = () => {
    if (!selectedClass || !selectedSubject || !evaluationType) {
      alert('Please select all fields');
      return;
    }
    alert(`Marks saved successfully for ${selectedClass} - ${selectedSubject}`);
  };

  const handleDownloadTemplate = () => {
    alert('Downloading Excel template...');
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploading file: ${file.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Marks Upload</h1>
        <p className="text-gray-600 mt-1">Upload and manage student marks</p>
      </motion.div>

      {/* Upload Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-green-600 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Manual Entry</h3>
            <p className="text-sm text-gray-600">Enter marks manually for each student</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-green-600 transition-colors cursor-pointer">
            <h3 className="font-semibold text-gray-900 mb-2">Bulk Upload</h3>
            <p className="text-sm text-gray-600 mb-3">Upload marks using Excel/CSV file</p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Download size={14} />
                Template
              </button>
              <label className="flex items-center gap-1 text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
                <Upload size={14} />
                Upload
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Selection Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Evaluation Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class & Section</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setMarks({});
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Subject</option>
              {facultyData.assignedSubjects.map(subject => (
                <option key={subject.code} value={subject.code}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Type</label>
            <select
              value={evaluationType}
              onChange={(e) => setEvaluationType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Type</option>
              {evaluationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} (Max: {type.maxMarks})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Marks Entry */}
      {selectedClass && evaluationType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Enter Marks - {selectedClass}</h2>
              <p className="text-sm text-gray-600">Maximum Marks: {maxMarks}</p>
            </div>
            <button
              onClick={handleSaveMarks}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <Save size={20} />
              Save Marks
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks (out of {maxMarks})</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => {
                  const studentMarks = marks[student.rollNo] || '';
                  const percentage = studentMarks ? ((studentMarks / maxMarks) * 100).toFixed(1) : '-';
                  return (
                    <motion.tr
                      key={student.rollNo}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={studentMarks}
                          onChange={(e) => handleMarksChange(student.rollNo, e.target.value)}
                          placeholder={`0 - ${maxMarks}`}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${
                          percentage >= 75 ? 'text-green-600' : percentage >= 40 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {percentage}%
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {students.map((student, index) => {
              const studentMarks = marks[student.rollNo] || '';
              const percentage = studentMarks ? ((studentMarks / maxMarks) * 100).toFixed(1) : '-';
              return (
                <motion.div
                  key={student.rollNo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.rollNo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      step="0.5"
                      value={studentMarks}
                      onChange={(e) => handleMarksChange(student.rollNo, e.target.value)}
                      placeholder={`0 - ${maxMarks}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className={`font-semibold ${
                      percentage >= 75 ? 'text-green-600' : percentage >= 40 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {percentage}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default MarksUpload;
