import { CATEGORIES, FRAGRANCE_TYPES } from "../data/products";
import { PRICE_BANDS, SORT_OPTIONS } from "../hooks/useProductFilters";

function CheckRow({ checked, onChange, label, light = false }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 py-1.5 text-sm transition-colors ${light ? "text-ink hover:text-ink" : "text-cream/75 hover:text-cream"}`}>
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          checked ? "border-gold bg-gold" : light ? "border-ink/30" : "border-cream/30"
        }`}
      >
        {checked && <span className="h-2 w-2 bg-ink" />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

export default function FilterPanel({
  showCategory = true,
  categories,
  toggleCategory,
  types,
  toggleType,
  priceBands,
  togglePriceBand,
  sortBy,
  setSortBy,
  clearAll,
  activeFilterCount,
  resultCount,
  light = false,
}) {
  return (
    <div className="flex flex-col gap-9">
      <div className="flex items-center justify-between">
        <h2 className={`font-display text-xl ${light ? "text-ink" : "text-cream"}`}>Filter</h2>
        <button
          type="button"
          onClick={clearAll}
          disabled={activeFilterCount === 0}
          className={`text-[11px] uppercase tracking-wide2 text-gold link-underline disabled:cursor-not-allowed disabled:no-underline ${light ? "disabled:text-ink/35" : "disabled:text-cream/25"}`}
        >
          Clear filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
      </div>

      <div>
        <h3 className={`text-xs uppercase tracking-wide2 ${light ? "text-ink" : "text-cream/50"}`}>Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`mt-3 w-full border px-3 py-2.5 text-sm focus:border-gold focus:outline-none ${light ? "border-ink/20 bg-white text-ink" : "border-cream/20 bg-ink text-cream"}`}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id} className={light ? "bg-white" : "bg-ink"}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {showCategory && (
        <div>
          <h3 className="text-xs uppercase tracking-wide2 text-black">Category</h3>
          <div className="mt-3">
            {CATEGORIES.map((cat) => (
              <CheckRow
                key={cat.id}
                label={cat.label}
                checked={categories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                light={light}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className={`text-xs uppercase tracking-wide2 ${light ? "text-ink" : "text-cream/50"}`}>Fragrance Type</h3>
        <div className="mt-3">
          {FRAGRANCE_TYPES.map((type) => (
            <CheckRow key={type} label={type} checked={types.includes(type)} onChange={() => toggleType(type)} light={light} />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-xs uppercase tracking-wide2 ${light ? "text-ink" : "text-cream/50"}`}>Price</h3>
        <div className="mt-3">
          {PRICE_BANDS.map((band) => (
            <CheckRow
              key={band.id}
              label={band.label}
              checked={priceBands.includes(band.id)}
              onChange={() => togglePriceBand(band.id)}
              light={light}
            />
          ))}
        </div>
      </div>

      {resultCount != null && (
        <p className={`border-t pt-5 text-xs ${light ? "border-ink/15 text-ink" : "border-cream/10 text-cream/40"}`}>{resultCount} fragrance{resultCount === 1 ? "" : "s"} found</p>
      )}
    </div>
  );
}
