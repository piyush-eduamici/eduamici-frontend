import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('studyhub_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('studyhub_token', data.token);
    localStorage.setItem('studyhub_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('studyhub_token', data.token);
    localStorage.setItem('studyhub_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyhub_token');
    localStorage.removeItem('studyhub_user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
