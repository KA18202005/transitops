"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { login, logout, getMe, signup } from "@/services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    async function loadUser() {
      const token = typeof window !== "undefined" ? localStorage.getItem("transitops_token") : null;
      if (!token) {
        setLoading(false);
        if (!isAuthRoute) {
          router.push("/login");
        }
        return;
      }

      try {
        const profile = await getMe();
        setUser(profile);
      } catch (error) {
        console.error("Failed to load user profile", error);
        // Token is invalid/expired
        logout();
        setUser(null);
        if (!isAuthRoute) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [pathname, router, isAuthRoute]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const data = await login(credentials);
      const profile = await getMe();
      setUser(profile);
      router.push("/dashboard");
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  const handleSignup = async (userData) => {
    return await signup(userData);
  };

  const value = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
