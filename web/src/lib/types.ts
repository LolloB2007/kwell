export type Category = {
  id: number;
  slug: string;
  /** Default localized name (Italian, matches the brand's primary locale). */
  name: string;
  /** Italian display name. */
  name_it: string;
  /** English display name. */
  name_en: string;
  /** Default localized description. */
  description?: string;
  description_it?: string;
  description_en?: string;
  parent_id?: number | null;
  image_url?: string | null;
  product_count?: number;
};

export type Product = {
  id: number;
  slug: string;
  /** Default localized name (Italian, matches the brand's primary locale). */
  name: string;
  /** Italian display name. */
  name_it: string;
  /** English display name. */
  name_en: string;
  /** Default localized short description. */
  short_description?: string;
  short_description_it?: string;
  short_description_en?: string;
  /**
   * Bilingual exercise / keyword vocabulary used by the catalog search.
   * Not displayed in the UI. Tokens may be Italian, English, or both.
   */
  exercises?: string[];
  price: number;
  price_compare?: number | null;
  currency: string;
  image_url: string | null;
  category_ids: number[];
  in_stock: boolean;
  badges?: string[];
};
