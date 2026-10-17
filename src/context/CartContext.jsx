import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCatalog } from "./CatalogContext";
import { getDefaultSizes } from "../data/products";
import { getProductPromotion, getPromotionPrice, useOffers } from "./OffersContext";

const CartContext = createContext(null);
const STORAGE_KEY = "perfume_pirate_cart_v1";

function loadInitialCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { products, stockConfirmed } = useCatalog();
  const { promotions } = useOffers();
  const [items, setItems] = useState(loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private browsing etc.) — fail silently.
    }
  }, [items]);

  const addItem = (product, quantity = 1, selectedSize = null) => {
    const currentProduct = products.find((entry) => entry.id === product.id);
    if (!stockConfirmed || !currentProduct || !currentProduct.inStock) return false;
    const availableSizes = currentProduct.sizes?.length ? currentProduct.sizes : getDefaultSizes(currentProduct.price);
    const sizeLabel = selectedSize?.label || selectedSize || availableSizes.find((size) => size.in_stock !== false)?.label || null;
    if (sizeLabel && !availableSizes.some((size) => size.label === sizeLabel && size.in_stock !== false)) return false;
    const liveSize = availableSizes.find((size) => size.label === sizeLabel);
    const price = liveSize?.price ?? currentProduct.price;
    const cartItemId = sizeLabel ? `${product.id}-${sizeLabel}` : product.id;

    setItems((prev) => {
      const existing = prev.find((i) => (i.cartItemId || i.id) === cartItemId);
      if (existing) {
        return prev.map((i) =>
          (i.cartItemId || i.id) === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          cartItemId,
          name: currentProduct.name,
          price,
          size: sizeLabel,
          image: currentProduct.image,
          fragranceType: currentProduct.fragranceType,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
    return true;
  };

  const removeItem = (cartItemId) =>
    setItems((prev) => prev.filter((i) => (i.cartItemId || i.id) !== cartItemId));

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) {
      removeItem(cartItemId);
      return;
    }
    const item = items.find((entry) => (entry.cartItemId || entry.id) === cartItemId);
    const product = item && products.find((entry) => entry.id === item.id);
    const selectedVariant = item?.size && product?.sizes?.find((size) => size.label === item.size);
    if (item && quantity > item.quantity && (!stockConfirmed || !product?.inStock || (item.size && !selectedVariant?.in_stock))) return;
    setItems((prev) =>
      prev.map((i) => ((i.cartItemId || i.id) === cartItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const currentItems = useMemo(() => items.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const sizes = product?.sizes?.length ? product.sizes : product ? getDefaultSizes(product.price) : [];
    const size = item.size ? sizes.find((entry) => entry.label === item.size) : null;
    const available = Boolean(stockConfirmed && product?.inStock && (!item.size || (size && size.in_stock !== false)));
    const basePrice = size?.price ?? product?.price ?? item.price;
    const offer = product ? getProductPromotion(product, promotions)?.promotion : null;
    const price = offer ? getPromotionPrice(basePrice, offer) : basePrice;
    return {
      ...item,
      name: product?.name || item.name,
      image: product?.image || item.image,
      fragranceType: product?.fragranceType || item.fragranceType,
      price,
      originalPrice: offer && price < basePrice ? basePrice : null,
      promotionTitle: offer && price < basePrice ? offer.title : null,
      available,
    };
  }), [items, products, stockConfirmed, promotions]);
  const hasUnavailableItems = currentItems.some((item) => !item.available);
  const subtotal = useMemo(() => currentItems.reduce((sum, item) => item.available ? sum + item.price * item.quantity : sum, 0), [currentItems]);
  const originalSubtotal = useMemo(() => currentItems.reduce((sum, item) => item.available ? sum + (item.originalPrice ?? item.price) * item.quantity : sum, 0), [currentItems]);
  const offerSavings = Math.max(0, originalSubtotal - subtotal);
  const count = useMemo(() => currentItems.reduce((sum, i) => sum + i.quantity, 0), [currentItems]);

  const value = {
    items: currentItems,
    hasUnavailableItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    originalSubtotal,
    offerSavings,
    count,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
