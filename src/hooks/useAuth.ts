import { useState, useEffect } from 'react';
import { apiService } from '@/service/apiservice';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.get('validate');
        if (response.valid) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Error validating session:', error);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    const response = await apiService.get('auth/validate');
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const hasRole = (role: string) => {
    return user?.roles?.includes(role);
  };

  return { user, loading, login, logout, hasRole };
};