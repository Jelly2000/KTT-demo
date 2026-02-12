/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

// User roles
export const USER_ROLES = {
  OPERATOR: 'operator',
  USER: 'user',
  ADMIN: 'admin'
};

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Check if current user has operator role
  const isOperator = () => {
    return currentUser?.role === USER_ROLES.OPERATOR;
  };

  // Check if current user has a specific role
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Login user
  const login = (userData) => {
    setCurrentUser(userData);
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
  };

  // Add new user (only operators can do this)
  const addUser = (newUser) => {
    if (!isOperator()) {
      throw new Error('Only operators can add new users');
    }
    const userWithId = {
      ...newUser,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setUsers((prevUsers) => [...prevUsers, userWithId]);
    return userWithId;
  };

  // Get all users
  const getAllUsers = () => {
    return users;
  };

  const value = {
    currentUser,
    users,
    isOperator,
    hasRole,
    login,
    logout,
    addUser,
    getAllUsers,
    USER_ROLES
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
