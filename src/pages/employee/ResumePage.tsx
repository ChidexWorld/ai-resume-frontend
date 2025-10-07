import React from 'react';
import ResumeManager from '../../components/resume/ResumeManager';

export const ResumePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <ResumeManager />
      </div>
    </div>
  );
};

export default ResumePage;