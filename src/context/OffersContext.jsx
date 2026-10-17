import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const OffersContext = createContext(null);

export function isPromotionLive(promotion, now = Date.now()) {
  if (!promotion?.is_active) return false;
  const start = new Date(promotion.starts_at).getTime();
  const end = new Date(promotion.ends_at).getTime();
  return Number.isFinite(start) && Number.isFinite(end) && start <= now && now < end;
}

export function promotionMatchesProduct(promotion, product) {
  if (!promotion || promotion.kind !== "discount" || !product) return false;
  if (promotion.scope === "category") return promotion.category === product.category;
  if (promotion.scope === "products") return (promotion.product_ids || []).includes(product.id);
  return promotion.scope === "all";
}

export function getProductPromotion(product, promotions = [], now = Date.now()) {
  return promotions
    .filter((promotion) => isPromotionLive(promotion, now) && promotionMatchesProduct(promotion, product))
    .map((promotion) => ({
      promotion,
      price: getPromotionPrice(product.price, promotion),
    }))
    .sort((a, b) => a.price - b.price)[0] || null;
}

export function getPromotionPrice(price, promotion) {
  const amount = Number(price) || 0;
  const value = Number(promotion?.discount_value) || 0;
  if (promotion?.discount_type === "percent") return Math.max(0, Math.round(amount * (1 - value / 100)));
  if (promotion?.discount_type === "fixed") return Math.max(0, amount - value);
  return amount;
}

export function OffersProvider({ children }) {
  const [promotions, setPromotions] = useState([]);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(async () => {
    if (!supabase) {
      setPromotions([]);
      return;
    }
    const { data, error } = await supabase.from("store_promotions").select("*").eq("is_active", true);
    if (error) {
      setPromotions([]);
      if (error.code !== "42P01" && error.code !== "PGRST205") console.error("Could not load active store promotions.", error);
      return;
    }
    setPromotions(data || []);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (!supabase) return undefined;
    const channel = supabase.channel("storefront-promotions")
      .on("postgres_changes", { event: "*", schema: "public", table: "store_promotions" }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);
  useEffect(() => {
    const onVisibility = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", onVisibility);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onVisibility);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const value = useMemo(() => ({ promotions, refresh, now }), [promotions, refresh, now]);
  return <OffersContext.Provider value={value}>{children}</OffersContext.Provider>;
}

export function useOffers() {
  const value = useContext(OffersContext);
  if (!value) throw new Error("useOffers must be used inside OffersProvider");
  return value;
}
