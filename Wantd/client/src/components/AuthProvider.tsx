import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { apiRequest, setAuthToken } from "@/lib/queryClient";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  location: string | null;
  locale: string;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; displayName: string }) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Sync token to queryClient module
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { username, password });
    const data = await res.json();
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (data: { username: string; email: string; password: string; displayName: string }) => {
    const res = await apiRequest("POST", "/api/auth/register", data);
    const result = await res.json();
    setToken(result.token);
    setAuthToken(result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch {
      // ignore
    }
    setToken(null);
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      token,
    }),
    [user, token, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
