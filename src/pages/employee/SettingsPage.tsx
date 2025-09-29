import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, Shield, User, Palette, Globe } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings & Preferences
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your experience and manage your account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Account Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Manage your profile, password, and account preferences</p>
          </div>


          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Privacy & Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Manage your privacy settings and security options</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <Palette className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Appearance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Customize theme, layout, and display preferences</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
              <Globe className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Language & Region</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Set your preferred language and regional settings</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
              <Settings className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Advanced</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Export data, integrations, and developer options</p>
          </div>
        </div>

        <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
          <Clock className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
            Coming Soon!
          </h3>
          <p className="text-primary-700 dark:text-primary-300 text-sm mb-4">
            We're developing a comprehensive settings panel where you'll be able to customize every aspect of your AI Resume experience. From notification preferences to privacy controls, everything will be at your fingertips.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-lg">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Advanced customization coming Q1 2024</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need immediate assistance? Contact our support team for any account-related questions.
          </p>
        </div>
      </motion.div>
    </div>
  );
};