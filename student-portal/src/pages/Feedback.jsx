import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Building, Home, Star, Send } from 'lucide-react';
import { feedbackData } from '../data/feedbackData';

function Feedback() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [ratings, setRatings] = useState({
    teaching_clarity: 0,
    subject_knowledge: 0,
    punctuality: 0,
    student_interaction: 0
  });
  const [suggestions, setSuggestions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Feedback submitted successfully! Your response is anonymous.');
    setSelectedCategory(null);
    setSelectedFaculty(null);
    setRatings({
      teaching_clarity: 0,
      subject_knowledge: 0,
      punctuality: 0,
      student_interaction: 0
    });
    setSuggestions('');
  };

  const RatingStars = ({ rating, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      UserCheck: UserCheck,
      Building: Building,
      Home: Home
    };
    const Icon = icons[iconName];
    return <Icon size={24} />;
  };

  if (selectedCategory === 'faculty' && selectedFaculty) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => setSelectedFaculty(null)}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to faculty list
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Feedback</h1>
          <p className="text-gray-600">Your feedback is anonymous and helps improve teaching quality</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <img
              src={selectedFaculty.image}
              alt={selectedFaculty.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedFaculty.name}</h2>
              <p className="text-gray-600">{selectedFaculty.subject}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Effectiveness</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clarity in teaching and explanation *
                  </label>
                  <RatingStars
                    rating={ratings.teaching_clarity}
                    onChange={(value) => setRatings({ ...ratings, teaching_clarity: value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject knowledge and expertise *
                  </label>
                  <RatingStars
                    rating={ratings.subject_knowledge}
                    onChange={(value) => setRatings({ ...ratings, subject_knowledge: value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Punctuality and regularity *
                  </label>
                  <RatingStars
                    rating={ratings.punctuality}
                    onChange={(value) => setRatings({ ...ratings, punctuality: value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student interaction and support *
                  </label>
                  <RatingStars
                    rating={ratings.student_interaction}
                    onChange={(value) => setRatings({ ...ratings, student_interaction: value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggestions for improvement (Optional)
              </label>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Share your suggestions..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">{suggestions.length}/500 characters</div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setSelectedFaculty(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                <Send size={20} />
                Submit Feedback
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (selectedCategory === 'faculty') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to categories
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Faculty</h1>
          <p className="text-gray-600">Choose a faculty member to provide feedback</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbackData.facultyList.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedFaculty(faculty)}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={faculty.image}
                  alt={faculty.name}
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-1">{faculty.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{faculty.subject}</p>
                <p className="text-xs text-gray-500">{faculty.department}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Provide Feedback
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback System</h1>
        <p className="text-gray-600">Share your feedback to help us improve</p>
      </motion.div>

      {/* Feedback Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {feedbackData.feedbackCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedCategory(category.id)}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                {getCategoryIcon(category.icon)}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feedback History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Feedback History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {feedbackData.feedbackHistory.map((feedback) => (
            <div key={feedback.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{feedback.category}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feedback.subject}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {feedback.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(feedback.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Feedback;
