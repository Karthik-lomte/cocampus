import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Award, Calendar, BookOpen, Home } from 'lucide-react';
import { studentData } from '../data/studentData';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600 mt-1">Your personal information and achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <img
                  src={studentData.profileImage}
                  alt={studentData.name}
                  className="w-32 h-32 rounded-full ring-4 ring-white"
                />
              </div>
              <div className="pt-20">
                <h2 className="text-2xl font-bold text-gray-900">{studentData.name}</h2>
                <p className="text-gray-600">{studentData.rollNumber}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-3" />
                    <span className="text-sm">{studentData.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-3" />
                    <span className="text-sm">{studentData.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-3" />
                    <span className="text-sm">{studentData.address.hostel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Academic Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 text-blue-500" size={24} />
              Academic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{studentData.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Batch</p>
                <p className="font-semibold text-gray-900">{studentData.batch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Semester</p>
                <p className="font-semibold text-gray-900">Semester {studentData.semester}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Section</p>
                <p className="font-semibold text-gray-900">Section {studentData.section}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CGPA</p>
                <p className="font-semibold text-blue-600 text-xl">{studentData.cgpa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Semester GPA</p>
                <p className="font-semibold text-purple-600 text-xl">{studentData.currentSemesterGPA}</p>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="mr-2 text-green-500" size={24} />
              Parent Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Father's Name</p>
                <p className="font-semibold text-gray-900">{studentData.parentInfo.fatherName}</p>
                <p className="text-sm text-gray-600 mt-1">{studentData.parentInfo.fatherPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mother's Name</p>
                <p className="font-semibold text-gray-900">{studentData.parentInfo.motherName}</p>
                <p className="text-sm text-gray-600 mt-1">{studentData.parentInfo.motherPhone}</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 text-yellow-500" size={24} />
              Achievements
            </h3>
            <div className="space-y-4">
              {studentData.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium whitespace-nowrap">
                      {achievement.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
