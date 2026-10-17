import { useMemo, useState } from "react";

export const PRICE_BANDS = [
  { id: "under-1000", label: "Under ₹1,000", test: (p) => p < 1000 },
  { id: "1000-2000", label: "₹1,000 – ₹2,000", test: (p) => p >= 1000 && p <= 2000 },
  { id: "2000-3000", label: "₹2,000 – ₹3,000", test: (p) => p > 2000 && p <= 3000 },
  { id: "above-3000", label: "Above ₹3,000", test: (p) => p > 3000 },
];

export const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
];

export default function useProductFilters(baseProducts) {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [priceBands, setPriceBands] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");

  const toggle = (setFn) => (value) =>
    setFn((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const toggleCategory = toggle(setCategories);
  const toggleType = toggle(setTypes);
  const togglePriceBand = toggle(setPriceBands);

  const clearAll = () => {
    setCategories([]);
    setTypes([]);
    setPriceBands([]);
    setSortBy("popularity");
  };

  const activeFilterCount = categories.length + types.length + priceBands.length;

  const filtered = useMemo(() => {
    let list = [...baseProducts];

    if (categories.length) {
      list = list.filter((p) => categories.includes(p.category));
    }
    if (types.length) {
      list = list.filter((p) => p.moods.some((m) => types.includes(m)));
    }
    if (priceBands.length) {
      list = list.filter((p) => priceBands.some((bandId) => PRICE_BANDS.find((b) => b.id === bandId)?.test(p.price)));
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    }

    return list;
  }, [baseProducts, categories, types, priceBands, sortBy]);

  return {
    filtered,
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
  };
}
