import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

function MessMenu() {
  const [editMode, setEditMode] = useState(false);
  const [weeklyMenu, setWeeklyMenu] = useState([
    {
      day: 'Monday',
      breakfast: 'Idli, Sambar, Chutney, Tea/Coffee',
      lunch: 'Rice, Dal, Roti, Mixed Veg, Curd',
      snacks: 'Samosa, Tea',
      dinner: 'Rice, Paneer Butter Masala, Roti, Salad'
    },
    {
      day: 'Tuesday',
      breakfast: 'Poha, Boiled Eggs, Tea/Coffee',
      lunch: 'Rice, Rajma, Roti, Aloo Gobi, Curd',
      snacks: 'Bread Pakora, Tea',
      dinner: 'Rice, Chicken Curry, Roti, Salad'
    },
    {
      day: 'Wednesday',
      breakfast: 'Paratha, Curd, Pickle, Tea/Coffee',
      lunch: 'Rice, Chole, Roti, Bhindi, Curd',
      snacks: 'Vada Pav, Tea',
      dinner: 'Rice, Egg Curry, Roti, Salad'
    },
    {
      day: 'Thursday',
      breakfast: 'Dosa, Sambar, Chutney, Tea/Coffee',
      lunch: 'Rice, Dal Tadka, Roti, Aloo Matar, Curd',
      snacks: 'Pakora, Tea',
      dinner: 'Rice, Fish Curry, Roti, Salad'
    },
    {
      day: 'Friday',
      breakfast: 'Upma, Boiled Eggs, Tea/Coffee',
      lunch: 'Biryani, Raita, Salad',
      snacks: 'Cutlet, Tea',
      dinner: 'Rice, Mutton Curry, Roti, Salad'
    },
    {
      day: 'Saturday',
      breakfast: 'Puri, Aloo Sabzi, Tea/Coffee',
      lunch: 'Rice, Sambar, Roti, Cabbage, Curd',
      snacks: 'Biscuits, Tea',
      dinner: 'Rice, Paneer Do Pyaza, Roti, Salad'
    },
    {
      day: 'Sunday',
      breakfast: 'Chole Bhature, Tea/Coffee',
      lunch: 'Special Thali - Rice, Dal, 2 Sabzi, Roti, Sweet, Papad',
      snacks: 'Ice Cream',
      dinner: 'Rice, Butter Chicken, Roti, Salad, Sweet'
    }
  ]);

  const [editingMenu, setEditingMenu] = useState([...weeklyMenu]);

  const [messTimings, setMessTimings] = useState({
    breakfast: { start: '7:30 AM', end: '9:00 AM' },
    lunch: { start: '12:30 PM', end: '2:00 PM' },
    snacks: { start: '4:30 PM', end: '5:30 PM' },
    dinner: { start: '7:30 PM', end: '9:00 PM' }
  });

  const [editingTimings, setEditingTimings] = useState({ ...messTimings });

  const handleSave = () => {
    setWeeklyMenu([...editingMenu]);
    setMessTimings({ ...editingTimings });
    setEditMode(false);
    alert('Menu and timings updated successfully!');
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
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              <Save size={20} />
              Save Changes
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
