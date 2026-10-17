// ─────────────────────────────────────────────────────────────────────────
// THE PERFUME PIRATE — CENTRAL SITE & BUSINESS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────

export const SITE_CONFIG = {
  brandName: "The Perfume Pirate",
  shortName: "The Perfume Pirate",
  tagline: "Premium Fragrances & Decants",
  subtitle:
    "Discover a scent that becomes uniquely yours. Luxury perfumes, rare blends, and authentic decants.",
  businessType: "Perfume / Fragrance / Perfume Decants",

  phone: "+91 9890696922",
  phoneRaw: "+919890696922",
  phoneHref: "tel:+919890696922",

  whatsapp: "+91 9890696922",
  whatsappRaw: "919890696922",
  whatsappHref: "https://wa.me/919890696922",

  instagram: "https://www.instagram.com/the_perfume_pirate/",
  instagramHandle: "@the_perfume_pirate",

  mapsHref: "https://www.google.com/maps/place/The+Perfume+Pirate/",
  mapsEmbedSrc:
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(
      "The Perfume Pirate, Plot No. 492, Behind Icy Spicy, Kamgar Chowk, N 3, CIDCO, Chhatrapati Sambhajinagar, Maharashtra 431003, India",
    ) +
    "&t=&z=15&ie=UTF8&iwloc=&output=embed",

  address: {
    line1: "Plot No. 492, Behind Icy Spicy",
    line2: "Kamgar Chowk, N 3, CIDCO",
    line3: "Chhatrapati Sambhajinagar, Maharashtra 431003, India",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    pincode: "431003",
    country: "India",
    full: "Plot No. 492, Behind Icy Spicy, Kamgar Chowk, N 3, CIDCO, Chhatrapati Sambhajinagar, Maharashtra 431003, India",
  },

  hours: [
    { day: "Monday – Saturday", time: "10:30 AM – 9:30 PM" },
    { day: "Sunday", time: "11:00 AM – 8:30 PM" },
  ],
  hoursNote: "Timings may vary on holidays. Reach out on WhatsApp to confirm.",

  meta: {
    title: "The Perfume Pirate | Premium Fragrances & Decants",
    description:
      "The Perfume Pirate — premium fragrance boutique & decants in Chhatrapati Sambhajinagar, Maharashtra. Explore curated luxury perfumes, rare oud, attar and decants.",
  },
};

/**
 * Generate a prefilled WhatsApp link for a single product order/enquiry
 */
export function getProductWhatsAppUrl(product, sizeLabel, price) {
  const text = `Hi The Perfume Pirate! I would like to order / inquire about:
*Product:* ${product.name}
${sizeLabel ? `*Size/Decant:* ${sizeLabel}\n` : ""}*Price:* ₹${price ?? product.price}
*Category:* ${product.fragranceType || product.category}

Could you please confirm availability and delivery details?`;

  return `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a prefilled WhatsApp link for cart items checkout
 */
export function getCartWhatsAppUrl(items, subtotal, customer = null) {
  const lines = items.map(
    (item) =>
      `• ${item.name}${item.size ? ` (${item.size})` : ""} x ${item.quantity} — ₹${(item.price * item.quantity).toLocaleString("en-IN")}${item.originalPrice ? ` (was ₹${(item.originalPrice * item.quantity).toLocaleString("en-IN")})` : ""}${item.id && typeof window !== "undefined" ? `\n  Product link: ${new URL(`/product/${encodeURIComponent(item.id)}`, window.location.origin).href}` : ""}`,
  );
  const originalSubtotal = items.reduce((sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity, 0);
  const savings = Math.max(0, originalSubtotal - subtotal);

  const customerDetails = customer
    ? `

*Customer details*
*Name:* ${customer.name}
*Phone:* ${customer.phone}
${customer.email ? `*Email:* ${customer.email}\n` : ""}*Delivery address:* ${customer.address}, ${customer.city}, ${customer.state} ${customer.pincode}, India${customer.instructions ? `\n*Delivery instructions:* ${customer.instructions}` : ""}`
    : "";

  const text = `Hi The Perfume Pirate! I would like to place an order from your website:

${lines.join("\n")}

*Subtotal:* ₹${Number(subtotal).toLocaleString("en-IN")}
${savings ? `*Offer savings:* ₹${savings.toLocaleString("en-IN")}\n` : ""}${savings ? `*Before offers:* ₹${originalSubtotal.toLocaleString("en-IN")}\n` : ""}
${customerDetails}

Please confirm availability, delivery charges, and payment details.`;

  return `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(text)}`;
}
