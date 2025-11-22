// contexts/UtilitySettingsContext.js
import React, { createContext, useContext } from 'react';
import { useUtilitySettings } from '@/hooks/useMenuData';

const UtilitySettingsContext = createContext(null);

export const UtilitySettingsProvider = ({ children }) => {
  const utilitySettings = useUtilitySettings();

  return (
    <UtilitySettingsContext.Provider value={utilitySettings}>
      {children}
    </UtilitySettingsContext.Provider>
  );
};

export const useUtilitySettingsContext = () => {
  const context = useContext(UtilitySettingsContext);
  if (!context) {
    throw new Error('useUtilitySettingsContext must be used within a UtilitySettingsProvider');
  }
  return context;
};