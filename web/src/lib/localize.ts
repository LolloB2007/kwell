import type { Category, Product } from "./types";
import type { Locale } from "./i18n/dictionary";

/**
 * Hardcoded category label fallback keyed by slug. This is the canonical
 * source of truth for the seven Kwell categories — used when the API
 * response doesn't include `name_it` / `name_en` (e.g. real PrestaShop
 * Webservice, which only returns one language; or stale dev-server data
 * cached before the bilingual fields were added).
 */
const CATEGORY_LABELS: Record<string, { name_it: string; name_en: string; desc_it: string; desc_en: string }> = {
  functional: {
    name_it: "Allenamento Funzionale",
    name_en: "Functional Training",
    desc_it: "Rig, rack, slitte e sistemi modulari per la performance funzionale.",
    desc_en: "Rigs, racks, sleds, and modular systems for functional performance.",
  },
  cardio: {
    name_it: "Cardio",
    name_en: "Cardio",
    desc_it: "Tapis roulant, bike, vogatori ed ellittiche per uso intensivo.",
    desc_en: "Treadmills, bikes, rowers, and ellipticals built for high-volume use.",
  },
  strength: {
    name_it: "Forza & Cross-Training",
    name_en: "Strength & Cross-Training",
    desc_it: "Pesi liberi, plate-loaded e attrezzi selezionati.",
    desc_en: "Free weights, plate-loaded, and selectorized strength.",
  },
  "yoga-pilates": {
    name_it: "Yoga & Pilates",
    name_en: "Yoga & Pilates",
    desc_it: "Tappetini, reformer, accessori e strumenti per l'equilibrio.",
    desc_en: "Mats, reformers, props, and balance tools.",
  },
  boxing: {
    name_it: "Boxe",
    name_en: "Boxing",
    desc_it: "Sacchi, guanti, fasce e accessori per il ring.",
    desc_en: "Bags, gloves, wraps, and ring accessories.",
  },
  rehab: {
    name_it: "Riabilitazione",
    name_en: "Rehab",
    desc_it: "Attrezzature per recupero, mobilità e riabilitazione.",
    desc_en: "Recovery, mobility, and rehabilitation equipment.",
  },
  flooring: {
    name_it: "Pavimentazioni",
    name_en: "Flooring",
    desc_it: "Piastrelle in gomma, rulli e superfici antiurto.",
    desc_en: "Rubber tiles, rolls, and shock-absorbing surfaces.",
  },
};

/** Pick the locale-correct display name for a category, with safe fallback. */
export function categoryName(c: Category, locale: Locale): string {
  // 1. API-provided localized name
  const apiName = locale === "en" ? c.name_en : c.name_it;
  if (apiName) return apiName;
  // 2. Hardcoded slug-keyed fallback (handles stale API data + real PrestaShop)
  const map = CATEGORY_LABELS[c.slug];
  if (map) return locale === "en" ? map.name_en : map.name_it;
  // 3. Final fallback to whatever default the API returned
  return c.name;
}

/** Pick the locale-correct description for a category, with safe fallback. */
export function categoryDescription(c: Category, locale: Locale): string | undefined {
  const apiDesc = locale === "en" ? c.description_en : c.description_it;
  if (apiDesc) return apiDesc;
  const map = CATEGORY_LABELS[c.slug];
  if (map) return locale === "en" ? map.desc_en : map.desc_it;
  return c.description;
}

/** Pick the locale-correct display name for a product, with safe fallback. */
export function productName(p: Product, locale: Locale): string {
  return (locale === "en" ? p.name_en : p.name_it) || p.name;
}

/** Pick the locale-correct short description for a product, with safe fallback. */
export function productDescription(p: Product, locale: Locale): string | undefined {
  return (locale === "en" ? p.short_description_en : p.short_description_it) || p.short_description;
}
