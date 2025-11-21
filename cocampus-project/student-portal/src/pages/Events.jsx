import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Coins as CoinsIcon, CheckCircle, X, UserCircle, Phone, Mail, Plus, Trash2, Home } from 'lucide-react';
import { events, getUpcomingEvents } from '../data/eventsData';

const Events = () => {
  const [filter, setFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationType, setRegistrationType] = useState('single'); // 'single' or 'team'

  // Single Participant Form Data
  const [singleFormData, setSingleFormData] = useState({
    fullName: '',
    rollNumber: '',
    department: '',
    year: '',
    mobile: '',
    email: '',
    gender: '',
    accommodation: false
  });

  // Team Registration Form Data
  const [teamFormData, setTeamFormData] = useState({
    teamName: '',
    teamCategory: '',
    teamSizeMin: '',
    teamSizeMax: '',
    institution: '',
    teamLeader: {
      name: '',
      rollNumber: '',
      department: '',
      year: '',
      email: '',
      phone: ''
    },
    teamMembers: [
      {
        name: '',
        rollNumber: '',
        department: '',
        year: '',
        email: '',
        phone: ''
      }
    ]
  });

  const filteredEvents = filter === 'all' ? events :
                        filter === 'registered' ? events.filter(e => e.isRegistered) :
                        events.filter(e => e.category === filter);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setRegistrationType('single');
    setShowRegisterModal(true);
  };

  const handleSubmitSingleRegistration = (e) => {
    e.preventDefault();
    alert(`Successfully registered for ${selectedEvent.name}!\n\nDetails:\nName: ${singleFormData.fullName}\nRoll No: ${singleFormData.rollNumber}`);
    resetAndCloseModal();
  };

  const handleSubmitTeamRegistration = (e) => {
    e.preventDefault();
    const totalMembers = 1 + teamFormData.teamMembers.length; // Leader + members
    alert(`Successfully registered team "${teamFormData.teamName}" for ${selectedEvent.name}!\n\nTeam Size: ${totalMembers} members\nTeam Leader: ${teamFormData.teamLeader.name}`);
    resetAndCloseModal();
  };

  const resetAndCloseModal = () => {
    setShowRegisterModal(false);
    setSelectedEvent(null);
    setRegistrationType('single');
    setSingleFormData({
      fullName: '',
      rollNumber: '',
      department: '',
      year: '',
      mobile: '',
      email: '',
      gender: '',
      accommodation: false
    });
    setTeamFormData({
      teamName: '',
      teamCategory: '',
      teamSizeMin: '',
      teamSizeMax: '',
      institution: '',
      teamLeader: {
        name: '',
        rollNumber: '',
        department: '',
        year: '',
        email: '',
        phone: ''
      },
      teamMembers: [
        {
          name: '',
          rollNumber: '',
          department: '',
          year: '',
          email: '',
          phone: ''
        }
      ]
    });
  };

  const addTeamMember = () => {
    setTeamFormData({
      ...teamFormData,
      teamMembers: [
        ...teamFormData.teamMembers,
        {
          name: '',
          rollNumber: '',
          department: '',
          year: '',
          email: '',
          phone: ''
        }
      ]
    });
  };

  const removeTeamMember = (index) => {
    setTeamFormData({
      ...teamFormData,
      teamMembers: teamFormData.teamMembers.filter((_, i) => i !== index)
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updatedMembers = [...teamFormData.teamMembers];
    updatedMembers[index][field] = value;
    setTeamFormData({ ...teamFormData, teamMembers: updatedMembers });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
        <p className="text-gray-600 mt-1">Explore and register for upcoming events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'college', 'clubs', 'registered'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filter === f
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f} Events
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              {event.isRegistered && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Registered
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {event.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2" />
                  {event.registeredCount}/{event.maxCapacity} registered
                </div>
                {event.registrationFee > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CoinsIcon size={16} className="mr-2" />
                    Fee: ₹{event.registrationFee}
                  </div>
                )}
              </div>
              <button
                onClick={() => !event.isRegistered && handleRegister(event)}
                disabled={event.isRegistered}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  event.isRegistered
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {event.isRegistered ? 'Already Registered' : 'Register Now'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegisterModal && selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRegisterModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-8"
              >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center sticky top-0 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold">Event Registration</h2>
                  <p className="text-blue-100 text-sm mt-1">{selectedEvent.name}</p>
                </div>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Event Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{selectedEvent.venue}</span>
                  </div>
                  {selectedEvent.registrationFee > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CoinsIcon size={16} />
                      <span className="font-semibold">Registration Fee: ₹{selectedEvent.registrationFee}</span>
                    </div>
                  )}
                </div>

                {/* Registration Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Registration Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRegistrationType('single')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        registrationType === 'single'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <UserCircle className={`mx-auto mb-2 ${registrationType === 'single' ? 'text-blue-600' : 'text-gray-400'}`} size={32} />
                      <div className="font-semibold text-gray-900">Single Participant</div>
                      <div className="text-xs text-gray-500">Individual Registration</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegistrationType('team')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        registrationType === 'team'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Users className={`mx-auto mb-2 ${registrationType === 'team' ? 'text-blue-600' : 'text-gray-400'}`} size={32} />
                      <div className="font-semibold text-gray-900">Team Registration</div>
                      <div className="text-xs text-gray-500">Register as a Team</div>
                    </button>
                  </div>
                </div>

                {/* Single Participant Form */}
                {registrationType === 'single' && (
                  <form onSubmit={handleSubmitSingleRegistration} className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Participant Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={singleFormData.fullName}
                            onChange={(e) => setSingleFormData({ ...singleFormData, fullName: e.target.value })}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number / Student ID *</label>
                          <input
                            type="text"
                            required
                            value={singleFormData.rollNumber}
                            onChange={(e) => setSingleFormData({ ...singleFormData, rollNumber: e.target.value })}
                            placeholder="Enter roll number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                          <select
                            required
                            value={singleFormData.department}
                            onChange={(e) => setSingleFormData({ ...singleFormData, department: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Department</option>
                            <option>Computer Science</option>
                            <option>Electronics</option>
                            <option>Mechanical</option>
                            <option>Civil</option>
                            <option>Electrical</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                          <select
                            required
                            value={singleFormData.year}
                            onChange={(e) => setSingleFormData({ ...singleFormData, year: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Year</option>
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            value={singleFormData.mobile}
                            onChange={(e) => setSingleFormData({ ...singleFormData, mobile: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
                          <input
                            type="email"
                            required
                            value={singleFormData.email}
                            onChange={(e) => setSingleFormData({ ...singleFormData, email: e.target.value })}
                            placeholder="your.email@college.edu"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gender (Optional)</label>
                          <select
                            value={singleFormData.gender}
                            onChange={(e) => setSingleFormData({ ...singleFormData, gender: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                            <option>Prefer not to say</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={singleFormData.accommodation}
                              onChange={(e) => setSingleFormData({ ...singleFormData, accommodation: e.target.checked })}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Home size={16} />
                              Accommodation Required (if event spans multiple days)
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowRegisterModal(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                      >
                        {selectedEvent.registrationFee > 0 ? `Pay ₹${selectedEvent.registrationFee} & Register` : 'Register'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Team Registration Form */}
                {registrationType === 'team' && (
                  <form onSubmit={handleSubmitTeamRegistration} className="space-y-6">
                    {/* Team Details */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Team Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
                          <input
                            type="text"
                            required
                            value={teamFormData.teamName}
                            onChange={(e) => setTeamFormData({ ...teamFormData, teamName: e.target.value })}
                            placeholder="Enter team name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Team Category *</label>
                          <select
                            required
                            value={teamFormData.teamCategory}
                            onChange={(e) => setTeamFormData({ ...teamFormData, teamCategory: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Category</option>
                            <option>Junior</option>
                            <option>Senior</option>
                            <option>Open</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Institution / Branch *</label>
                          <input
                            type="text"
                            required
                            value={teamFormData.institution}
                            onChange={(e) => setTeamFormData({ ...teamFormData, institution: e.target.value })}
                            placeholder="e.g., Co-Campus College"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Team Size (Min) *</label>
                          <input
                            type="number"
                            required
                            min="2"
                            value={teamFormData.teamSizeMin}
                            onChange={(e) => setTeamFormData({ ...teamFormData, teamSizeMin: e.target.value })}
                            placeholder="Min members"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Team Size (Max) *</label>
                          <input
                            type="number"
                            required
                            min="2"
                            value={teamFormData.teamSizeMax}
                            onChange={(e) => setTeamFormData({ ...teamFormData, teamSizeMax: e.target.value })}
                            placeholder="Max members"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Team Leader Details */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Team Leader Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                          <input
                            type="text"
                            required
                            value={teamFormData.teamLeader.name}
                            onChange={(e) => setTeamFormData({
                              ...teamFormData,
                              teamLeader: { ...teamFormData.teamLeader, name: e.target.value }
                            })}
                            placeholder="Team leader name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                          <input
                            type="text"
                            required
                            value={teamFormData.teamLeader.rollNumber}
                            onChange={(e) => setTeamFormData({
                              ...teamFormData,
                              teamLeader: { ...teamFormData.teamLeader, rollNumber: e.target.value }
                            })}
                            placeholder="Roll number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                          <select
                            required
                            value={teamFormData.teamLeader.department}
                            onChange={(e) => setTeamFormData({
                              ...teamFormData,
                              teamLeader: { ...teamFormData.teamLeader, department: e.target.value }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Department</option>
                            <option>Computer Science</option>
                            <option>Electronics</option>
                            <option>Mechanical</option>
                            <option>Civil</option>
                            <option>Electrical</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                          <select
                            required
                            value={teamFormData.teamLeader.year}
                            onChange={(e) => setTeamFormData({
                              ...teamFormData,
                              teamLeader: { ...teamFormData.teamLeader, year: e.target.value }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Year</option>
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <input
                            type="email"
                            required
                            value={teamFormData.teamLeader.email}
                            onChange={(e) => setTeamFormData({
                              ...teamFormData,
                              teamLeader: { ...teamFormData.teamLeader, email: e.target.value }
                            })}
                            placeholder="email@college.edu"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={teamFormData.teamLeader.phone}
                            onChange={(e) => setTeamFormData({
                              ...teamFormData,
                              teamLeader: { ...teamFormData.teamLeader, phone: e.target.value }
                            })}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Plus size={16} />
                          Add Member
                        </button>
                      </div>

                      <div className="space-y-4">
                        {teamFormData.teamMembers.map((member, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-green-300">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">Member {index + 1}</h4>
                              {teamFormData.teamMembers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTeamMember(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Member Name *</label>
                                <input
                                  type="text"
                                  required
                                  value={member.name}
                                  onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                  placeholder="Full name"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                                <input
                                  type="text"
                                  required
                                  value={member.rollNumber}
                                  onChange={(e) => updateTeamMember(index, 'rollNumber', e.target.value)}
                                  placeholder="Roll number"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                                <select
                                  required
                                  value={member.department}
                                  onChange={(e) => updateTeamMember(index, 'department', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Department</option>
                                  <option>Computer Science</option>
                                  <option>Electronics</option>
                                  <option>Mechanical</option>
                                  <option>Civil</option>
                                  <option>Electrical</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                                <select
                                  required
                                  value={member.year}
                                  onChange={(e) => updateTeamMember(index, 'year', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Year</option>
                                  <option>1st Year</option>
                                  <option>2nd Year</option>
                                  <option>3rd Year</option>
                                  <option>4th Year</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                  type="email"
                                  required
                                  value={member.email}
                                  onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                                  placeholder="email@college.edu"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                <input
                                  type="tel"
                                  required
                                  value={member.phone}
                                  onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                                  placeholder="+91 98765 43210"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowRegisterModal(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                      >
                        {selectedEvent.registrationFee > 0 ? `Pay ₹${selectedEvent.registrationFee} & Register Team` : 'Register Team'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
