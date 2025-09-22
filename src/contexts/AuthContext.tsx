'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * User information interface
 * 
 * Defines the structure for user data including username and job title
 */
export interface UserInfo {
  username: string;
  jobTitle: string;
}

/**
 * Authentication context interface
 * 
 * Defines the structure for the authentication context including user info,
 * login status, and related functions
 */
interface AuthContextType {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  login: (username: string, jobTitle: string) => void;
  logout: () => void;
  updateUserInfo: (userInfo: UserInfo) => void;
}

/**
 * Authentication context
 * 
 * React context for managing user authentication state across the application
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 * 
 * Provides authentication context to child components and manages user state persistence
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} Authentication provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  /**
   * Load user information from localStorage on component mount
   * Ensures user data persists across page refreshes
   * Only runs on client side to avoid SSR issues
   */
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          setUserInfo(JSON.parse(storedUserInfo));
        } catch (error) {
          console.error('Failed to parse stored user info:', error);
          localStorage.removeItem('userInfo');
        }
      }
    }
  }, []);

  /**
   * Login function
   * 
   * Saves user information to state and localStorage
   * Only saves to localStorage in browser environment
   * 
   * @param {string} username - User's username
   * @param {string} jobTitle - User's job title
   */
  const login = (username: string, jobTitle: string) => {
    const newUserInfo: UserInfo = { username, jobTitle };
    setUserInfo(newUserInfo);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    }
  };

  /**
   * Logout function
   * 
   * Clears user information from state and localStorage
   * Only removes from localStorage in browser environment
   */
  const logout = () => {
    setUserInfo(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
    }
  };

  /**
   * Update user information function
   * 
   * Updates user information in state and localStorage
   * Only updates localStorage in browser environment
   * 
   * @param {UserInfo} updatedInfo - Updated user information
   */
  const updateUserInfo = (updatedInfo: UserInfo) => {
    setUserInfo(updatedInfo);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    }
  };

  const value: AuthContextType = {
    userInfo,
    isAuthenticated: !!userInfo,
    login,
    logout,
    updateUserInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context
 * 
 * Provides access to authentication state and functions
 * 
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
