// ─────────────────────────────────────────────────────────────────────────
// THE PERFUME PIRATE — STORE & CONTACT INFORMATION
// ─────────────────────────────────────────────────────────────────────────

import { SITE_CONFIG } from "./siteConfig";

export { SITE_CONFIG };

export const STORE_INFO = {
  name: SITE_CONFIG.brandName,
  addressLine1: SITE_CONFIG.address.line1,
  addressLine2: SITE_CONFIG.address.line2,
  addressLine3: SITE_CONFIG.address.line3,
  fullAddress: SITE_CONFIG.address.full,
  phone: SITE_CONFIG.phone,
  phoneHref: SITE_CONFIG.phoneHref,
  whatsapp: SITE_CONFIG.whatsapp,
  whatsappHref: SITE_CONFIG.whatsappHref,
  email: "contact@theperfumepirate.com",
  instagram: SITE_CONFIG.instagram,
  instagramHandle: SITE_CONFIG.instagramHandle,
  facebook: SITE_CONFIG.instagram, // Primary social presence is Instagram
  mapsHref: SITE_CONFIG.mapsHref,
  mapsEmbedSrc: SITE_CONFIG.mapsEmbedSrc,
  hours: SITE_CONFIG.hours,
  hoursNote: SITE_CONFIG.hoursNote,
};

export const REVIEW_SUMMARY = {
  average: 4.9,
  count: 68,
  isDemoData: true,
};

export const DEMO_REVIEWS = [
  {
    id: 1,
    initials: "S.A.",
    rating: 5,
    quote:
      "The collection is incredible — from authentic decants to full bottles, they helped me find my signature scent.",
  },
  {
    id: 2,
    initials: "M.H.",
    rating: 5,
    quote: "Original fragrances, elegant packaging, and the oud and decant variety is genuinely unmatched.",
  },
  {
    id: 3,
    initials: "F.T.",
    rating: 4.5,
    quote: "Wide range for every budget. Being able to try decants first makes it my go-to for fragrance discovery.",
  },
];
