import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Award, Calendar, BookOpen, Briefcase, GraduationCap, Clock } from 'lucide-react';
import { facultyData } from '../faculty-data/facultyData';

function FacultyProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Faculty Profile</h1>
        <p className="text-gray-600 mt-1">Your professional information and details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 h-32"></div>
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <img
                  src="https://ui-avatars.com/api/?name=Rajesh+Kumar&size=128&background=059669&color=fff&bold=true"
                  alt={facultyData.name}
                  className="w-32 h-32 rounded-full ring-4 ring-white"
                />
              </div>
              <div className="pt-20">
                <h2 className="text-2xl font-bold text-gray-900">{facultyData.name}</h2>
                <p className="text-gray-600">{facultyData.employeeId}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-3" />
                    <span className="text-sm">rajesh.kumar@cocampus.edu</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-3" />
                    <span className="text-sm">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-3" />
                    <span className="text-sm">Faculty Block - Room 305</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Classes Today</span>
                <span className="font-bold text-green-600">{facultyData.stats.classesToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Evaluations</span>
                <span className="font-bold text-orange-600">{facultyData.stats.pendingEvaluations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Leave Balance</span>
                <span className="font-bold text-blue-600">{facultyData.stats.leaveBalance} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students Taught</span>
                <span className="font-bold text-purple-600">{facultyData.stats.studentsTaught}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Professional Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Briefcase className="mr-2 text-green-500" size={24} />
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{facultyData.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-semibold text-gray-900">Associate Professor</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Joining</p>
                <p className="font-semibold text-gray-900">August 15, 2015</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold text-gray-900">10 Years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-semibold text-gray-900">Data Science & Machine Learning</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cabin Number</p>
                <p className="font-semibold text-gray-900">FB-305</p>
              </div>
            </div>
          </div>

          {/* Educational Qualifications */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="mr-2 text-blue-500" size={24} />
              Educational Qualifications
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-bold text-gray-900">Ph.D. in Computer Science</p>
                <p className="text-sm text-gray-600">Indian Institute of Technology, Delhi</p>
                <p className="text-xs text-gray-500">2012 - 2016</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-bold text-gray-900">M.Tech in Computer Science</p>
                <p className="text-sm text-gray-600">National Institute of Technology, Trichy</p>
                <p className="text-xs text-gray-500">2010 - 2012</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-bold text-gray-900">B.Tech in Computer Science</p>
                <p className="text-sm text-gray-600">Anna University, Chennai</p>
                <p className="text-xs text-gray-500">2006 - 2010</p>
              </div>
            </div>
          </div>

          {/* Assigned Subjects */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 text-purple-500" size={24} />
              Assigned Subjects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facultyData.assignedSubjects.map((subject, index) => (
                <motion.div
                  key={subject.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{subject.name}</h4>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                      {subject.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{subject.code}</p>
                  <p className="text-xs text-gray-500">{subject.class}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Research & Publications */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 text-yellow-500" size={24} />
              Research & Publications
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900">Research Papers Published: 15</p>
                <p className="text-sm text-gray-600 mt-1">In International Journals (SCI/SCOPUS)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Conference Papers: 8</p>
                <p className="text-sm text-gray-600 mt-1">International & National Conferences</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Research Grants: ₹25 Lakhs</p>
                <p className="text-sm text-gray-600 mt-1">From DST and AICTE</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Patents Filed: 3</p>
                <p className="text-sm text-gray-600 mt-1">In Machine Learning Applications</p>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2 text-indigo-500" size={24} />
              Office Hours
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Monday - Friday</span>
                <span className="font-semibold text-gray-900">10:00 AM - 11:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Monday - Friday</span>
                <span className="font-semibold text-gray-900">3:00 PM - 4:00 PM</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                * Students can meet during office hours for academic discussions and queries
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FacultyProfile;
