"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

export type CartLine = { id: number; slug: string; name: string; price: number; image_url: string | null; qty: number };

type ShopState = {
  cart: CartLine[];
  wishlist: number[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  removeWishlist: (id: number) => void;
  clearWishlist: () => void;
  inWishlist: (id: number) => boolean;
  subtotal: number;
};

const ShopContext = createContext<ShopState | null>(null);
const STORAGE_KEY = "kwell.shop.v1";

type Persisted = { cart: CartLine[]; wishlist: number[] };

function readPersisted(): Persisted {
  if (typeof window === "undefined") return { cart: [], wishlist: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cart: [], wishlist: [] };
    const parsed = JSON.parse(raw);
    return { cart: Array.isArray(parsed.cart) ? parsed.cart : [], wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [] };
  } catch {
    return { cart: [], wishlist: [] };
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = readPersisted();
    setCart(p.cart);
    setWishlist(p.wishlist);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist })); } catch {}
  }, [cart, wishlist, hydrated]);

  const addToCart = useCallback((p: Product, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.id === p.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { id: p.id, slug: p.slug, name: p.name, price: p.price, image_url: p.image_url, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => setCart((p) => p.filter((l) => l.id !== id)), []);
  const setQty = useCallback((id: number, qty: number) => {
    setCart((p) => p.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l)));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }, []);
  const removeWishlist = useCallback((id: number) => setWishlist((p) => p.filter((x) => x !== id)), []);
  const clearWishlist = useCallback(() => setWishlist([]), []);
  const inWishlist = useCallback((id: number) => wishlist.includes(id), [wishlist]);

  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.price * l.qty, 0), [cart]);

  const value = useMemo<ShopState>(
    () => ({ cart, wishlist, addToCart, removeFromCart, setQty, clearCart, toggleWishlist, removeWishlist, clearWishlist, inWishlist, subtotal }),
    [cart, wishlist, addToCart, removeFromCart, setQty, clearCart, toggleWishlist, removeWishlist, clearWishlist, inWishlist, subtotal]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be inside <ShopProvider>");
  return ctx;
}
