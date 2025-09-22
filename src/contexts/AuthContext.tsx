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
   * 
   * 关键功能：页面刷新后恢复用户认证状态
   * 1. 检查是否在浏览器环境中（避免服务端渲染错误）
   * 2. 从 localStorage 读取保存的用户信息
   * 3. 如果存在有效数据，解析并设置到 React 状态
   * 4. 如果解析失败，清理无效的 localStorage 数据
   */
  useEffect(() => {
    // 关键：检查是否在浏览器环境，避免 Next.js 服务端渲染错误
    if (typeof window !== 'undefined') {
      // 从 localStorage 获取保存的用户信息
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          // 关键：解析 JSON 字符串并恢复用户状态
          setUserInfo(JSON.parse(storedUserInfo));
        } catch (error) {
          // 错误处理：JSON 解析失败时清理无效数据
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
   * 关键功能：用户登录和数据持久化
   * 1. 创建新的用户信息对象
   * 2. 更新 React Context 状态（立即生效）
   * 3. 将数据保存到 localStorage（页面刷新后仍然存在）
   * 
   * @param {string} username - User's username
   * @param {string} jobTitle - User's job title
   */
  const login = (username: string, jobTitle: string) => {
    // 关键：创建用户信息对象
    const newUserInfo: UserInfo = { username, jobTitle };
    
    // 关键：更新 React 状态（立即在组件中生效）
    setUserInfo(newUserInfo);
    
    // 关键：保存到 localStorage 实现数据持久化
    if (typeof window !== 'undefined') {
      // 将用户信息转换为 JSON 字符串并保存
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    }
  };

  /**
   * Logout function
   * 
   * Clears user information from state and localStorage
   * Only removes from localStorage in browser environment
   * 
   * 关键功能：用户登出和数据清理
   * 1. 清除 React Context 状态（立即生效）
   * 2. 移除 localStorage 中的用户信息（彻底清理）
   */
  const logout = () => {
    // 关键：清除 React 状态
    setUserInfo(null);
    
    // 关键：清理 localStorage 中的持久化数据
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
   * 关键功能：更新用户信息并保持数据同步
   * 1. 更新 React Context 状态（立即生效）
   * 2. 同步更新 localStorage 中的持久化数据
   * 
   * @param {UserInfo} updatedInfo - Updated user information
   */
  const updateUserInfo = (updatedInfo: UserInfo) => {
    // 关键：更新 React 状态
    setUserInfo(updatedInfo);
    
    // 关键：同步更新 localStorage 数据
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
