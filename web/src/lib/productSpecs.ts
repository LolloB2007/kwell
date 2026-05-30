import type { Product } from "./types";

const STEEL_GRADES = ["S235JR", "S275JR", "S355J2", "AISI 304", "AISI 316"];

/**
 * Derives plausible, deterministic specs from a product id when the catalog
 * doesn't supply them. Same product always returns the same numbers so the
 * UI doesn't shuffle between renders.
 */
export type DerivedSpecs = { steel: string; weightKg: number; warrantyYears: number };

export function deriveSpecs(p: Product): DerivedSpecs {
  // Cheap deterministic hash from the id
  const h = Math.abs(p.id * 2654435761) >>> 0;
  const steel = STEEL_GRADES[h % STEEL_GRADES.length];
  // Weight scales loosely with price tier
  const tier = Math.min(10, Math.max(1, Math.floor(Math.log10(Math.max(10, p.price)))));
  const weightKg = 4 + ((h >> 4) % (tier * 18));
  const warrantyYears = p.price >= 1000 ? 5 : p.price >= 200 ? 3 : 2;
  return { steel, weightKg, warrantyYears };
}
