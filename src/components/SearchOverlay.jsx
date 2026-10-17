import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useCatalog } from "../context/CatalogContext";
import { formatPrice } from "../utils/format";

export default function SearchOverlay({ open, onClose }) {
  const { products } = useCatalog();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (query.trim().length < 1) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.fragranceType.toLowerCase().includes(q) || p.category.includes(q)
    ).slice(0, 6);
  }, [query, products]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-ink/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Search fragrances"
        >
          <div className="container-px mx-auto flex w-full max-w-content items-center gap-4 pt-8">
            <Search className="text-gold shrink-0" size={22} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fragrances, notes, collections…"
              className="w-full bg-transparent font-display text-xl sm:text-3xl text-cream placeholder:text-cream/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-cream/70 hover:text-gold"
            >
              <X size={24} />
            </button>
          </div>

          <div className="container-px mx-auto mt-10 w-full max-w-content flex-1 overflow-y-auto pb-10">
            {query.trim().length > 0 && results.length === 0 && (
              <p className="text-cream/50">No fragrances found for “{query}”.</p>
            )}
            {results.length > 0 && (
              <div className="bg-black">
                <ul className="divide-y divide-cream/10">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/product/${p.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 px-4 py-4 group sm:px-6"
                      >
                        <img src={p.image} alt="" className="h-16 w-14 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-display text-lg text-cream group-hover:text-gold">{p.name}</p>
                          <p className="text-xs uppercase tracking-wide2 text-cream/50">{p.fragranceType}</p>
                        </div>
                        <span className="shrink-0 font-display text-sm text-gold sm:text-base">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
