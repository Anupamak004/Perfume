import { AnimatePresence, motion } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import FilterPanel from "./FilterPanel";

export function MobileFilterTrigger({ onClick, activeFilterCount, light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border px-5 py-3 text-xs uppercase tracking-wide2 hover:border-gold hover:text-gold lg:hidden ${light ? "border-ink/20 text-ink/80" : "border-cream/20 text-cream/80"}`}
    >
      <SlidersHorizontal size={15} />
      Filter
      {activeFilterCount > 0 && <span className="text-gold">({activeFilterCount})</span>}
    </button>
  );
}

export default function FilterDrawerMobile({ open, onClose, ...panelProps }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter fragrances"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-ink border-r border-gold/20 px-6 py-6 lg:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-2xl text-cream">Filters</span>
              <button type="button" onClick={onClose} aria-label="Close filters" className="text-cream/70 hover:text-gold">
                <X size={22} />
              </button>
            </div>
            <FilterPanel {...panelProps} />
            <button
              type="button"
              onClick={onClose}
              className="mt-8 w-full bg-gold py-3.5 text-xs uppercase tracking-wide2 text-ink"
            >
              Show Results
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
