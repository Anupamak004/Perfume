import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCard({ to, image, label, tagline }) {
  return (
    <Link
      to={to}
      className="group relative block aspect-[4/5] overflow-hidden bg-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
    >
      <img
        src={image}
        alt={`${label} fragrances`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 transition-opacity duration-500 group-hover:from-ink/95" />
      <div className="absolute inset-0 border border-cream/0 transition-colors duration-500 group-hover:border-gold/40" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-6">
        <div className="min-w-0 bg-ink/70 px-2 py-1.5 sm:px-3 sm:py-2">
          <h3 className="break-words font-display text-xl font-semibold text-cream drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] sm:text-3xl">{label}</h3>
          <p className="mt-1 text-[11px] uppercase tracking-wide2 text-gold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-xs">{tagline}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-ink group-hover:rotate-45 sm:h-10 sm:w-10">
          <ArrowUpRight size={16} className="sm:h-[18px] sm:w-[18px]" />
        </span>
      </div>
    </Link>
  );
}
