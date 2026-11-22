export interface TreatmentItem {
  id: string;
  name: string;
  category: "General" | "Facial" | "Laser" | "Skin Booster";
  price: string;
  numericPrice: number;
  originalPrice?: string;
  duration: string;
  numericMinutes: number;
  overview: string;
  benefits: string[];
  recommended?: boolean;
}

export const TREATMENTS_DATA: TreatmentItem[] = [
  {
    id: "doctor-consultation",
    name: "Doctor Consultation",
    category: "General",
    price: "FREE",
    numericPrice: 0,
    originalPrice: "Rp 250.000",
    duration: "15 mins",
    numericMinutes: 15,
    overview: "Full clinical skin barrier assessment and digital mapping with an aesthetic specialist MD.",
    benefits: [
      "Microscopic skin barrier & sebum analysis",
      "Personalized medical aesthetic roadmap",
      "Zero sales pressure consultation"
    ],
    recommended: true
  },
  {
    id: "deep-cleansing-facial",
    name: "Deep Cleansing Facial",
    category: "Facial",
    price: "Rp 399.000",
    numericPrice: 399000,
    duration: "60 mins",
    numericMinutes: 60,
    overview: "Gentle manual extraction, ultrasonic exfoliation, and a custom soothing mask to reset stressed skin.",
    benefits: [
      "Clears dead skin cells and surface debris",
      "Painless extraction of blackheads & whiteheads",
      "Soothes redness with botanic cold mask"
    ]
  },
  {
    id: "intensive-acne-facial",
    name: "Intensive Acne Facial",
    category: "Facial",
    price: "Rp 599.000",
    numericPrice: 599000,
    duration: "75 mins",
    numericMinutes: 75,
    overview: "Deep pore purification, high-frequency acne bacteria disinfection, and targeted blue LED light therapy.",
    benefits: [
      "Destroys active P. acnes bacteria",
      "Calms acute inflammatory pustules",
      "Prevents post-inflammatory dark spots"
    ],
    recommended: true
  },
  {
    id: "acne-clarity",
    name: "Acne & Clarity Treatment",
    category: "Facial",
    price: "Rp 799.000",
    numericPrice: 799000,
    duration: "60 mins",
    numericMinutes: 60,
    overview: "Targeted clinical acne reset combining medical extractions, chemical exfoliation, and barrier rebalancing.",
    benefits: [
      "Purifies deeply congested pores",
      "Restores natural skin acid mantle",
      "Regulates excess sebum production"
    ]
  },
  {
    id: "luminous-glass-skin",
    name: "Luminous Glass Skin Facial",
    category: "Facial",
    price: "Rp 999.000",
    numericPrice: 999000,
    duration: "90 mins",
    numericMinutes: 90,
    overview: "Signature transdermal infusion delivering deep hyaluronic acid, sonophoresis serums, and cooling collagen mask.",
    benefits: [
      "Immediate translucent, reflective glass glow",
      "Deep dermal hydration lasting weeks",
      "Minimizes enlarged pores and fine dry lines"
    ],
    recommended: true
  },
  {
    id: "pico-laser-brightening",
    name: "Pico Laser Brightening",
    category: "Laser",
    price: "Rp 1.490.000",
    numericPrice: 1490000,
    duration: "45 mins",
    numericMinutes: 45,
    overview: "State-of-the-art picosecond laser that shatters melanin and pigment particles to clear stubborn dark spots.",
    benefits: [
      "Dramatically evens out dull skin tone",
      "Fades sun spots, melasma, and PIH marks",
      "Zero social downtime (minimal redness)"
    ]
  },
  {
    id: "pico-brilliance",
    name: "Pico Brilliance Therapy",
    category: "Laser",
    price: "Rp 1.490.000",
    numericPrice: 1490000,
    duration: "45 mins",
    numericMinutes: 45,
    overview: "Collagen-stimulating fractional picosecond laser to improve overall texture, refine pores, and smooth scars.",
    benefits: [
      "Stimulates deep neocollagenesis",
      "Tightens texture and refines enlarged pores",
      "Safe for all Fitzpatrick skin types"
    ],
    recommended: true
  },
  {
    id: "youthful-contour",
    name: "Youthful Contour Infusion",
    category: "Skin Booster",
    price: "Rp 2.490.000",
    numericPrice: 2490000,
    duration: "30 mins",
    numericMinutes: 30,
    overview: "Combines targeted RF skin tightening with a high-potency cocktail of anti-aging peptides and growth factors.",
    benefits: [
      "Lifts and sculpts sagging jawline & contours",
      "Softens dynamic expression lines",
      "Immediate tightening with no needle downtime"
    ]
  },
  {
    id: "premium-skin-booster",
    name: "Premium Skin Booster",
    category: "Skin Booster",
    price: "Rp 2.490.000",
    numericPrice: 2490000,
    duration: "30 mins",
    numericMinutes: 30,
    overview: "Direct micro-hydration of pure cross-linked hyaluronic acid to lock in intense moisture and plumpness.",
    benefits: [
      "Direct cellular hydration reservoir",
      "Increases skin elasticity and bounce",
      "Smooths crepey, dehydrated skin texture"
    ]
  },
  {
    id: "dna-salmon-restoration",
    name: "DNA Salmon Skin Restoration",
    category: "Skin Booster",
    price: "Rp 2.990.000",
    numericPrice: 2990000,
    duration: "45 mins",
    numericMinutes: 45,
    overview: "Cell-regenerating salmon PDRN booster to repair damaged skin barriers, stimulate micro-healing, and smooth wrinkles.",
    benefits: [
      "Accelerates biological skin repair & regeneration",
      "Strengthens compromised skin barrier",
      "Promotes lasting radiant skin luminosity"
    ],
    recommended: true
  }
];

export const TREATMENT_CATEGORIES = ["All", "General", "Facial", "Laser", "Skin Booster"] as const;
