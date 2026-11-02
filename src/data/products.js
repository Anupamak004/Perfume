// ─────────────────────────────────────────────────────────────────────────
// PERFUME STORE — PRODUCT CATALOGUE & DECANTS
//
// Central product catalogue for Perfume Store.
// Supporting full fragrance bottles and discovery decants.
// ─────────────────────────────────────────────────────────────────────────

export const getDefaultSizes = (basePrice) => [
  { label: "5ml Decant", price: Math.round(basePrice * 0.22) },
  { label: "10ml Decant", price: Math.round(basePrice * 0.38) },
  { label: "50ml Bottle", price: Math.round(basePrice * 0.75) },
  { label: "100ml Bottle", price: basePrice },
];

const UNSPLASH = {
  goldBottle: "/images/hero-image.webp",
  darkBottle: "https://images.unsplash.com/photo-1749264361617-dbe17a223f54",
  storeShelf: "https://images.unsplash.com/photo-1763633924253-3c92ce0ba7cf",
  menBottle: "https://images.unsplash.com/photo-1591892212776-a09de24dbe84",
  womenBottle: "https://images.unsplash.com/photo-1589493732575-11a963a7c415",
};

const img = (key, w = 900, h = 1100) =>
  key === "goldBottle" ? UNSPLASH[key] : `${UNSPLASH[key]}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const CATEGORIES = [
  {
    id: "men",
    label: "Men",
    tagline: "Bold • Refined • Confident",
    image: "/images/collection-card1.webp",
  },
  {
    id: "women",
    label: "Women",
    tagline: "Elegant • Floral • Enchanting",
    image: "/images/collection-card2.webp",
  },
  {
    id: "unisex",
    label: "Unisex",
    tagline: "Modern • Distinctive • Timeless",
    image: "/images/collection-card3.webp",
  },
  {
    id: "oud-attar",
    label: "Oud & Attar",
    tagline: "Deep • Rich • Traditional",
    image: "/images/collection-card4.webp",
  },
];

export const FRAGRANCE_TYPES = [
  "Fresh",
  "Woody",
  "Floral",
  "Fruity",
  "Oriental",
  "Musky",
  "Oud",
];

export const PRODUCTS = [
  // ───────────── MEN ─────────────
  {
    id: "velvet-noir",
    name: "Velvet Noir",
    category: "men",
    gender: "Men",
    price: 2499,
    fragranceType: "Spicy • Woody",
    moods: ["Woody", "Musky"],
    occasion: ["Date Night", "Special Occasion"],
    style: ["Bold", "Mysterious"],
    image: "/images/feature1.webp",
    images: [img("menBottle"), img("menBottle", 900, 1100), img("goldBottle")],
    notes: {
      top: ["Bergamot", "Black Pepper"],
      heart: ["Leather", "Cardamom"],
      base: ["Vetiver", "Amber"],
    },
    description:
      "A confident, spice-driven signature built around dark leather and warm amber — for evenings that call for presence.",
    rating: 4.7,
    reviews: 18,
    featured: true,
  },
  {
    id: "missoni-wave",
    name: "Missoni Wave",
    category: "men",
    gender: "Men",
    price: 4500,
    fragranceType: "Fresh • Aquatic • Musky • Green",
    moods: ["Fresh", "Musky"],
    occasion: ["Everyday", "Office"],
    style: ["Fresh", "Elegant"],
    image: "/images/missoni.webp",
    images: ["/images/missoni.webp"],
    notes: {
      top: ["Fresh Aquatic", "Green Notes"],
      heart: ["Aromatic Notes"],
      base: ["Musk"],
    },
    description:
      "Missoni Wave EDT 100ml. A fresh, aquatic, musky-green fragrance made in France, with a scent profile reminiscent of Chanel Allure Homme Sport.",
    rating: 4.8,
    reviews: 0,
    featured: true,
    inStock: true,
    origin: "Made in France",
    sizes: [
      { label: "8ml Decant", price: 450 },
      { label: "100ml Full Bottle", price: 4500 },
    ],
  },
  {
    id: "kaaf-noir",
    name: "Ahmed Al Maghribi Kaaf Noir",
    category: "men",
    gender: "Men",
    price: 2800,
    fragranceType: "Woody • Aromatic • Musky ",
    moods: ["Woody", "Musky"],
    occasion: ["Everyday", "Special Occasion"],
    style: ["Bold", "Elegant"],
    image: "/images/Noir.webp",
    images: ["/images/Noir.webp"],
    notes: {
      top: ["Citrus"],
      heart: ["Aromatic Notes"],
      base: ["Woody Notes", "Musk"],
    },
    description:
      "Ahmed Al Maghribi Kaaf Noir EDP, a 1:1 clone of Dolce & Gabbana The K with a woody, aromatic, musky-citrus character.",
    rating: 0,
    reviews: 0,
    featured: true,
    inStock: true,
    sizes: [
      { label: "8ml Decant", price: 350 },
      { label: "100ml Retail Unit", price: 2800 },
    ],
  },
  {
    id: "boss-bottled-absolu",
    name: "Boss Bottled Absolu",
    category: "men",
    gender: "Men",
    price: 900,
    fragranceType: "Incense • Leather • Patchouli • Cedarwood",
    moods: ["Woody", "Mysterious"],
    occasion: ["Everyday", "Special Occasion"],
    style: ["Bold", "Elegant"],
    image: "/images/boss.webp",
    images: ["/images/boss.webp"],
    notes: {
      top: ["Incense"],
      heart: ["Leather", "Patchouli"],
      base: ["Cedarwood"],
    },
    description:
      "Boss Bottled Absolu EDP, a rich incense, leather, patchouli and cedarwood fragrance, described as the best fragrance from Boss.",
    rating: 0,
    reviews: 0,
    featured: true,
    inStock: true,
    sizes: [
      { label: "3ml Decant", price: 450 },
      { label: "5ml Decant", price: 650 },
      { label: "8ml Decant", price: 900 },
    ],
  },
  {
    id: "carolina-bad-boy-cobalt",
    name: "Carolina Herrera Bad Boy Cobalt Absolute",
    category: "men",
    gender: "Men",
    price: 9000,
    fragranceType: "EDP • Latest Release",
    moods: ["Bold", "Elegant"],
    occasion: ["Everyday", "Special Occasion"],
    style: ["Bold", "Mysterious"],
    image: "/images/carolina.webp",
    images: ["/images/carolina.webp"],
    notes: {
      top: ["Aromatic Notes"],
      heart: ["Cedarwood"],
      base: ["Amberwood"],
    },
    description:
      "The latest Carolina Herrera Bad Boy Cobalt Absolute EDP, now available in a 100ml retail unit and 20ml travel spray.",
    rating: 0,
    reviews: 0,
    featured: true,
    inStock: true,
    sizes: [
      { label: "20ml Travel Spray", price: 2000 },
      { label: "100ml Retail Unit", price: 9000 },
    ],
  },
  {
    id: "eclipse",
    name: "Eclipse",
    category: "men",
    gender: "Men",
    price: 2199,
    fragranceType: "Woody • Musky",
    moods: ["Woody", "Musky"],
    occasion: ["Office", "Everyday"],
    style: ["Bold", "Elegant"],
    image: img("goldBottle"),
    images: [img("goldBottle"), img("menBottle")],
    notes: {
      top: ["Grapefruit", "Cardamom"],
      heart: ["Cedarwood", "Geranium"],
      base: ["Musk", "Oakmoss"],
    },
    description:
      "A composed woody-musk for daily wear — sharp at first light, softening into skin-close warmth by evening.",
    rating: 4.5,
    reviews: 11,
    featured: false,
  },
  {
    id: "iron-oak",
    name: "Iron Oak",
    category: "men",
    gender: "Men",
    price: 1999,
    fragranceType: "Fresh • Woody",
    moods: ["Fresh", "Woody"],
    occasion: ["Office", "Everyday"],
    style: ["Fresh", "Bold"],
    image: img("menBottle", 900, 1101),
    images: [img("menBottle", 900, 1101), img("goldBottle", 900, 1101)],
    notes: {
      top: ["Sea Salt", "Lemon"],
      heart: ["Oak Leaf", "Lavender"],
      base: ["Cedar", "Ambergris"],
    },
    description:
      "Crisp and grounded, like sea air over dry timber — an everyday fragrance with quiet strength.",
    rating: 4.4,
    reviews: 9,
    featured: false,
  },
  {
    id: "midnight-reserve",
    name: "Midnight Reserve",
    category: "men",
    gender: "Men",
    price: 2799,
    fragranceType: "Spicy • Amber",
    moods: ["Woody", "Oud"],
    occasion: ["Special Occasion", "Wedding"],
    style: ["Mysterious", "Bold"],
    image: img("goldBottle", 900, 1102),
    images: [img("goldBottle", 900, 1102), img("darkBottle", 900, 1102)],
    notes: {
      top: ["Saffron", "Pink Pepper"],
      heart: ["Rose", "Incense"],
      base: ["Oud", "Amber", "Tonka Bean"],
    },
    description:
      "An after-dark reserve of saffron, incense and oud — reserved for nights worth remembering.",
    rating: 4.9,
    reviews: 23,
    featured: false,
  },
  {
    id: "jean-paul-gaultier-scandal-pour-homme-le-parfum",
    name: "Jean Paul Gaultier Scandal Pour Homme Le Parfum",
    category: "men",
    gender: "Men",
    price: 650,
    fragranceType: "Woody Amber",
    moods: ["Woody", "Oriental"],
    occasion: ["Date Night", "Special Occasion"],
    style: ["Bold", "Warm"],
    image: "/images/scandal-pour-homme-le-parfum.png",
    images: ["/images/scandal-pour-homme-le-parfum.png"],
    notes: { top: [], heart: [], base: [] },
    description: "An intense woody amber fragrance with geranium, tonka bean, and sandalwood. Available as 8ml and 30ml decants.",
    sizes: [
      { label: "8ml Decant", price: 650, in_stock: true },
      { label: "30ml Decant", price: 2500, in_stock: true },
    ],
    rating: 0,
    reviews: 0,
    featured: false,
  },

  // ───────────── WOMEN ─────────────
  {
    id: "love-muse",
    name: "Love Muse",
    category: "women",
    gender: "Women",
    price: 2499,
    fragranceType: "Fruity • Woody",
    moods: ["Fruity", "Woody"],
    occasion: ["Date Night", "Everyday"],
    style: ["Romantic", "Elegant"],
    image: "/images/feature2.webp",
    images: [img("womenBottle"), img("goldBottle")],
    notes: {
      top: ["Blackcurrant", "Mandarin"],
      heart: ["Peony", "Freesia"],
      base: ["Sandalwood", "Musk"],
    },
    description:
      "A playful fruity-woody blend that opens bright and settles into soft, sandalwood warmth.",
    rating: 4.8,
    reviews: 27,
    featured: true,
  },
  {
    id: "mystique-elegance",
    name: "Mystique Elegance",
    category: "women",
    gender: "Women",
    price: 2499,
    fragranceType: "Floral • Vanilla",
    moods: ["Floral", "Sweet"],
    occasion: ["Wedding", "Special Occasion"],
    style: ["Elegant", "Romantic"],
    image: "/images/feature3.webp",
    images: [
      img("womenBottle", 900, 1101),
      img("goldBottle", 900, 1101),
      img("womenBottle", 700, 900),
    ],
    notes: {
      top: ["Bergamot", "Peach"],
      heart: ["Rose", "Jasmine", "Lily"],
      base: ["Vanilla", "Musk", "Sandalwood"],
    },
    description:
      "A captivating fragrance crafted for those who want to leave a lasting impression — delicate florals warmed by vanilla and musk.",
    rating: 4.8,
    reviews: 12,
    featured: true,
  },
  {
    id: "eternal-radiance",
    name: "Eternal Radiance",
    category: "women",
    gender: "Women",
    price: 2499,
    fragranceType: "Woody • Rose",
    moods: ["Floral", "Woody"],
    occasion: ["Office", "Everyday"],
    style: ["Elegant", "Fresh"],
    image: "/images/feature4.webp",
    images: [img("goldBottle", 900, 1103), img("womenBottle", 900, 1103)],
    notes: {
      top: ["Pink Pepper", "Mandarin"],
      heart: ["Turkish Rose", "Iris"],
      base: ["Cedarwood", "Musk"],
    },
    description:
      "A radiant rose-woody composition — polished, confident and quietly long-lasting.",
    rating: 4.6,
    reviews: 15,
    featured: true,
  },
  {
    id: "blush-romance",
    name: "Blush Romance",
    category: "women",
    gender: "Women",
    price: 2299,
    fragranceType: "Floral • Fruity",
    moods: ["Floral", "Fruity"],
    occasion: ["Date Night", "Everyday"],
    style: ["Romantic", "Fresh"],
    image: img("womenBottle", 900, 1104),
    images: [img("womenBottle", 900, 1104), img("goldBottle", 900, 1104)],
    notes: {
      top: ["Raspberry", "Bergamot"],
      heart: ["Peony", "Rose"],
      base: ["White Musk"],
    },
    description:
      "Soft pink florals over a bed of white musk — a light, romantic everyday wear.",
    rating: 4.5,
    reviews: 14,
    featured: false,
  },
  {
    id: "rose-petal",
    name: "Rose Petal",
    category: "women",
    gender: "Women",
    price: 1899,
    fragranceType: "Floral • Musky",
    moods: ["Floral", "Musky"],
    occasion: ["Everyday", "Office"],
    style: ["Elegant", "Romantic"],
    image: img("womenBottle", 900, 1105),
    images: [img("womenBottle", 900, 1105), img("goldBottle", 900, 1105)],
    notes: {
      top: ["Litchi", "Geranium"],
      heart: ["Damask Rose"],
      base: ["Musk", "Sandalwood"],
    },
    description:
      "A true rose at its centre, framed by soft musk — timeless and easy to wear daily.",
    rating: 4.6,
    reviews: 19,
    featured: false,
  },
  {
    id: "graceful",
    name: "Graceful",
    category: "women",
    gender: "Women",
    price: 2099,
    fragranceType: "Floral • Fruity",
    moods: ["Floral", "Fruity", "Sweet"],
    occasion: ["Everyday", "Date Night"],
    style: ["Fresh", "Romantic"],
    image: img("womenBottle", 900, 1106),
    images: [img("womenBottle", 900, 1106), img("goldBottle", 900, 1106)],
    notes: {
      top: ["Pear", "Pink Grapefruit"],
      heart: ["Jasmine", "Lily of the Valley"],
      base: ["Musk", "Amber"],
    },
    description:
      "Bright fruits and white florals with a warm amber-musk finish — light, graceful, confident.",
    rating: 4.4,
    reviews: 8,
    featured: false,
  },

  // ───────────── UNISEX ─────────────
  {
    id: "ethereal-dreamer",
    name: "Ethereal Dreamer",
    category: "unisex",
    gender: "Unisex",
    price: 2499,
    fragranceType: "Fruity • Musky",
    moods: ["Fruity", "Musky"],
    occasion: ["Everyday", "Date Night"],
    style: ["Mysterious", "Fresh"],
    image: img("darkBottle"),
    images: [img("darkBottle"), img("goldBottle")],
    notes: {
      top: ["Fig Leaf", "Yuzu"],
      heart: ["Violet", "Iris"],
      base: ["White Musk", "Cashmere Wood"],
    },
    description:
      "A soft-focus fruity musk that drifts between genders and seasons alike.",
    rating: 4.7,
    reviews: 16,
    featured: false,
  },
  {
    id: "aura",
    name: "Aura",
    category: "unisex",
    gender: "Unisex",
    price: 2199,
    fragranceType: "Woody • Fresh",
    moods: ["Fresh", "Woody"],
    occasion: ["Office", "Everyday"],
    style: ["Elegant", "Fresh"],
    image: img("goldBottle", 900, 1107),
    images: [img("goldBottle", 900, 1107), img("darkBottle", 900, 1107)],
    notes: {
      top: ["Bergamot", "Green Tea"],
      heart: ["Violet Leaf", "Nutmeg"],
      base: ["Cedar", "Musk"],
    },
    description:
      "Clean, modern, and quietly distinctive — a fresh woody aura that fits any occasion.",
    rating: 4.6,
    reviews: 13,
    featured: false,
  },
  {
    id: "reflection",
    name: "Reflection",
    category: "unisex",
    gender: "Unisex",
    price: 2399,
    fragranceType: "Fresh • Spicy",
    moods: ["Fresh", "Woody"],
    occasion: ["Office", "Everyday"],
    style: ["Fresh", "Bold"],
    image: img("darkBottle", 900, 1108),
    images: [img("darkBottle", 900, 1108), img("goldBottle", 900, 1108)],
    notes: {
      top: ["Cardamom", "Bergamot"],
      heart: ["Elemi", "Pink Pepper"],
      base: ["Vetiver", "Ambroxan"],
    },
    description:
      "A sharp, modern spice-freshness with a long ambroxan trail — a study in restraint.",
    rating: 4.5,
    reviews: 10,
    featured: false,
  },
  {
    id: "nomad",
    name: "Nomad",
    category: "unisex",
    gender: "Unisex",
    price: 2599,
    fragranceType: "Woody • Amber",
    moods: ["Woody", "Oud"],
    occasion: ["Special Occasion", "Everyday"],
    style: ["Mysterious", "Traditional"],
    image: img("darkBottle", 900, 1109),
    images: [img("darkBottle", 900, 1109), img("goldBottle", 900, 1109)],
    notes: {
      top: ["Cumin", "Cardamom"],
      heart: ["Labdanum", "Suede"],
      base: ["Amber", "Sandalwood"],
    },
    description:
      "A worn-leather amber built for travellers — warm, dusty, and impossible to place.",
    rating: 4.7,
    reviews: 17,
    featured: false,
  },

  // ───────────── OUD & ATTAR ─────────────
  {
    id: "amber-touch",
    name: "Amber Touch",
    category: "oud-attar",
    gender: "Unisex",
    price: 2499,
    fragranceType: "Amber • Musk",
    moods: ["Musky", "Oud"],
    occasion: ["Special Occasion", "Wedding"],
    style: ["Traditional", "Mysterious"],
    image: img("darkBottle", 900, 1110),
    images: [img("darkBottle", 900, 1110), img("goldBottle", 900, 1110)],
    notes: {
      top: ["Saffron", "Clove"],
      heart: ["Rose", "Oud Accord"],
      base: ["Amber", "Musk"],
    },
    description:
      "A gentle introduction to oud — amber-forward, warm, and easy to wear for longer stretches.",
    rating: 4.6,
    reviews: 21,
    featured: false,
  },
  {
    id: "oud-bayaan",
    name: "Oud Bayaan",
    category: "oud-attar",
    gender: "Unisex",
    price: 3499,
    fragranceType: "Oud • Deep",
    moods: ["Oud", "Woody"],
    occasion: ["Special Occasion", "Wedding"],
    style: ["Traditional", "Mysterious"],
    image: img("darkBottle", 900, 1111),
    images: [
      img("darkBottle", 900, 1111),
      img("goldBottle", 900, 1111),
      img("darkBottle", 700, 900),
    ],
    notes: {
      top: ["Rose", "Saffron"],
      heart: ["Pure Oud", "Frankincense"],
      base: ["Sandalwood", "Musk"],
    },
    description:
      "A traditional, resin-rich oud built around aged agarwood — deep, smoky and unforgettable.",
    rating: 4.9,
    reviews: 31,
    featured: false,
  },
  {
    id: "musk-attar",
    name: "Musk Attar",
    category: "oud-attar",
    gender: "Unisex",
    price: 1799,
    fragranceType: "Musky • Traditional",
    moods: ["Musky"],
    occasion: ["Everyday", "Special Occasion"],
    style: ["Traditional", "Elegant"],
    image: img("darkBottle", 900, 1112),
    images: [img("darkBottle", 900, 1112), img("goldBottle", 900, 1112)],
    notes: {
      top: ["White Musk"],
      heart: ["Sandalwood"],
      base: ["Amberwood"],
    },
    description:
      "A pure, skin-soft musk attar in the classical style — quiet, clean and long-wearing.",
    rating: 4.5,
    reviews: 14,
    featured: false,
  },
  {
    id: "black-oud",
    name: "Black Oud",
    category: "oud-attar",
    gender: "Unisex",
    price: 3299,
    fragranceType: "Oud • Woody",
    moods: ["Oud", "Woody"],
    occasion: ["Special Occasion", "Date Night"],
    style: ["Bold", "Mysterious"],
    image: img("goldBottle", 900, 1113),
    images: [img("goldBottle", 900, 1113), img("darkBottle", 900, 1113)],
    notes: {
      top: ["Black Pepper", "Cypress"],
      heart: ["Oud", "Leather"],
      base: ["Patchouli", "Vetiver"],
    },
    description:
      "Dark, smoky and dense — a modern oud built for those who like to be remembered.",
    rating: 4.7,
    reviews: 20,
    featured: false,
  },
  {
    id: "amber-oud",
    name: "Amber Oud",
    category: "oud-attar",
    gender: "Unisex",
    price: 3199,
    fragranceType: "Oud • Amber",
    moods: ["Oud", "Musky"],
    occasion: ["Wedding", "Special Occasion"],
    style: ["Traditional", "Romantic"],
    image: img("darkBottle", 900, 1114),
    images: [img("darkBottle", 900, 1114), img("goldBottle", 900, 1114)],
    notes: {
      top: ["Cinnamon", "Orange Blossom"],
      heart: ["Oud", "Rose"],
      base: ["Amber", "Vanilla"],
    },
    description:
      "Sweet amber wrapped around a soft oud heart — celebratory, warm and generous on skin.",
    rating: 4.8,
    reviews: 25,
    featured: false,
  },
];

export const getProductById = (id) => {
  const p = PRODUCTS.find((item) => item.id === id);
  if (!p) return null;
  return {
    ...p,
    sizes: p.sizes || getDefaultSizes(p.price),
  };
};

export const getFeaturedProducts = () => PRODUCTS.filter((p) => p.featured);

export const getProductsByCategory = (category) =>
  category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;

export const getRelatedProducts = (product, count = 4) =>
  PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .concat(
      PRODUCTS.filter(
        (p) => p.id !== product.id && p.category !== product.category,
      ),
    )
    .slice(0, count);

export const HERO_IMAGE = img("goldBottle", 1600, 2000);
export const OUD_SECTION_IMAGE = "/images/oudattar.webp";
export const STORE_IMAGE = img("storeShelf", 1400, 1000);
export const ABOUT_HERO_IMAGE = "/images/store.webp";
