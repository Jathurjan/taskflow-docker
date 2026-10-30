import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TOKEN_KEY } from '../services/api.js';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from a stored token on first load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const persist = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const login = useCallback(async (credentials) => persist(await loginUser(credentials)), []);
  const register = useCallback(async (details) => persist(await registerUser(details)), []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // token may already be invalid; local cleanup below is what matters
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
