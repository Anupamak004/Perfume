import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { getCartWhatsAppUrl } from "../data/siteConfig";
import { formatPrice } from "../utils/format";

const EMPTY_DETAILS = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", instructions: "" };

function Field({ label, name, value, onChange, required = false, type = "text", autoComplete }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-cream/60">{label}{required && <span className="ml-1 text-gold">*</span>}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="min-h-11 w-full border border-cream/15 bg-ink/60 px-3 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
      />
    </label>
  );
}

export default function WhatsAppOrderModal({ open, onClose, items, subtotal }) {
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const savings = items.reduce((sum, item) => sum + Math.max(0, (item.originalPrice ?? item.price) - item.price) * item.quantity, 0);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const updateField = (event) => setDetails((current) => ({ ...current, [event.target.name]: event.target.value }));

  function submitOrder(event) {
    event.preventDefault();
    const url = getCartWhatsAppUrl(items, subtotal, details);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Close order form" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] cursor-default bg-ink/75 backdrop-blur-sm" />
          <motion.div role="dialog" aria-modal="true" aria-labelledby="whatsapp-order-title" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} className="fixed inset-0 z-[71] flex items-center justify-center p-3 sm:p-6">
            <form onSubmit={submitOrder} className="flex max-h-[94svh] w-full max-w-xl flex-col border border-gold/25 bg-ink shadow-2xl">
              <header className="flex items-start justify-between border-b border-cream/10 px-5 py-4 sm:px-7 sm:py-5">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.24em] text-gold">Delivery details</span>
                  <h2 id="whatsapp-order-title" className="mt-1 font-display text-2xl text-cream sm:text-3xl">Where should we send it?</h2>
                  <p className="mt-1 text-xs text-cream/50">We’ll prepare your order in WhatsApp for confirmation.</p>
                </div>
                <button type="button" onClick={onClose} aria-label="Close" className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center text-cream/60 hover:text-gold"><X size={19} /></button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" name="name" value={details.name} onChange={updateField} required autoComplete="name" />
                  <Field label="Contact number" name="phone" value={details.phone} onChange={updateField} required type="tel" autoComplete="tel" />
                </div>
                <Field label="Email (optional)" name="email" value={details.email} onChange={updateField} type="email" autoComplete="email" />
                <Field label="House / flat, street and area" name="address" value={details.address} onChange={updateField} required autoComplete="street-address" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" name="city" value={details.city} onChange={updateField} required autoComplete="address-level2" />
                  <Field label="State" name="state" value={details.state} onChange={updateField} required autoComplete="address-level1" />
                </div>
                <Field label="PIN code" name="pincode" value={details.pincode} onChange={updateField} required autoComplete="postal-code" />
                <label className="block">
                  <span className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-cream/60">Delivery instructions (optional)</span>
                  <textarea name="instructions" value={details.instructions} onChange={updateField} rows={2} className="w-full resize-y border border-cream/15 bg-ink/60 px-3 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold" />
                </label>
                <div className="border-t border-cream/10 pt-4">
                  <div className="flex items-center justify-between text-xs text-cream/60"><span>{items.length} item{items.length === 1 ? "" : "s"}</span><span>Order subtotal</span></div>
                  <p className="mt-1 text-right font-display text-xl text-gold">{formatPrice(subtotal)}</p>
                  {savings > 0 && <p className="mt-1 text-right text-xs text-emerald-300">You save {formatPrice(savings)} with this offer</p>}
                  <p className="mt-2 text-[10px] leading-relaxed text-cream/40">Your details are added to the WhatsApp message and sent when you submit the order.</p>
                </div>
              </div>

              <footer className="flex flex-col-reverse gap-2 border-t border-cream/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button type="button" onClick={onClose} className="min-h-11 border border-cream/15 px-5 text-xs uppercase tracking-wide2 text-cream/70 hover:border-cream/40">Cancel</button>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 bg-gold px-5 text-xs font-semibold uppercase tracking-wide2 text-ink transition-colors hover:bg-gold-light"><MessageCircle size={15} /> Continue to WhatsApp</button>
              </footer>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
