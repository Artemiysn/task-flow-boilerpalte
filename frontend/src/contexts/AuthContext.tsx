import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginInput, RegisterInput } from '../types/auth';
import { authAPI } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }): any => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // При загрузке проверяем токен
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { user } = await authAPI.getProfile();
          setUser(user);
        } catch (error) {
          console.error('Ошибка загрузки профиля:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (data: LoginInput) => {
    const response = await authAPI.login(data);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (data: RegisterInput) => {
    const response = await authAPI.register(data);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};