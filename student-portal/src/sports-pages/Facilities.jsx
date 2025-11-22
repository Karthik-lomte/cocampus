import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Users,
  Star,
  ChevronRight
} from 'lucide-react';

const Facilities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [facilities] = useState([
    {
      id: 1,
      name: 'Cricket Stadium',
      icon: '🏏',
      description: 'Full-sized cricket ground with natural turf, practice nets, pavilion, and floodlights',
      capacity: '22 players',
      location: 'Sports Complex, Ground Floor',
      timing: '6:00 AM - 9:00 PM',
      priceRegular: 5000,
      pricePremium: 7500,
      rating: 4.8,
      features: ['Practice Nets (4 lanes)', 'Pavilion', 'Electronic Scoreboard', 'Floodlights'],
      available: true
    },
    {
      id: 2,
      name: 'Badminton Courts',
      icon: '🏸',
      description: 'Indoor badminton courts with wooden flooring and air conditioning',
      capacity: '4 players/court',
      courts: 6,
      location: 'Indoor Complex, 1st Floor',
      timing: '6:00 AM - 10:00 PM',
      priceRegular: 400,
      pricePremium: 600,
      rating: 4.9,
      features: ['AC', 'Wooden Floor', 'Professional Nets', 'Equipment Available'],
      available: true
    },
    {
      id: 3,
      name: 'Volleyball Courts',
      icon: '🏐',
      description: 'Outdoor volleyball courts with synthetic surface',
      capacity: '12 players/court',
      courts: 3,
      location: 'Outdoor Sports Area',
      timing: '6:00 AM - 8:00 PM',
      priceRegular: 800,
      pricePremium: 1200,
      rating: 4.6,
      features: ['Synthetic Surface', 'Night Lighting', 'Spectator Seating'],
      available: true
    },
    {
      id: 4,
      name: 'Kabaddi Courts',
      icon: '🤼',
      description: 'Professional kabaddi courts with clay/mat surface',
      capacity: '14 players/court',
      courts: 2,
      location: 'Outdoor Sports Area',
      timing: '6:00 AM - 8:00 PM',
      priceRegular: 600,
      pricePremium: 900,
      rating: 4.5,
      features: ['Clay/Mat Surface', 'Boundary Marking', 'Spectator Area'],
      available: true
    },
    {
      id: 5,
      name: 'Table Tennis',
      icon: '🏓',
      description: 'Indoor table tennis facility with professional tables',
      capacity: '4 players/table',
      tables: 8,
      location: 'Indoor Complex, Ground Floor',
      timing: '8:00 AM - 10:00 PM',
      priceRegular: 200,
      pricePremium: 300,
      rating: 4.7,
      features: ['Professional Tables', 'AC', 'Equipment Available', 'Coaching Available'],
      available: true
    }
  ]);

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sports Facilities</h1>
        <p className="text-gray-600">Browse and book our premium sports facilities</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Facilities List */}
      <div className="space-y-4">
        {filteredFacilities.map((facility, index) => (
          <motion.div
            key={facility.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-emerald-100 rounded-xl flex items-center justify-center text-4xl">
                    {facility.icon}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{facility.rating}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className={`text-sm ${facility.available ? 'text-green-600' : 'text-red-600'}`}>
                          {facility.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">₹{facility.priceRegular}</p>
                      <p className="text-xs text-gray-500">per hour</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{facility.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {facility.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {facility.timing}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {facility.capacity}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {facility.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/sports/book', { state: { facility } })}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Book Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No facilities found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default Facilities;
