import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "../data/siteConfig";
import { STORE_INFO } from "../data/store";

const EXPLORE = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "Men", to: "/collections/men" },
  { label: "Women", to: "/collections/women" },
  { label: "Unisex", to: "/collections/unisex" },
  { label: "Oud & Attar", to: "/collections/oud-attar" },
];

const DISCOVER = [
  { label: "Fragrance Finder", to: "/fragrance-finder" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-ink">
      <div className="container-px mx-auto max-w-content py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-2xl sm:text-3xl text-cream tracking-wide2 uppercase">
              {SITE_CONFIG.brandName}
            </Link>
            <p className="mt-3 text-xs uppercase tracking-wide2 text-gold">{SITE_CONFIG.tagline}</p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE_CONFIG.brandName} on Instagram`}
                className="flex h-9 w-9 items-center justify-center border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram size={16} />
              </a>
              <a
                href={SITE_CONFIG.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order & Enquire on WhatsApp"
                className="flex h-9 w-9 items-center justify-center border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wide2 text-gold">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-sm text-cream/70 hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wide2 text-gold">Discover</h3>
            <ul className="mt-4 space-y-2.5">
              {DISCOVER.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-sm text-cream/70 hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs uppercase tracking-wide2 text-gold">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold/70" />
                <span className="leading-relaxed">
                  {STORE_INFO.addressLine1}, {STORE_INFO.addressLine2}, {STORE_INFO.addressLine3}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-gold/70" />
                <a href={STORE_INFO.phoneHref} className="hover:text-gold transition-colors">
                  {STORE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={15} className="shrink-0 text-gold/70" />
                <a
                  href={STORE_INFO.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {STORE_INFO.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.brandName}. All rights reserved.</p>
          <p>{SITE_CONFIG.address.city}, {SITE_CONFIG.address.country}</p>
        </div>
      </div>
    </footer>
  );
}
