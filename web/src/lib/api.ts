import type { Category, Product } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: 60 }, ...init });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getCategories(): Promise<Category[]> {
  const { categories } = await fetchJSON<{ categories: Category[] }>("/categories");
  return categories;
}

export async function getCategory(slug: string): Promise<{ category: Category; products: Product[] } | null> {
  try {
    return await fetchJSON(`/categories/${slug}`);
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const { products } = await fetchJSON<{ products: Product[] }>(`/products?limit=${limit}`);
  return products;
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { product } = await fetchJSON<{ product: Product }>(`/products/${slug}`);
    return product;
  } catch {
    return null;
  }
}

/**
 * Pull a small "related products" set from the same category, excluding
 * the current product. Falls back to a generic featured list if no
 * category match is available.
 */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  try {
    const all = await getFeaturedProducts(50);
    const sameCat = all.filter((p) => p.id !== product.id && p.category_ids.some((c) => product.category_ids.includes(c)));
    if (sameCat.length >= limit) return sameCat.slice(0, limit);
    // Top up from any remaining products if needed.
    const filler = all.filter((p) => p.id !== product.id && !sameCat.includes(p)).slice(0, limit - sameCat.length);
    return [...sameCat, ...filler];
  } catch {
    return [];
  }
}

export async function submitLead(payload: Record<string, unknown>) {
  const res = await fetch(`${API}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}
