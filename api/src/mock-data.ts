import type { Category, Product } from "./types.js";

// Helper: Italian = primary `name`/`description` to match the brand locale.
function cat(p: {
  id: number; slug: string;
  name_it: string; name_en: string;
  desc_it: string; desc_en: string;
  product_count: number;
}): Category {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name_it,
    name_it: p.name_it,
    name_en: p.name_en,
    description: p.desc_it,
    description_it: p.desc_it,
    description_en: p.desc_en,
    image_url: null,
    product_count: p.product_count,
  };
}

export const MOCK_CATEGORIES: Category[] = [
  cat({
    id: 1, slug: "functional",
    name_it: "Allenamento Funzionale",
    name_en: "Functional Training",
    desc_it: "Rig, rack, slitte e sistemi modulari per la performance funzionale.",
    desc_en: "Rigs, racks, sleds, and modular systems for functional performance.",
    product_count: 84,
  }),
  cat({
    id: 2, slug: "cardio",
    name_it: "Cardio",
    name_en: "Cardio",
    desc_it: "Tapis roulant, bike, vogatori ed ellittiche per uso intensivo.",
    desc_en: "Treadmills, bikes, rowers, and ellipticals built for high-volume use.",
    product_count: 62,
  }),
  cat({
    id: 3, slug: "strength",
    name_it: "Forza & Cross-Training",
    name_en: "Strength & Cross-Training",
    desc_it: "Pesi liberi, plate-loaded e attrezzi selezionati.",
    desc_en: "Free weights, plate-loaded, and selectorized strength.",
    product_count: 121,
  }),
  cat({
    id: 4, slug: "yoga-pilates",
    name_it: "Yoga & Pilates",
    name_en: "Yoga & Pilates",
    desc_it: "Tappetini, reformer, accessori e strumenti per l'equilibrio.",
    desc_en: "Mats, reformers, props, and balance tools.",
    product_count: 47,
  }),
  cat({
    id: 5, slug: "boxing",
    name_it: "Boxe",
    name_en: "Boxing",
    desc_it: "Sacchi, guanti, fasce e accessori per il ring.",
    desc_en: "Bags, gloves, wraps, and ring accessories.",
    product_count: 38,
  }),
  cat({
    id: 6, slug: "rehab",
    name_it: "Riabilitazione",
    name_en: "Rehab",
    desc_it: "Attrezzature per recupero, mobilità e riabilitazione.",
    desc_en: "Recovery, mobility, and rehabilitation equipment.",
    product_count: 29,
  }),
  cat({
    id: 7, slug: "flooring",
    name_it: "Pavimentazioni",
    name_en: "Flooring",
    desc_it: "Piastrelle in gomma, rulli e superfici antiurto.",
    desc_en: "Rubber tiles, rolls, and shock-absorbing surfaces.",
    product_count: 22,
  }),
];

// Helper to build a Product cleanly. Sets default `name` and
// `short_description` to the Italian variants (matches the brand locale).
function mk(p: {
  id: number; slug: string;
  name_it: string; name_en: string;
  desc_it?: string; desc_en?: string;
  exercises?: string[];
  price: number; price_compare?: number;
  category_ids: number[]; badges?: string[];
}): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name_it,
    name_it: p.name_it,
    name_en: p.name_en,
    short_description: p.desc_it,
    short_description_it: p.desc_it,
    short_description_en: p.desc_en,
    exercises: p.exercises,
    price: p.price,
    price_compare: p.price_compare ?? null,
    currency: "EUR",
    image_url: null,
    category_ids: p.category_ids,
    in_stock: true,
    badges: p.badges,
  };
}

export const MOCK_PRODUCTS: Product[] = [
  mk({
    id: 101, slug: "k-rig-pro-3m",
    name_it: "Rig Funzionale K-Rig Pro 3M",
    name_en: "K-Rig Pro 3M Functional Rig",
    desc_it: "Rig funzionale modulare, campata 3 metri",
    desc_en: "Modular functional rig, 3-meter span",
    exercises: [
      "pull-up", "trazioni", "trazione", "muscle-up", "muscle up", "dip", "dips", "parallele",
      "front lever", "back lever", "rope climb", "salita corda", "ring", "anelli",
      "battle rope", "corda battaglia", "wall ball", "calisthenics", "calistenica",
      "ginnastica", "suspension trainer", "trx", "rig", "functional",
    ],
    price: 4990, category_ids: [1], badges: ["new"],
  }),
  mk({
    id: 102, slug: "k-rack-half",
    name_it: "Half Rack K-Rack",
    name_en: "K-Rack Half",
    desc_it: "Half rack con sbarra trazioni",
    desc_en: "Half rack with pull-up bar",
    exercises: [
      "squat", "back squat", "front squat", "overhead squat", "panca", "panca piana",
      "bench press", "press", "military press", "shoulder press", "spinte sopra la testa",
      "pull-up", "trazioni", "chin-up", "deadlift", "stacco", "stacchi", "rack pull",
      "good morning", "lunges", "affondi", "rack", "power rack", "half rack",
    ],
    price: 1490, category_ids: [3],
  }),
  mk({
    id: 103, slug: "k-treadmill-x",
    name_it: "Tapis Roulant K-Treadmill X",
    name_en: "K-Treadmill X Treadmill",
    desc_it: "Tapis roulant commerciale a listoni",
    desc_en: "Commercial slat-belt treadmill",
    exercises: [
      "corsa", "running", "run", "jog", "jogging", "camminata", "walking",
      "sprint", "hiit", "intervalli", "interval training", "treadmill", "tapis roulant",
      "cardio", "fondo", "endurance", "fartlek",
    ],
    price: 7990, price_compare: 8990, category_ids: [2], badges: ["sale"],
  }),
  mk({
    id: 104, slug: "k-rower-air",
    name_it: "Vogatore ad Aria K-Rower",
    name_en: "K-Rower Air Rower",
    desc_it: "Vogatore ad aria con monitor PM5",
    desc_en: "Air resistance rower with PM5",
    exercises: [
      "vogatore", "rowing", "row", "remare", "remoergometro", "ergometro",
      "concept2", "ergometer", "erg", "cardio", "full body cardio", "rower",
      "vogata", "metcon",
    ],
    price: 1190, category_ids: [2],
  }),
  mk({
    id: 105, slug: "k-hex-set",
    name_it: "Set Manubri Esagonali K-Hex 2.5–25 kg",
    name_en: "K-Hex Dumbbell Set 2.5–25 kg",
    desc_it: "Set di manubri esagonali in gomma, in coppia",
    desc_en: "Rubber hex set, paired",
    exercises: [
      "curl", "biceps curl", "curl bicipiti", "hammer curl", "shoulder press",
      "spinte spalle", "lateral raise", "alzate laterali", "panca", "bench press",
      "row", "rematore", "dumbbell row", "rematore con manubrio", "lunges", "affondi",
      "goblet squat", "stacco", "deadlift", "romanian deadlift", "rdl",
      "stacco rumeno", "tricep extension", "estensioni tricipiti", "chest fly", "croci",
      "panca inclinata", "incline bench", "manubri", "dumbbell", "dumbbells",
      "bicipiti", "biceps", "tricipiti", "triceps",
    ],
    price: 980, category_ids: [3],
  }),
  mk({
    id: 106, slug: "k-kettlebell-comp",
    name_it: "Kettlebell da Competizione K-Kettlebell 16kg",
    name_en: "K-Kettlebell Competition 16kg",
    desc_it: "Kettlebell da competizione in acciaio",
    desc_en: "Steel competition kettlebell",
    exercises: [
      "kettlebell", "kettlebell swing", "swing", "russian swing", "american swing",
      "snatch", "strappo", "clean", "girata", "clean and press",
      "turkish getup", "tgu", "goblet squat", "squat", "girevoy", "kettlebell sport",
      "kettlebell flow", "windmill", "halo", "press kettlebell", "long cycle",
      "ghisa", "competizione",
    ],
    price: 89, category_ids: [3],
  }),
  mk({
    id: 107, slug: "k-bag-heavy",
    name_it: "Sacco Pesante K-Bag 35kg",
    name_en: "K-Bag Heavy Bag 35kg",
    desc_it: "Sacco pesante a sospensione, rivestimento in vinile",
    desc_en: "Hanging heavy bag, vinyl shell",
    exercises: [
      "boxe", "boxing", "pugilato", "muay thai", "kickboxing", "kick boxing",
      "mma", "jab", "cross", "diretto", "hook", "gancio", "uppercut", "montante",
      "calci", "kicks", "low kick", "round kick", "knee", "ginocchiate",
      "elbows", "gomitate", "sacco", "saccoboxe", "punching", "heavy bag",
      "punching bag", "shadow boxing",
    ],
    price: 219, category_ids: [5],
  }),
  mk({
    id: 108, slug: "k-mat-pro",
    name_it: "Tappetino K-Mat Pro 8mm",
    name_en: "K-Mat Pro 8mm Mat",
    desc_it: "Tappetino studio per yoga e pilates",
    desc_en: "Yoga & pilates studio mat",
    exercises: [
      "yoga", "vinyasa", "hatha", "ashtanga", "yin yoga", "pilates",
      "stretching", "allungamento", "mobility", "mobilità", "meditazione", "meditation",
      "saluto al sole", "sun salutation", "plank", "core", "addominali", "ab work",
      "crunch", "downward dog", "cane a testa in giù", "asana", "tappetino", "mat",
      "ground work", "lavoro a terra",
    ],
    price: 49, category_ids: [4],
  }),
  mk({
    id: 109, slug: "k-reformer-studio",
    name_it: "Reformer Pilates K-Reformer Studio",
    name_en: "K-Reformer Studio Pilates Reformer",
    desc_it: "Reformer per pilates, livello studio",
    desc_en: "Pilates reformer, studio grade",
    exercises: [
      "pilates", "reformer", "pilates reformer", "leg circles", "footwork",
      "the hundred", "hundred", "spine stretch", "swan", "elephant",
      "running on the reformer", "long box", "short box", "jumpboard",
      "core stability", "controllo posturale", "powerhouse", "rieducazione",
      "postural rehabilitation",
    ],
    price: 2890, category_ids: [4],
  }),
  mk({
    id: 110, slug: "k-floor-tile-25mm",
    name_it: "Piastrella Pavimento K-Floor 25mm",
    name_en: "K-Floor Tile 25mm Flooring",
    desc_it: "Piastrella in gomma antiurto, 1m²",
    desc_en: "Shock-absorbing rubber tile 1m²",
    exercises: [
      "olympic lifting", "weightlifting", "sollevamento pesi", "drop", "stacchi",
      "deadlift", "clean and jerk", "snatch", "strappo", "slancio",
      "pesi olimpici", "crossfit", "drop weight", "flooring", "pavimentazione",
      "antiurto", "piastrelle", "tiles", "shock absorbing",
    ],
    price: 39, category_ids: [7],
  }),
  mk({
    id: 111, slug: "k-roller-foam",
    name_it: "Foam Roller K-Roller EVA",
    name_en: "K-Roller Foam EVA Roller",
    desc_it: "Foam roller in schiuma ad alta densità per il recupero",
    desc_en: "High-density recovery foam roller",
    exercises: [
      "foam roller", "self-myofascial release", "smr", "rilascio miofasciale",
      "recupero", "recovery", "mobility", "mobilità", "stretching", "allungamento",
      "trigger point", "warm up", "riscaldamento", "rolling", "mobilità schiena",
      "back mobility", "rullo", "automassaggio", "self massage",
    ],
    price: 29, category_ids: [6],
  }),
  mk({
    id: 112, slug: "k-bike-spin",
    name_it: "Spin Bike K-Bike Pro",
    name_en: "K-Bike Spin Pro Indoor Bike",
    desc_it: "Cyclette da indoor cycling, resistenza magnetica",
    desc_en: "Indoor cycling bike, magnetic",
    exercises: [
      "spinning", "indoor cycling", "spin class", "cyclette", "ciclismo", "cycling",
      "bike", "hiit", "interval training", "intervalli", "tabata", "sprint",
      "endurance", "fondo", "soglia anaerobica", "watt", "rpm",
      "bicicletta da camera", "stationary bike",
    ],
    price: 1290, category_ids: [2],
  }),
];
