import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Instagram, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "../data/siteConfig";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "Men", to: "/collections/men" },
  { label: "Women", to: "/collections/women" },
  { label: "Unisex", to: "/collections/unisex" },
  { label: "Oud & Attar", to: "/collections/oud-attar" },
  { label: "About", to: "/about" },
  { label: "Fragrance Finder", to: "/fragrance-finder" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Contact", to: "/contact" },
];

export default function MobileMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(88%,24rem)] max-w-sm flex-col bg-ink border-l border-gold/20 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-7"
          >
            <div className="flex items-center justify-between border-b border-cream/10 pb-4">
              <span className="font-display text-xl uppercase tracking-wide2 text-cream">
                {SITE_CONFIG.brandName}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center text-cream/80 hover:text-gold"
              >
                <X size={22} />
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.03, duration: 0.35 }}
                >
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block border-b border-cream/10 py-3 font-display text-lg text-cream/90 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-4 border-t border-cream/10 pt-4">
              <div className="flex items-center gap-3">
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
                  aria-label="Chat on WhatsApp"
                  className="flex h-9 w-9 items-center justify-center border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-wide2 text-cream/40">
                {SITE_CONFIG.tagline}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
