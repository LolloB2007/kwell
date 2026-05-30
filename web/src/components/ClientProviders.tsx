"use client";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ShopProvider } from "@/lib/shop/ShopProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { ToastProvider } from "@/lib/toast/ToastProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ShopProvider>
            <ToastProvider>{children}</ToastProvider>
          </ShopProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
