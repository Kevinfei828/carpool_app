import React, { useContext, useState, createContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Function to add a new notification
  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
    setUnreadCount((prevUnreadCount) => prevUnreadCount + 1); // Increase unread count
  };

  // Function to mark all notifications as read
  const markAsRead = () => {
    setUnreadCount(0);
  };

  // websocket
  const notificationHandler = (notification) => {
    const newNotification = JSON.parse(notification.body);
    addNotification(newNotification);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount, addNotification, markAsRead, notificationHandler}}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

