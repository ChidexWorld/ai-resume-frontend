import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { useResponsive } from '../hooks/useResponsive';

export const DashboardLayout: React.FC = () => {
  const { isDesktop } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // On mobile, sidebar should be closed by default
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isDesktop]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-x-hidden overflow-y-auto p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};