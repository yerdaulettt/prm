"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { usersApi } from "@/lib/api/users";
import { clearToken, getToken, setToken } from "@/lib/token";
import type { User } from "@/types/api";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (getToken()) {
        try {
          setUser(await usersApi.me());
        } catch {
          clearToken();
        }
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const { accessToken } = await authApi.login(email, password);
    setToken(accessToken);
    setUser(await usersApi.me());
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
