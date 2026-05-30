import { request } from "undici";
import { XMLParser } from "fast-xml-parser";
import type { Category, Product } from "./types.js";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mock-data.js";

const USE_MOCK = (process.env.USE_MOCK ?? "true") === "true";
const PS_URL = process.env.PS_URL ?? "";
const PS_WS_KEY = process.env.PS_WS_KEY ?? "";
const TTL_MS = Number(process.env.CACHE_TTL_SECONDS ?? 300) * 1000;

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

type CacheEntry<T> = { value: T; expires: number };
const cache = new Map<string, CacheEntry<unknown>>();

function memo<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.value);
  return fn().then((value) => {
    cache.set(key, { value, expires: Date.now() + TTL_MS });
    return value;
  });
}

async function ps(path: string, query: Record<string, string> = {}) {
  if (!PS_URL || !PS_WS_KEY) {
    throw new Error("PrestaShop credentials not configured (PS_URL / PS_WS_KEY)");
  }
  const params = new URLSearchParams({ ws_key: PS_WS_KEY, output_format: "JSON", ...query });
  const url = `${PS_URL.replace(/\/$/, "")}/api${path}?${params}`;
  const { statusCode, body } = await request(url, { headers: { Accept: "application/json" } });
  const text = await body.text();
  if (statusCode >= 400) throw new Error(`PrestaShop ${statusCode}: ${text.slice(0, 200)}`);
  try {
    return JSON.parse(text);
  } catch {
    return parser.parse(text);
  }
}

export async function listCategories(): Promise<Category[]> {
  if (USE_MOCK) return MOCK_CATEGORIES;
  return memo("categories", async () => {
    const raw = await ps("/categories", { display: "[id,link_rewrite,name,description,id_parent,nb_products_recursive]" });
    const items = raw?.categories ?? [];
    return items.map((c: any): Category => {
      const name = String(c.name?.[0]?.value ?? c.name ?? "");
      const desc = c.description?.[0]?.value ?? c.description ?? undefined;
      return {
        id: Number(c.id),
        slug: String(c.link_rewrite ?? c.id),
        name,
        name_it: name,
        name_en: name,
        description: desc,
        description_it: desc,
        description_en: desc,
        parent_id: c.id_parent ? Number(c.id_parent) : null,
        image_url: null,
        product_count: Number(c.nb_products_recursive ?? 0),
      };
    });
  });
}

export async function listProducts(opts: { categoryId?: number; limit?: number } = {}): Promise<Product[]> {
  if (USE_MOCK) {
    let p = MOCK_PRODUCTS;
    if (opts.categoryId) p = p.filter((x) => x.category_ids.includes(opts.categoryId!));
    if (opts.limit) p = p.slice(0, opts.limit);
    return p;
  }
  return memo(`products:${opts.categoryId ?? "all"}:${opts.limit ?? "all"}`, async () => {
    const filter: Record<string, string> = {
      display: "[id,link_rewrite,name,description_short,price,id_default_image,quantity]",
      limit: String(opts.limit ?? 50),
    };
    if (opts.categoryId) filter["filter[id_category_default]"] = String(opts.categoryId);
    const raw = await ps("/products", filter);
    const items = raw?.products ?? [];
    return items.map((p: any): Product => {
      const name = String(p.name?.[0]?.value ?? p.name ?? "");
      const desc = p.description_short?.[0]?.value ?? undefined;
      return {
        id: Number(p.id),
        slug: String(p.link_rewrite ?? p.id),
        name,
        // PrestaShop's REST returns the configured shop language only. Until
        // a per-locale mapping is added, both fields mirror the single name.
        name_it: name,
        name_en: name,
        short_description: desc,
        short_description_it: desc,
        short_description_en: desc,
        exercises: [],
        price: Number(p.price ?? 0),
        price_compare: null,
        currency: "EUR",
        image_url: p.id_default_image ? `${PS_URL}/api/images/products/${p.id}/${p.id_default_image}` : null,
        category_ids: opts.categoryId ? [opts.categoryId] : [],
        in_stock: Number(p.quantity ?? 0) > 0,
      };
    });
  });
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  const all = await listProducts({});
  return all.find((p) => p.slug === idOrSlug || String(p.id) === idOrSlug) ?? null;
}

export async function getCategory(idOrSlug: string): Promise<Category | null> {
  const all = await listCategories();
  return all.find((c) => c.slug === idOrSlug || String(c.id) === idOrSlug) ?? null;
}
