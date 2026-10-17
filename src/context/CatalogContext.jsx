import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDefaultSizes, PRODUCTS } from "../data/products";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const CatalogContext = createContext(null);
const optimizedImageUrl = (url) => typeof url === "string"
  ? url.replace(/^(\/images\/[^?#]+)\.(?:png|jpe?g)([?#].*)?$/i, "$1.webp$2")
  : url;
const BUNDLED_PRODUCTS = PRODUCTS.map((product) => ({
  ...product,
  inStock: product.inStock !== false,
  sizes: (product.sizes?.length ? product.sizes : getDefaultSizes(product.price)).map((size) => ({
    ...size,
    in_stock: typeof size.in_stock === "boolean" ? size.in_stock : product.inStock !== false,
  })),
}));

function normalizeProduct(row) {
  const sizes = (Array.isArray(row.sizes) && row.sizes.length ? row.sizes : getDefaultSizes(Number(row.price) || 0))
    .map((size) => ({ ...size, in_stock: typeof size.in_stock === "boolean" ? size.in_stock : row.in_stock !== false }));
  return {
    ...row,
    image: optimizedImageUrl(row.image),
    images: (Array.isArray(row.images) ? row.images : []).map(optimizedImageUrl),
    fragranceType: row.fragrance_type || "",
    moods: Array.isArray(row.moods) ? row.moods : [],
    occasion: Array.isArray(row.occasion) ? row.occasion : [],
    style: Array.isArray(row.style) ? row.style : [],
    notes: row.notes || { top: [], heart: [], base: [] },
    sizes,
    price: Number(row.price) || 0,
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    featured: Boolean(row.featured),
    inStock: sizes.length ? sizes.some((size) => size.in_stock) : row.in_stock !== false,
  };
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(BUNDLED_PRODUCTS);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [source, setSource] = useState(isSupabaseConfigured ? "supabase" : "local");
  const [stockConfirmed, setStockConfirmed] = useState(!isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setProducts(BUNDLED_PRODUCTS);
      setSource("local");
      setStockConfirmed(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setStockConfirmed(false);
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) {
      console.error("Could not load the live product catalogue; using the bundled catalogue.", error);
      setProducts(BUNDLED_PRODUCTS);
      setSource("local");
      setStockConfirmed(false);
    } else {
      setProducts((data || []).map(normalizeProduct));
      setSource("supabase");
      setStockConfirmed(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (!supabase) return undefined;
    const channel = supabase
      .channel("storefront-product-catalog")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);
  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refresh]);

  const value = useMemo(() => ({ products, loading, source, stockConfirmed, refresh }), [products, loading, source, stockConfirmed, refresh]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog must be used inside CatalogProvider");
  return value;
}
