import React, { createContext, useState, useCallback } from 'react';
 
export const NotificationContext = createContext();
 
export const NotificationProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
 
  const refreshNotifications = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
 
  return (
    <NotificationContext.Provider value={{ refreshTrigger, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
 