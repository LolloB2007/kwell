"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Demo only — never store plaintext passwords in production
  passwordHash: string;
  createdAt: string;
  customerCode: string;
};

export type SessionUser = Omit<StoredUser, "passwordHash">;

type RegisterPayload = { firstName: string; lastName: string; email: string; password: string };

type RegisterResult = { ok: true; user: StoredUser } | { ok: false; error: "email_taken" | "weak_password" | "invalid" };
type LoginResult = { ok: true; user: SessionUser } | { ok: false; error: "not_found" | "wrong_password" };

type AuthState = {
  user: SessionUser | null;
  hydrated: boolean;
  users: StoredUser[];
  register: (p: RegisterPayload) => RegisterResult;
  login: (email: string, password: string) => LoginResult;
  signIn: (user: StoredUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);
const USERS_KEY = "kwell.users.v1";
const SESSION_KEY = "kwell.session.v1";

// Lightweight non-cryptographic hash. THIS IS A MOCK — do not use in production.
function demoHash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16);
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? "[]"); } catch { return []; }
}
function writeUsers(users: StoredUser[]) {
  try { window.localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
}
function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? "null"); } catch { return null; }
}
function writeSession(user: SessionUser | null) {
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {}
}

function genCustomerCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `KW—CL/${n}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUsers(readUsers());
    setUser(readSession());
    setHydrated(true);
  }, []);

  const register = useCallback((p: RegisterPayload): RegisterResult => {
    const email = p.email.trim().toLowerCase();
    if (!email || !p.password || !p.firstName) return { ok: false, error: "invalid" };
    if (p.password.length < 6) return { ok: false, error: "weak_password" };
    const existing = readUsers();
    if (existing.some((u) => u.email === email)) return { ok: false, error: "email_taken" };
    const stored: StoredUser = {
      id: `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      email,
      passwordHash: demoHash(p.password),
      createdAt: new Date().toISOString(),
      customerCode: genCustomerCode(),
    };
    const next = [...existing, stored];
    writeUsers(next);
    setUsers(next);
    return { ok: true, user: stored };
  }, []);

  const login = useCallback((email: string, password: string): LoginResult => {
    const normalized = email.trim().toLowerCase();
    const existing = readUsers();
    const found = existing.find((u) => u.email === normalized);
    if (!found) return { ok: false, error: "not_found" };
    if (found.passwordHash !== demoHash(password)) return { ok: false, error: "wrong_password" };
    const session: SessionUser = { id: found.id, firstName: found.firstName, lastName: found.lastName, email: found.email, createdAt: found.createdAt, customerCode: found.customerCode };
    writeSession(session);
    setUser(session);
    return { ok: true, user: session };
  }, []);

  const signIn = useCallback((u: StoredUser) => {
    const session: SessionUser = { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, createdAt: u.createdAt, customerCode: u.customerCode };
    writeSession(session);
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(() => ({ user, hydrated, users, register, login, signIn, logout }), [user, hydrated, users, register, login, signIn, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}
