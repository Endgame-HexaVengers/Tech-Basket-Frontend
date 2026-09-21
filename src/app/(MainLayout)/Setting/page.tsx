'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { InventoryPreferences } from '@/components/settings/InventoryPreferences';
import { DangerZone } from '@/components/settings/DangerZone';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8">
      {/* Header with Animation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-default-500 mt-1 text-sm sm:text-base">
          Manage system configurations, user profiles, and stock settings.
        </p>
      </motion.div>

      {/* Settings Grid Sections */}
      <div className="space-y-6">
        <ProfileSection />
        <InventoryPreferences />
        <DangerZone />
      </div>
    </div>
  );
};

export default SettingsPage;