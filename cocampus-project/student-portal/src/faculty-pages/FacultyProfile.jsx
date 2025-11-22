import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Award, Calendar, BookOpen, Briefcase, GraduationCap, Clock, Edit2, Save, X } from 'lucide-react';
import { facultyService } from '../services/facultyService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function FacultyProfile() {
  const toast = useToast();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getProfile();
      setProfileData(data);
      setEditedProfile(data);
    } catch (err) {
      console.error('Profile error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      await facultyService.updateProfile(editedProfile);
      toast.success('Profile updated successfully!');
      setProfileData(editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profileData);
    setIsEditing(false);
  };

  if (loading) return <Loading fullScreen message="Loading profile..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadProfile} fullScreen />;

  const faculty = profileData || {};
  const stats = faculty.stats || {};
  const assignedSubjects = faculty.assignedSubjects || [];
  const qualifications = faculty.qualifications || [];
  const research = faculty.research || {};
  const officeHours = faculty.officeHours || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Profile</h1>
          <p className="text-gray-600 mt-1">Your professional information and details</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Edit2 size={16} className="mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={updating}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
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
                  src={faculty.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name || 'Faculty')}&size=128&background=059669&color=fff&bold=true`}
                  alt={faculty.name}
                  className="w-32 h-32 rounded-full ring-4 ring-white"
                />
              </div>
              <div className="pt-20">
                <h2 className="text-2xl font-bold text-gray-900">{faculty.name}</h2>
                <p className="text-gray-600">{faculty.employeeId}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-3" />
                    <span className="text-sm">{faculty.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-3" />
                    <span className="text-sm">{faculty.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-3" />
                    <span className="text-sm">{faculty.cabin || faculty.room || 'N/A'}</span>
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
                <span className="font-bold text-green-600">{stats.classesToday || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Evaluations</span>
                <span className="font-bold text-orange-600">{stats.pendingEvaluations || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Leave Balance</span>
                <span className="font-bold text-blue-600">{stats.leaveBalance || 0} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students Taught</span>
                <span className="font-bold text-purple-600">{stats.studentsTaught || 0}</span>
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
                <p className="font-semibold text-gray-900">{faculty.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-semibold text-gray-900">{faculty.designation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Joining</p>
                <p className="font-semibold text-gray-900">{faculty.joiningDate ? new Date(faculty.joiningDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold text-gray-900">{faculty.experience || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-semibold text-gray-900">{faculty.specialization || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cabin Number</p>
                <p className="font-semibold text-gray-900">{faculty.cabin || faculty.room || 'N/A'}</p>
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
              {qualifications.length === 0 ? (
                <p className="text-gray-500">No qualifications added</p>
              ) : (
                qualifications.map((qual, index) => {
                  const colors = ['green', 'blue', 'purple', 'pink', 'indigo'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={index} className={`border-l-4 border-${color}-500 pl-4`}>
                      <p className="font-bold text-gray-900">{qual.degree || qual.title}</p>
                      <p className="text-sm text-gray-600">{qual.institution || qual.university}</p>
                      <p className="text-xs text-gray-500">{qual.year || `${qual.startYear} - ${qual.endYear}`}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Assigned Subjects */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 text-purple-500" size={24} />
              Assigned Subjects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedSubjects.length === 0 ? (
                <p className="text-gray-500 col-span-2">No subjects assigned</p>
              ) : (
                assignedSubjects.map((subject, index) => (
                  <motion.div
                    key={subject._id || subject.code || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{subject.name || subject.subjectName}</h4>
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        {subject.type || 'Theory'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{subject.code || subject.subjectCode}</p>
                    <p className="text-xs text-gray-500">{subject.class || subject.className || 'N/A'}</p>
                  </motion.div>
                ))
              )}
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
                <p className="font-semibold text-gray-900">Research Papers Published: {research.papers || 0}</p>
                <p className="text-sm text-gray-600 mt-1">In International Journals (SCI/SCOPUS)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Conference Papers: {research.conferences || 0}</p>
                <p className="text-sm text-gray-600 mt-1">International & National Conferences</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Research Grants: ₹{research.grants || 0} Lakhs</p>
                <p className="text-sm text-gray-600 mt-1">{research.grantAgencies || 'From various agencies'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Patents Filed: {research.patents || 0}</p>
                <p className="text-sm text-gray-600 mt-1">{research.patentArea || 'In various domains'}</p>
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
              {officeHours.length === 0 ? (
                <p className="text-gray-500">No office hours set</p>
              ) : (
                officeHours.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{slot.days || slot.day}</span>
                    <span className="font-semibold text-gray-900">{slot.time || `${slot.startTime} - ${slot.endTime}`}</span>
                  </div>
                ))
              )}
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
