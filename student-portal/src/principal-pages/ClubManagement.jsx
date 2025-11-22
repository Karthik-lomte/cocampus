import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar, DollarSign, CheckCircle, XCircle, FileText, X, Plus, ChevronDown, ChevronUp, Eye, Download, Image as ImageIcon, Video } from 'lucide-react';
import { principalData } from '../principal-data/principalData';

function ClubManagement() {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedEventRequest, setSelectedEventRequest] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [expandedClubId, setExpandedClubId] = useState(null);

  const [clubData, setClubData] = useState({
    name: '',
    coordinator: '',
    category: '',
    budget: '',
    description: ''
  });

  // Mock event requests data - in real app, this would come from API
  const eventRequests = [
    {
      id: 1,
      clubName: 'Technical Club',
      status: 'pending',
      academicYear: '2024-2025',
      quarter: 'Q2',
      programType: 'Workshop',
      programTheme: 'Technical Skills',
      activityName: 'Web Development Bootcamp',
      drivenBy: 'Self-Driven Activity',
      otherProgramType: '',
      duration: '16',
      startDate: '2024-04-15',
      endDate: '2024-04-17',
      studentParticipants: '45',
      facultyParticipants: '3',
      externalParticipants: '2',
      expenditure: '15000',
      remark: 'Industry expert invited for guest session',
      modeOfDelivery: 'Hybrid',
      activityLedBy: 'Student Committee',
      objective: 'To enhance web development skills among students and provide hands-on experience with modern frameworks',
      benefit: 'Students will gain practical knowledge of React, Node.js, and full-stack development with industry best practices',
      videoUrl: 'https://youtube.com/sample',
      photograph1: 'event-poster-1.jpg',
      photograph2: 'event-banner-2.jpg',
      reportPdf: 'activity-report.pdf',
      additionalDoc: 'budget-breakdown.xlsx',
      submittedDate: '2024-03-20',
      submittedBy: 'John Doe (Club President)'
    },
    {
      id: 2,
      clubName: 'Cultural Club',
      status: 'pending',
      academicYear: '2024-2025',
      quarter: 'Q2',
      programType: 'Festival',
      programTheme: 'Cultural Activities',
      activityName: 'Annual Cultural Fest 2024',
      drivenBy: 'Self-Driven Activity',
      otherProgramType: '',
      duration: '48',
      startDate: '2024-04-20',
      endDate: '2024-04-22',
      studentParticipants: '120',
      facultyParticipants: '8',
      externalParticipants: '5',
      expenditure: '50000',
      remark: 'Three-day cultural extravaganza with multiple events',
      modeOfDelivery: 'Offline',
      activityLedBy: 'Faculty Coordinator',
      objective: 'To celebrate cultural diversity and provide platform for students to showcase their talents in various art forms',
      benefit: 'Development of soft skills, cultural awareness, team coordination, and public performance confidence among participants',
      videoUrl: 'https://youtube.com/cultural-fest',
      photograph1: 'fest-poster.jpg',
      photograph2: 'fest-banner.jpg',
      reportPdf: 'cultural-fest-proposal.pdf',
      additionalDoc: 'event-schedule.pdf',
      submittedDate: '2024-03-18',
      submittedBy: 'Sarah Smith (Cultural Secretary)'
    }
  ];

  const handleApproveAttendance = (request) => {
    setSelectedRequest(request);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleRejectAttendance = (request) => {
    setSelectedRequest(request);
    setApprovalAction('reject');
    setShowApprovalModal(true);
  };

  const handleViewEventDetails = (eventRequest) => {
    setSelectedEventRequest(eventRequest);
    setShowEventDetailsModal(true);
  };

  const handleApproveEvent = (eventRequest) => {
    setSelectedEventRequest(eventRequest);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleRejectEvent = (eventRequest) => {
    setSelectedEventRequest(eventRequest);
    setApprovalAction('reject');
    setShowApprovalModal(true);
  };

  const handleSubmitDecision = (e) => {
    e.preventDefault();
    if (approvalAction === 'reject' && !remarks) {
      alert('Please provide remarks for rejection');
      return;
    }

    if (selectedEventRequest) {
      alert(`Event request "${selectedEventRequest.activityName}" ${approvalAction}d successfully!\nRemarks will be sent to the club.`);
    } else if (selectedRequest) {
      alert(`Attendance request ${approvalAction}d successfully for ${selectedRequest.eventName}!`);
    }

    setShowApprovalModal(false);
    setRemarks('');
    setSelectedEventRequest(null);
    setSelectedRequest(null);
  };

  const handleAddClub = (e) => {
    e.preventDefault();
    alert(`Club "${clubData.name}" added successfully!`);
    setShowAddClubModal(false);
    setClubData({
      name: '',
      coordinator: '',
      category: '',
      budget: '',
      description: ''
    });
  };

  const toggleClubExpansion = (clubId) => {
    setExpandedClubId(expandedClubId === clubId ? null : clubId);
  };

  // Get attendance requests for a specific club
  const getClubAttendanceRequests = (clubName) => {
    return principalData.clubAttendanceRequests.filter(req => req.clubName === clubName);
  };

  // Get event requests for a specific club
  const getClubEventRequests = (clubName) => {
    return eventRequests.filter(req => req.clubName === clubName);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Club Management</h1>
          <p className="text-gray-600 mt-1">Manage college clubs, events and attendance requests</p>
        </div>
        <button
          onClick={() => setShowAddClubModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Club
        </button>
      </motion.div>

      {/* Clubs Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-purple-100 text-sm">Total Clubs</p>
          <p className="text-4xl font-bold mt-2">{principalData.clubs.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-blue-100 text-sm">Total Members</p>
          <p className="text-4xl font-bold mt-2">
            {principalData.clubs.reduce((sum, club) => sum + club.memberCount, 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-green-100 text-sm">Pending Event Requests</p>
          <p className="text-4xl font-bold mt-2">{eventRequests.filter(r => r.status === 'pending').length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-orange-100 text-sm">Attendance Requests</p>
          <p className="text-4xl font-bold mt-2">{principalData.clubAttendanceRequests.length}</p>
        </motion.div>
      </div>

      {/* All Clubs Sections */}
      {principalData.clubs.map((club, index) => {
        const clubAttendanceRequests = getClubAttendanceRequests(club.name);
        const clubEventRequests = getClubEventRequests(club.name);
        const isExpanded = expandedClubId === club.id;
        const totalPendingRequests = clubAttendanceRequests.length + clubEventRequests.length;

        return (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Club Header */}
            <div
              className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleClubExpansion(club.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Trophy className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{club.name}</h2>
                      {totalPendingRequests > 0 && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full border border-orange-200">
                          {totalPendingRequests} Pending Request{totalPendingRequests > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} className="text-purple-600" />
                        <span><strong>Coordinator:</strong> {club.coordinator}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} className="text-blue-600" />
                        <span><strong>Members:</strong> {club.memberCount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} className="text-green-600" />
                        <span><strong>Active Events:</strong> {club.activeEvents}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign size={16} className="text-orange-600" />
                        <span><strong>Budget:</strong> ₹{(club.budgetAllocated / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>
            </div>

            {/* Club Details (Expanded) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Event Requests Section */}
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar className="mr-2 text-purple-600" size={20} />
                      Event Requests
                    </h3>

                    {clubEventRequests.length > 0 ? (
                      <div className="space-y-4">
                        {clubEventRequests.map((eventReq, reqIndex) => (
                          <motion.div
                            key={eventReq.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reqIndex * 0.1 }}
                            className="bg-white rounded-lg p-5 border border-purple-200 shadow-sm"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                  <h4 className="text-xl font-bold text-gray-900">{eventReq.activityName}</h4>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                                    {eventReq.programType}
                                  </span>
                                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                                    {eventReq.quarter}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-4">
                                  <div className="text-gray-600">
                                    <strong>Start Date:</strong> {new Date(eventReq.startDate).toLocaleDateString()}
                                  </div>
                                  <div className="text-gray-600">
                                    <strong>Duration:</strong> {eventReq.duration} hours
                                  </div>
                                  <div className="text-gray-600">
                                    <strong>Students:</strong> {eventReq.studentParticipants}
                                  </div>
                                  <div className="text-gray-600">
                                    <strong>Faculty:</strong> {eventReq.facultyParticipants}
                                  </div>
                                  <div className="text-gray-600">
                                    <strong>Expenditure:</strong> ₹{parseInt(eventReq.expenditure).toLocaleString()}
                                  </div>
                                  <div className="text-gray-600">
                                    <strong>Submitted:</strong> {new Date(eventReq.submittedDate).toLocaleDateString()}
                                  </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                  <p className="text-sm text-gray-700"><strong>Objective:</strong> {eventReq.objective}</p>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    📹 Video Available
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    📸 2 Photos
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    📄 Report PDF
                                  </span>
                                </div>
                              </div>

                              <div className="flex lg:flex-col gap-2">
                                <button
                                  onClick={() => handleViewEventDetails(eventReq)}
                                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                  <Eye size={18} />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleApproveEvent(eventReq)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                                >
                                  <CheckCircle size={18} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectEvent(eventReq)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                                >
                                  <XCircle size={18} />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="mx-auto mb-2 text-gray-400" size={48} />
                        <p>No event requests for this club</p>
                      </div>
                    )}
                  </div>

                  {/* Attendance Requests for This Club */}
                  {clubAttendanceRequests.length > 0 ? (
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="mr-2 text-indigo-600" size={20} />
                        Attendance Requests
                      </h3>
                      <div className="space-y-4">
                        {clubAttendanceRequests.map((request, reqIndex) => (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reqIndex * 0.1 }}
                            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                  <h4 className="text-lg font-bold text-gray-900">{request.eventName}</h4>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                                    {request.students.length} Students
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-4">
                                  <div className="text-gray-600">
                                    <Calendar size={16} className="inline mr-2" />
                                    <strong>Event Date:</strong> {new Date(request.eventDate).toLocaleDateString()}
                                  </div>
                                  <div className="text-gray-600">
                                    <Users size={16} className="inline mr-2" />
                                    <strong>Requested By:</strong> {request.requestedBy}
                                  </div>
                                  <div className="text-gray-600">
                                    <Calendar size={16} className="inline mr-2" />
                                    <strong>Submitted:</strong> {new Date(request.submittedDate).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* Students List */}
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                  <h5 className="font-semibold text-gray-900 mb-3 text-sm">
                                    Students Requesting Attendance ({request.students.length})
                                  </h5>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead className="bg-blue-100 border-b border-blue-300">
                                        <tr>
                                          <th className="px-3 py-2 text-left text-gray-700 font-semibold">Roll No</th>
                                          <th className="px-3 py-2 text-left text-gray-700 font-semibold">Name</th>
                                          <th className="px-3 py-2 text-left text-gray-700 font-semibold">Department</th>
                                          <th className="px-3 py-2 text-left text-gray-700 font-semibold">Year</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-blue-100">
                                        {request.students.map((student, idx) => (
                                          <tr key={idx} className="hover:bg-blue-50">
                                            <td className="px-3 py-2 text-gray-900 font-medium">{student.rollNo}</td>
                                            <td className="px-3 py-2 text-gray-900">{student.name}</td>
                                            <td className="px-3 py-2 text-gray-600">{student.department}</td>
                                            <td className="px-3 py-2 text-gray-600">Year {student.year}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              <div className="flex lg:flex-col gap-2">
                                <button
                                  onClick={() => handleApproveAttendance(request)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                                >
                                  <CheckCircle size={18} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectAttendance(request)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                                >
                                  <XCircle size={18} />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventDetailsModal && selectedEventRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEventDetailsModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-8"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center sticky top-0 rounded-t-2xl">
                  <div>
                    <h2 className="text-2xl font-bold">Event Request Details</h2>
                    <p className="text-purple-100 text-sm mt-1">{selectedEventRequest.activityName}</p>
                  </div>
                  <button onClick={() => setShowEventDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Basic Activity Details */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Basic Activity Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Academic Year:</strong> {selectedEventRequest.academicYear}</div>
                      <div><strong>Quarter:</strong> {selectedEventRequest.quarter}</div>
                      <div><strong>Program Type:</strong> {selectedEventRequest.programType}</div>
                      <div><strong>Program Theme:</strong> {selectedEventRequest.programTheme}</div>
                      <div className="md:col-span-2"><strong>Activity Name:</strong> {selectedEventRequest.activityName}</div>
                      <div><strong>Driven By:</strong> {selectedEventRequest.drivenBy}</div>
                      <div><strong>Duration:</strong> {selectedEventRequest.duration} hours</div>
                      <div><strong>Start Date:</strong> {new Date(selectedEventRequest.startDate).toLocaleDateString()}</div>
                      <div><strong>End Date:</strong> {new Date(selectedEventRequest.endDate).toLocaleDateString()}</div>
                      <div><strong>Student Participants:</strong> {selectedEventRequest.studentParticipants}</div>
                      <div><strong>Faculty Participants:</strong> {selectedEventRequest.facultyParticipants}</div>
                      <div><strong>External Participants:</strong> {selectedEventRequest.externalParticipants || 'None'}</div>
                      <div><strong>Expenditure:</strong> ₹{parseInt(selectedEventRequest.expenditure).toLocaleString()}</div>
                      <div><strong>Mode of Delivery:</strong> {selectedEventRequest.modeOfDelivery}</div>
                      <div><strong>Activity Led By:</strong> {selectedEventRequest.activityLedBy}</div>
                      <div className="md:col-span-2">
                        <strong>Remark:</strong> {selectedEventRequest.remark}
                      </div>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Overview</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="block mb-1">Objective:</strong>
                        <p className="text-gray-700 bg-white p-3 rounded border border-blue-200">{selectedEventRequest.objective}</p>
                      </div>
                      <div>
                        <strong className="block mb-1">Benefit / Outcome:</strong>
                        <p className="text-gray-700 bg-white p-3 rounded border border-blue-200">{selectedEventRequest.benefit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Attachments / Uploads</h3>
                    <div className="space-y-3">
                      {selectedEventRequest.videoUrl && (
                        <div className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                          <div className="flex items-center gap-2">
                            <Video className="text-red-600" size={20} />
                            <span className="text-sm font-medium">Video URL</span>
                          </div>
                          <a href={selectedEventRequest.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                            <Eye size={16} />
                            View
                          </a>
                        </div>
                      )}

                      <div className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="text-purple-600" size={20} />
                          <span className="text-sm font-medium">Photograph 1 (Event Poster/Logo)</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                          <Download size={16} />
                          Download
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="text-purple-600" size={20} />
                          <span className="text-sm font-medium">Photograph 2 (Event Banner)</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                          <Download size={16} />
                          Download
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                        <div className="flex items-center gap-2">
                          <FileText className="text-red-600" size={20} />
                          <span className="text-sm font-medium">Overall Report (PDF)</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                          <Download size={16} />
                          Download
                        </button>
                      </div>

                      {selectedEventRequest.additionalDoc && (
                        <div className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                          <div className="flex items-center gap-2">
                            <FileText className="text-orange-600" size={20} />
                            <span className="text-sm font-medium">Additional Document</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><strong>Submitted By:</strong> {selectedEventRequest.submittedBy}</div>
                      <div><strong>Submission Date:</strong> {new Date(selectedEventRequest.submittedDate).toLocaleDateString()}</div>
                      <div><strong>Club:</strong> {selectedEventRequest.clubName}</div>
                      <div><strong>Status:</strong> <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Pending</span></div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => setShowEventDetailsModal(false)}
                    className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Approval/Rejection Modal */}
      <AnimatePresence>
        {showApprovalModal && (selectedRequest || selectedEventRequest) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApprovalModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className={`${approvalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} text-white p-6 flex justify-between items-center`}>
                  <h2 className="text-2xl font-bold">
                    {approvalAction === 'approve' ? 'Approve' : 'Reject'} {selectedEventRequest ? 'Event Request' : 'Attendance Request'}
                  </h2>
                  <button onClick={() => setShowApprovalModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmitDecision} className="p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    {selectedEventRequest ? (
                      <>
                        <p><span className="text-gray-600">Activity:</span> <span className="font-semibold">{selectedEventRequest.activityName}</span></p>
                        <p><span className="text-gray-600">Club:</span> <span className="font-semibold">{selectedEventRequest.clubName}</span></p>
                        <p><span className="text-gray-600">Date:</span> <span className="font-semibold">{new Date(selectedEventRequest.startDate).toLocaleDateString()}</span></p>
                        <p><span className="text-gray-600">Duration:</span> <span className="font-semibold">{selectedEventRequest.duration} hours</span></p>
                      </>
                    ) : (
                      <>
                        <p><span className="text-gray-600">Event:</span> <span className="font-semibold">{selectedRequest.eventName}</span></p>
                        <p><span className="text-gray-600">Club:</span> <span className="font-semibold">{selectedRequest.clubName}</span></p>
                        <p><span className="text-gray-600">Date:</span> <span className="font-semibold">{new Date(selectedRequest.eventDate).toLocaleDateString()}</span></p>
                        <p><span className="text-gray-600">Students:</span> <span className="font-semibold">{selectedRequest.students.length} students</span></p>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks {approvalAction === 'reject' && <span className="text-red-600">*</span>}
                      {selectedEventRequest && <span className="text-gray-500"> (will be sent to club)</span>}
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={4}
                      required={approvalAction === 'reject'}
                      placeholder={approvalAction === 'approve' ? 'Add optional remarks...' : 'Provide reason for rejection...'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApprovalModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 px-4 py-3 ${approvalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} text-white rounded-lg hover:shadow-lg font-medium`}
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Add Club Modal */}
      <AnimatePresence>
        {showAddClubModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddClubModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                  <div>
                    <h2 className="text-2xl font-bold">Add New Club</h2>
                    <p className="text-purple-100 text-sm mt-1">Create a new student club</p>
                  </div>
                  <button onClick={() => setShowAddClubModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddClub} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Club Name *</label>
                    <input
                      type="text"
                      value={clubData.name}
                      onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
                      placeholder="e.g., Coding Club"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator *</label>
                    <input
                      type="text"
                      value={clubData.coordinator}
                      onChange={(e) => setClubData({ ...clubData, coordinator: e.target.value })}
                      placeholder="e.g., Dr. John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={clubData.category}
                      onChange={(e) => setClubData({ ...clubData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Social Service">Social Service</option>
                      <option value="Arts">Arts</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Allocation (₹) *</label>
                    <input
                      type="number"
                      value={clubData.budget}
                      onChange={(e) => setClubData({ ...clubData, budget: e.target.value })}
                      placeholder="e.g., 50000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={clubData.description}
                      onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
                      placeholder="Brief description of the club and its activities..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddClubModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      Add Club
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClubManagement;
