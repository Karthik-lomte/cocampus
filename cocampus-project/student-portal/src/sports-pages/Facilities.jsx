import { useState, useEffect } from 'react';
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
import { sportsService } from '../services/sportsService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Facilities = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Facilities State
  const [searchTerm, setSearchTerm] = useState('');
  const [facilities, setFacilities] = useState([]);

  // Load Facilities Data
  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sportsService.getFacilities();
      setFacilities(data || []);
    } catch (err) {
      console.error('Error loading facilities:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = facilities.filter(facility =>
    facility?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading and Error Screens
  if (loading) return <Loading fullScreen message="Loading facilities..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadFacilities} fullScreen />;

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
            key={facility?.id}
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
                    {facility?.icon || facility?.image || '🏅'}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{facility?.name || 'Unknown Facility'}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{facility?.rating || 0}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className={`text-sm ${facility?.available ? 'text-green-600' : 'text-red-600'}`}>
                          {facility?.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">₹{facility?.priceRegular || facility?.price || 0}</p>
                      <p className="text-xs text-gray-500">per hour</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{facility?.description || 'No description available'}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {facility?.location || 'N/A'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {facility?.timing || 'N/A'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {facility?.capacity || 'N/A'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {facility?.features?.map((feature, i) => (
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
