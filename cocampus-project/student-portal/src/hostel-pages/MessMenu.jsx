import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { hostelService } from '../services/hostelService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function MessMenu() {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [editingMenu, setEditingMenu] = useState([]);
  const [messTimings, setMessTimings] = useState({});
  const [editingTimings, setEditingTimings] = useState({});

  // Load Mess Menu
  useEffect(() => {
    loadMessMenu();
  }, []);

  const loadMessMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostelService.getMessMenu();
      setWeeklyMenu(data.weeklyMenu || data.menu || []);
      setMessTimings(data.timings || {});
      setEditingMenu(data.weeklyMenu || data.menu || []);
      setEditingTimings(data.timings || {});
    } catch (err) {
      console.error('Error loading mess menu:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await hostelService.updateMessMenu({
        weeklyMenu: editingMenu,
        timings: editingTimings
      });
      setWeeklyMenu([...editingMenu]);
      setMessTimings({ ...editingTimings });
      setEditMode(false);
      toast.success('Menu and timings updated successfully!');
    } catch (err) {
      console.error('Error updating mess menu:', err);
      toast.error(err.response?.data?.message || 'Failed to update menu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingMenu([...weeklyMenu]);
    setEditingTimings({ ...messTimings });
    setEditMode(false);
  };

  const updateTiming = (meal, field, value) => {
    setEditingTimings({
      ...editingTimings,
      [meal]: {
        ...editingTimings[meal],
        [field]: value
      }
    });
  };

  const updateMenuItem = (dayIndex, meal, value) => {
    const updated = [...editingMenu];
    updated[dayIndex][meal] = value;
    setEditingMenu(updated);
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading mess menu..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadMessMenu} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mess Menu</h1>
          <p className="text-gray-600 mt-1">Manage weekly mess menu</p>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            <Edit2 size={20} />
            Edit Menu
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Menu Grid */}
      <div className="space-y-4">
        {(editMode ? editingMenu : weeklyMenu).map((dayMenu, dayIndex) => (
          <motion.div
            key={dayMenu.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.05 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">{dayMenu.day}</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Breakfast */}
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-2">
                    Breakfast
                  </label>
                  {editMode ? (
                    <textarea
                      value={dayMenu.breakfast}
                      onChange={(e) => updateMenuItem(dayIndex, 'breakfast', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm">{dayMenu.breakfast}</p>
                  )}
                </div>

                {/* Lunch */}
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-2">
                    Lunch
                  </label>
                  {editMode ? (
                    <textarea
                      value={dayMenu.lunch}
                      onChange={(e) => updateMenuItem(dayIndex, 'lunch', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm">{dayMenu.lunch}</p>
                  )}
                </div>

                {/* Snacks */}
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-2">
                    Snacks
                  </label>
                  {editMode ? (
                    <textarea
                      value={dayMenu.snacks}
                      onChange={(e) => updateMenuItem(dayIndex, 'snacks', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm">{dayMenu.snacks}</p>
                  )}
                </div>

                {/* Dinner */}
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-2">
                    Dinner
                  </label>
                  {editMode ? (
                    <textarea
                      value={dayMenu.dinner}
                      onChange={(e) => updateMenuItem(dayIndex, 'dinner', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm">{dayMenu.dinner}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timings Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Utensils className="text-orange-600" size={24} />
          Mess Timings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-orange-600 mb-2">Breakfast</p>
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingTimings.breakfast.start}
                  onChange={(e) => updateTiming('breakfast', 'start', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Start time"
                />
                <input
                  type="text"
                  value={editingTimings.breakfast.end}
                  onChange={(e) => updateTiming('breakfast', 'end', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="End time"
                />
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-900">{messTimings.breakfast.start} - {messTimings.breakfast.end}</p>
            )}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-orange-600 mb-2">Lunch</p>
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingTimings.lunch.start}
                  onChange={(e) => updateTiming('lunch', 'start', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Start time"
                />
                <input
                  type="text"
                  value={editingTimings.lunch.end}
                  onChange={(e) => updateTiming('lunch', 'end', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="End time"
                />
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-900">{messTimings.lunch.start} - {messTimings.lunch.end}</p>
            )}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-orange-600 mb-2">Snacks</p>
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingTimings.snacks.start}
                  onChange={(e) => updateTiming('snacks', 'start', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Start time"
                />
                <input
                  type="text"
                  value={editingTimings.snacks.end}
                  onChange={(e) => updateTiming('snacks', 'end', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="End time"
                />
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-900">{messTimings.snacks.start} - {messTimings.snacks.end}</p>
            )}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-orange-600 mb-2">Dinner</p>
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingTimings.dinner.start}
                  onChange={(e) => updateTiming('dinner', 'start', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Start time"
                />
                <input
                  type="text"
                  value={editingTimings.dinner.end}
                  onChange={(e) => updateTiming('dinner', 'end', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="End time"
                />
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-900">{messTimings.dinner.start} - {messTimings.dinner.end}</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MessMenu;
