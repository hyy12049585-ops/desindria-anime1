import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export interface AuthUser {
  id: string;
  username: string;
  avatar: string;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  register: (username: string, avatar: string) => void;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'desindria_auth_user';

const AuthUserContext = createContext<AuthContextType | undefined>(undefined);

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load user on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  const register = useCallback((username: string, avatar: string) => {
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      username,
      avatar,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const login = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthUserContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error('useAuthUser must be used within AuthUserProvider');
  }
  return context;
}
