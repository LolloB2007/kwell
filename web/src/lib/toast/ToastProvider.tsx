"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Toast = {
  id: number;
  message: string;
  action?: { label: string; href: string };
  variant?: "default" | "success";
};

type Ctx = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<Ctx | null>(null);
let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = nextId++;
    setToasts((p) => [...p, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((p) => p.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const value = useMemo<Ctx>(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside <ToastProvider>");
  return ctx;
}
