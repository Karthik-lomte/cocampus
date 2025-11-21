import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
  error,
  onRetry,
  title = 'Error',
  fullScreen = false
}) => {
  const errorMessage = error?.response?.data?.message ||
                      error?.message ||
                      'An unexpected error occurred';

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
    >
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1">
            {title}
          </h3>
          <p className="text-red-700 dark:text-red-300 text-sm mb-4">
            {errorMessage}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center p-4 z-50">
        <div className="max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  return <div className="p-4">{content}</div>;
};

export default ErrorMessage;
