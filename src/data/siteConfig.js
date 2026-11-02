// ─────────────────────────────────────────────────────────────────────────
// PERFUME STORE — CENTRAL SITE & BUSINESS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────

export const SITE_CONFIG = {
  brandName: "Perfume Store",
  shortName: "Perfume Store",
  tagline: "Premium Fragrances & Decants",
  subtitle:
    "Discover a scent that becomes uniquely yours. Luxury perfumes, rare blends, and authentic decants.",
  businessType: "Perfume / Fragrance / Perfume Decants",

  phone: "9999999999",
  phoneRaw: "9999999999",
  phoneHref: "tel:9999999999",

  whatsapp: "9999999999",
  whatsappRaw: "919999999999",
  whatsappHref: "https://wa.me/919999999999",

  instagram: "https://www.instagram.com/",
  instagramHandle: "",

  mapsHref: "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("ABC Building, Main Street, Your City, India"),
  mapsEmbedSrc:
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(
      "ABC Building, Main Street, Your City, India",
    ) +
    "&t=&z=15&ie=UTF8&iwloc=&output=embed",

  address: {
    line1: "ABC Building",
    line2: "Main Street",
    line3: "Your City, India",
    city: "Your City",
    state: "Your State",
    pincode: "",
    country: "India",
    full: "ABC Building, Main Street, Your City, India",
  },

  hours: [
    { day: "Monday – Saturday", time: "10:30 AM – 9:30 PM" },
    { day: "Sunday", time: "11:00 AM – 8:30 PM" },
  ],
  hoursNote: "Timings may vary on holidays. Reach out on WhatsApp to confirm.",

  meta: {
    title: "Perfume Store | Premium Fragrances & Decants",
    description:
      "Perfume Store — explore premium fragrances, rare oud, attar, and authentic decants.",
  },
};

/**
 * Generate a prefilled WhatsApp link for a single product order/enquiry
 */
export function getProductWhatsAppUrl(product, sizeLabel, price) {
  const text = `Hi ${SITE_CONFIG.brandName}! I would like to order / inquire about:
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

  const text = `Hi ${SITE_CONFIG.brandName}! I would like to place an order from your website:

${lines.join("\n")}

*Subtotal:* ₹${Number(subtotal).toLocaleString("en-IN")}
${savings ? `*Offer savings:* ₹${savings.toLocaleString("en-IN")}\n` : ""}${savings ? `*Before offers:* ₹${originalSubtotal.toLocaleString("en-IN")}\n` : ""}
${customerDetails}

Please confirm availability, delivery charges, and payment details.`;

  return `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(text)}`;
}
