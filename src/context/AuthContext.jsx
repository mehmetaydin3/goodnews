import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken('');
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — returns auth state and actions.
 * Safe to call outside AuthProvider (e.g. Storybook stories):
 * returns no-op defaults so components render without crashing.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return { token: '', login: () => {}, logout: () => {}, isLoggedIn: false };
  }
  return ctx;
}
