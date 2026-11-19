"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { usersApi } from "@/lib/api/users";
import { clearToken, getToken, setToken, authChangedEventName } from "@/lib/token";
import { config } from "@/lib/config";
import type { ProfileInput, User } from "@/types/api";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<User>;
  saveProfile: (profile: ProfileInput) => Promise<User>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const syncAuthState = () => {
      if (!getToken()) setUser(null);
    };
    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== config.tokenStorageKey && event.key !== null) return;
      if (!getToken()) { setUser(null); return; }
      void usersApi.me().then((currentUser) => { if (active) setUser(currentUser); }).catch(() => {
        if (!getToken() && active) setUser(null);
      });
    };
    window.addEventListener(authChangedEventName(), syncAuthState);
    window.addEventListener("storage", syncAcrossTabs);

    const restoreSession = async () => {
      if (getToken()) {
        try {
          const currentUser = await usersApi.me();
          if (active) setUser(currentUser);
        } catch {
          if (!getToken() && active) setUser(null);
        }
      }
      if (active) setIsLoading(false);
    };
    void restoreSession();

    return () => {
      active = false;
      window.removeEventListener(authChangedEventName(), syncAuthState);
      window.removeEventListener("storage", syncAcrossTabs);
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await usersApi.me();
    setUser(currentUser);
    return currentUser;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email.trim(), password);
    setToken(response.accessToken);
    try {
      const currentUser = await usersApi.me();
      setUser(currentUser);
      setIsLoading(false);
    } catch (error) {
      clearToken();
      setUser(null);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const saveProfile = useCallback(async (profile: ProfileInput) => {
    const updatedUser = await usersApi.updateProfile(profile);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser, saveProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
