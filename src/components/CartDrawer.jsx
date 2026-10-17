import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import { formatPrice } from "../utils/format";
import WhatsAppOrderModal from "./WhatsAppOrderModal";

export default function CartDrawer() {
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const { items, hasUnavailableItems, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, originalSubtotal, offerSavings } = useCart();
  const { stockConfirmed } = useCatalog();

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <>
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-[92%] max-w-md flex-col bg-ink border-l border-gold/20"
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <h2 className="font-display text-2xl text-cream">Your Bag ({items.length})</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close bag"
                className="flex h-10 w-10 items-center justify-center text-cream/70 hover:text-gold"
              >
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="text-gold/50" size={40} />
                <p className="text-cream/60">Your bag is empty.</p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs uppercase tracking-wide2 text-gold link-underline"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-cream/10 px-6">
                  {items.map((item) => {
                    const itemKey = item.cartItemId || item.id;
                    return (
                      <li key={itemKey} className="flex gap-4 py-5">
                        <img src={item.image} alt="" className="h-24 w-20 shrink-0 object-cover" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-display text-lg leading-tight text-cream">{item.name}</p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] uppercase tracking-wide2 text-cream/50">
                                  {item.fragranceType}
                                </span>
                                {item.size && (
                                  <span className="border border-gold/40 px-1.5 py-0.2 text-[10px] uppercase tracking-wider text-gold">
                                    {item.size}
                                  </span>
                                )}
                                {!item.available && <span className="text-[10px] uppercase tracking-wider text-red-300">{stockConfirmed ? "Unavailable · remove to order" : "Stock status not confirmed"}</span>}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(itemKey)}
                              aria-label={`Remove ${item.name} from bag`}
                              className="text-cream/40 hover:text-gold"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center border border-cream/20">
                              <button
                                type="button"
                                onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="flex h-8 w-8 items-center justify-center text-cream/70 hover:text-gold"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-7 text-center text-sm text-cream">{item.quantity}</span>
                              <button
                                type="button"
                                disabled={!item.available}
                                onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="flex h-8 w-8 items-center justify-center text-cream/70 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <span className="flex flex-col items-end font-display text-gold">
                              {item.originalPrice && <del className="text-[10px] text-cream/40">{formatPrice(item.originalPrice * item.quantity)}</del>}
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-cream/10 px-6 py-6">
                  <div className="flex items-center justify-between text-sm text-cream/70">
                    <span>Subtotal</span>
                    <span className="flex items-baseline gap-2">{offerSavings > 0 && <del className="text-xs text-cream/40">{formatPrice(originalSubtotal)}</del>}<strong className="font-display text-xl text-cream">{formatPrice(subtotal)}</strong></span>
                  </div>
                  {offerSavings > 0 && <p className="mt-1 text-right text-xs font-medium text-emerald-300">Offer savings: {formatPrice(offerSavings)}</p>}
                  <p className="mt-1 text-[11px] text-cream/40">{!stockConfirmed ? "We can’t confirm current stock. Refresh the page before ordering." : hasUnavailableItems ? "Remove unavailable products before placing your order." : "Direct order via WhatsApp with store concierge."}</p>

                  <button
                    type="button"
                    disabled={hasUnavailableItems || !subtotal}
                    onClick={() => setOrderFormOpen(true)}
                    className={`mt-4 flex w-full items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wide2 transition-colors ${hasUnavailableItems || !subtotal ? "cursor-not-allowed bg-cream/15 text-cream/35" : "bg-gold text-ink hover:bg-gold-light"}`}
                  >
                    <MessageCircle size={16} />
                    Order on WhatsApp ({formatPrice(subtotal)})
                  </button>

                  <Link
                    to="/contact"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-3 block text-center text-xs uppercase tracking-wide2 text-cream/50 transition-colors hover:text-gold"
                  >
                    Questions? Visit or Call Us
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    <WhatsAppOrderModal
      open={orderFormOpen}
      onClose={() => setOrderFormOpen(false)}
      items={items.filter((item) => item.available)}
      subtotal={subtotal}
    />
    </>
  );
}
