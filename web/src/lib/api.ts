import type { Category, Product } from "./types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mock-catalogue";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// On the static GitHub Pages build there is no backend, so we skip the
// fetch entirely and serve the bundled mock catalogue. Locally and in
// any deployment that sets NEXT_PUBLIC_API_URL, the real API is used.
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: 60 }, ...init });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) return MOCK_CATEGORIES;
  try {
    const { categories } = await fetchJSON<{ categories: Category[] }>("/categories");
    return categories;
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getCategory(slug: string): Promise<{ category: Category; products: Product[] } | null> {
  const mockResult = () => {
    const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
    if (!category) return null;
    const products = MOCK_PRODUCTS.filter((p) => p.category_ids.includes(category.id));
    return { category, products };
  };
  if (USE_MOCK) return mockResult();
  try {
    return await fetchJSON(`/categories/${slug}`);
  } catch {
    return mockResult();
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  if (USE_MOCK) return MOCK_PRODUCTS.slice(0, limit);
  try {
    const { products } = await fetchJSON<{ products: Product[] }>(`/products?limit=${limit}`);
    return products;
  } catch {
    return MOCK_PRODUCTS.slice(0, limit);
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (USE_MOCK) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  try {
    const { product } = await fetchJSON<{ product: Product }>(`/products/${slug}`);
    return product;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
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
    const filler = all.filter((p) => p.id !== product.id && !sameCat.includes(p)).slice(0, limit - sameCat.length);
    return [...sameCat, ...filler];
  } catch {
    return [];
  }
}

export async function submitLead(payload: Record<string, unknown>) {
  if (USE_MOCK) return true;
  const res = await fetch(`${API}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}
