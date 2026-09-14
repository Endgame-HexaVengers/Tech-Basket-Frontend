'use client';

import React, { useState } from 'react';
import { Card, Button, Switch } from '@heroui/react';
import { motion } from 'framer-motion';

export const InventoryPreferences: React.FC = () => {
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [autoOrder, setAutoOrder] = useState(false);
  const [currency, setCurrency] = useState('BDT');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="p-6 border border-default-200 bg-background shadow-sm rounded-xl">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-bold tracking-tight">Inventory Preferences</h2>
          <p className="text-sm text-default-500">
            Configure system alert thresholds and store defaults.
          </p>
        </div>

        <div className="space-y-6">
          {/* Low Stock Alert Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Low Stock Alerts</p>
              <p className="text-xs text-default-400">
                Receive notifications when items reach their minimum threshold.
              </p>
            </div>
            <Switch 
              isSelected={lowStockAlert} 
              onChange={setLowStockAlert} 
              aria-label="Low Stock Alert Toggle" 
            />
          </div>

          {/* Auto Order Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto Purchase Orders</p>
              <p className="text-xs text-default-400">
                Automatically generate purchase orders when stock runs out.
              </p>
            </div>
            <Switch 
              isSelected={autoOrder} 
              onChange={setAutoOrder} 
              aria-label="Auto Purchase Orders Toggle" 
            />
          </div>

          {/* Preferred Currency */}
          <div className="pt-2">
            <label className="text-sm font-medium mb-1 block">Base Currency</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 border border-default-300 rounded-lg bg-transparent text-sm focus:outline-none focus:border-primary"
            >
              <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="primary">
            Update Preferences
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};