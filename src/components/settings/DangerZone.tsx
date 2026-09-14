'use client';

import React, { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

export const DangerZone: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // Delete account logic
    console.log('Account deleted');
    setIsOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-6 border border-danger-200 bg-danger-50/10 shadow-sm rounded-xl">
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-xl font-bold text-danger">Danger Zone</h2>
            <p className="text-sm text-default-500">
              Irreversible actions related to your inventory account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-danger text-sm">Delete Account</p>
              <p className="text-xs text-default-500">
                Permanently delete your account, stock history, logs, and user access permissions.
              </p>
            </div>
            <Button variant="danger" onClick={() => setIsOpen(true)}>
              Delete Account
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal (Framer Motion Animation) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-background p-6 rounded-xl shadow-xl max-w-md w-full border border-default-200"
            >
              <h3 className="text-lg font-bold text-danger mb-2">Are you absolutely sure?</h3>
              <p className="text-sm text-default-500 mb-6">
                This action cannot be undone. All product inventory, supplier history, and dashboard configurations will be permanently removed.
              </p>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Yes, Delete My Account
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};