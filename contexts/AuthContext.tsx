"use client";

import React, { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

interface AuthContextType {
  session: Session | null;
  user: Session["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const login = async () => {
    await signIn("google", { callbackUrl: "/" });
    // redirecionamento será automático
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const value: AuthContextType = {
    session,
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
