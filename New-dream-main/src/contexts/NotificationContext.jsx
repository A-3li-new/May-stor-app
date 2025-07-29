import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem('dream-boutique-notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem('dream-boutique-notifications', JSON.stringify(notifications));
  }, [notifications]);
  // إضافة إشعار مع userId
  const addNotification = (notif) => {
    setNotifications(prev => [
      { ...notif, id: Date.now() },
      ...prev
    ]);
  };
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const clearNotifications = (userId) => {
    if (userId) {
      setNotifications(prev => prev.filter(n => n.userId !== userId));
    } else {
      setNotifications([]);
    }
  };
  // دالة لجلب إشعارات مستخدم معين فقط
  const getUserNotifications = (userId) => {
    return notifications.filter(n => n.userId === userId);
  };
  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      getUserNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
