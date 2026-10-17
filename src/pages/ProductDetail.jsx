import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Heart, Share2, Check, MessageCircle, Eye, EyeOff } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import ProductGrid from "../components/ProductGrid";
import SectionHeading from "../components/SectionHeading";
import { CATEGORIES, getDefaultSizes } from "../data/products";
import { useCatalog } from "../context/CatalogContext";
import { SITE_CONFIG } from "../data/siteConfig";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import WhatsAppOrderModal from "../components/WhatsAppOrderModal";
import { getProductPromotion, getPromotionPrice, useOffers } from "../context/OffersContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading, stockConfirmed } = useCatalog();
  const product = products.find((item) => item.id === id) || null;
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { promotions } = useOffers();

  const sizes = useMemo(
    () => (product?.sizes?.length ? product.sizes : product ? getDefaultSizes(product.price) : []),
    [product]
  );

  const [selectedSize, setSelectedSize] = useState(() => sizes.filter((size) => size.in_stock !== false).at(-1) || sizes.at(-1) || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [imageFocused, setImageFocused] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [whatsappOrderOpen, setWhatsappOrderOpen] = useState(false);

  useEffect(() => {
    if (sizes.length) {
      setSelectedSize((current) => sizes.find((size) => size.label === current?.label && size.in_stock !== false)
        || sizes.filter((size) => size.in_stock !== false).at(-1) || sizes.at(-1));
    }
  }, [id, product?.sizes]);

  const related = useMemo(() => {
    if (!product) return [];
    const productMoods = new Set((product.moods || []).map((mood) => mood.toLowerCase()));
    const productNotes = new Set(Object.values(product.notes || {}).flat().map((note) => note.toLowerCase()));
    return products
      .filter((item) => item.id !== product.id && item.category !== product.category)
      .map((item) => {
        const sharedMoods = (item.moods || []).filter((mood) => productMoods.has(mood.toLowerCase())).length;
        const sharedNotes = Object.values(item.notes || {}).flat().filter((note) => productNotes.has(note.toLowerCase())).length;
        return { item, score: sharedMoods * 3 + sharedNotes * 2 };
      })
      .sort((a, b) => b.score - a.score || Number(b.item.featured) - Number(a.item.featured) || b.item.rating - a.item.rating)
      .slice(0, 4)
      .map(({ item }) => item);
  }, [product, products]);
  const similarProducts = useMemo(
    () => product ? products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4) : [],
    [product, products],
  );

  if (!product && loading) return <div className="container-px mx-auto max-w-content py-40 text-center text-cream/60">Loading fragrance…</div>;
  if (!product) return <Navigate to="/collections" replace />;

  const originalPrice = selectedSize ? selectedSize.price : product.price;
  const activeOffer = getProductPromotion(product, promotions)?.promotion;
  const currentPrice = activeOffer ? getPromotionPrice(originalPrice, activeOffer) : originalPrice;
  const categoryMeta = CATEGORIES.find((c) => c.id === product.category);
  const wishlisted = isWishlisted(product.id);
  const showImageNotes = imageHovered || imageFocused || notesOpen;
  const noteSections = [
    ["Top notes", product.notes?.top],
    ["Heart notes", product.notes?.heart],
    ["Base notes", product.notes?.base],
  ];

  function toggleImageNotes() {
    if (notesOpen) {
      setNotesOpen(false);
      setImageFocused(false);
    } else {
      setNotesOpen(true);
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <title>{`${product.name} | ${SITE_CONFIG.brandName}`}</title>
      <meta name="description" content={product.description} />

      <div className="container-px mx-auto max-w-content pt-28 sm:pt-32">
        <Breadcrumbs
          trail={[
            { label: "Home", to: "/" },
            { label: "Collections", to: "/collections" },
            { label: categoryMeta?.label || "Collection", to: `/collections/${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-px mx-auto max-w-content pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* GALLERY */}
          <div className="mx-auto w-full max-w-[540px] lg:sticky lg:top-28 lg:mx-0 lg:self-start">
            <motion.div
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setImageHovered(true); }}
              onPointerLeave={(event) => { if (event.pointerType === "mouse") setImageHovered(false); }}
              onFocusCapture={() => setImageFocused(true)}
              onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setImageFocused(false); }}
              className="group/product-image relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-transparent"
            >
              <img
                src={product.image}
                alt={`${product.name} — ${product.fragranceType} perfume bottle`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="relative z-[1] h-full w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-ink/20 opacity-70 transition-opacity duration-500 group-hover/product-image:opacity-100" aria-hidden="true" />
              <motion.div className="absolute inset-y-0 right-0 z-10 flex w-[82%] flex-col justify-center border-l border-gold/35 bg-gradient-to-l from-ink/95 via-ink/90 to-ink/80 px-4 shadow-[-18px_0_48px_rgba(0,0,0,0.32)] backdrop-blur-md sm:w-[66%] sm:px-7" initial={false} animate={{ opacity: showImageNotes ? 1 : 0, x: showImageNotes ? 0 : 40 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} style={{ pointerEvents: showImageNotes ? "auto" : "none" }}>
                <div className="mb-4 flex items-start justify-between gap-2 border-b border-gold/25 pb-3 sm:mb-6 sm:pb-5">
                  <div className="min-w-0"><span className="text-[9px] uppercase tracking-[0.2em] text-gold sm:text-[10px] sm:tracking-[0.28em]">The fragrance profile</span><h2 className="mt-1 font-display text-2xl leading-none text-cream sm:text-4xl">Scent journey</h2><p className="mt-2 truncate text-[9px] uppercase tracking-[0.16em] text-cream/45 sm:text-[10px]">{product.fragranceType}</p></div>
                </div>
                <div className="space-y-3 sm:space-y-5">
                  {noteSections.map(([label, notes], index) => (
                    <motion.div key={label} initial={{ opacity: 0, x: 12 }} animate={{ opacity: showImageNotes ? 1 : 0, x: showImageNotes ? 0 : 12 }} transition={{ duration: 0.36, delay: showImageNotes ? index * 0.13 : 0 }} className="relative border-l border-gold/35 py-0.5 pl-3.5 sm:pl-5">
                      <span className="absolute -left-[4px] top-1 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(201,164,92,0.7)] sm:h-2 sm:w-2" />
                      <div className="flex items-baseline gap-2"><span className="font-display text-xs text-gold/60 sm:text-sm">0{index + 1}</span><p className="text-[9px] uppercase tracking-[0.2em] text-gold sm:text-[10px] sm:tracking-[0.24em]">{label}</p></div>
                      <p className="mt-1 break-words font-display text-base leading-snug text-cream sm:text-2xl">{Array.isArray(notes) && notes.length ? notes.join(" · ") : "Notes not listed"}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <button type="button" onClick={toggleImageNotes} aria-expanded={showImageNotes} aria-label={showImageNotes ? "Hide fragrance notes" : "Show fragrance notes"} className={`absolute bottom-3 right-3 z-20 inline-flex min-h-10 items-center gap-2 border px-3 text-[10px] uppercase tracking-wide2 shadow-lg backdrop-blur-sm transition-colors sm:hidden ${showImageNotes ? "border-gold bg-gold text-ink" : "border-gold/60 bg-ink/85 text-cream hover:bg-ink"}`}>
                {showImageNotes ? <EyeOff size={14} /> : <Eye size={14} />}{showImageNotes ? "Hide notes" : "View scent notes"}
              </button>
              <button type="button" onClick={toggleImageNotes} aria-expanded={showImageNotes} aria-label={showImageNotes ? "Hide fragrance notes" : "Show fragrance notes"} className="absolute bottom-3 right-3 z-20 hidden min-h-10 items-center gap-2 border border-gold/60 bg-ink/85 px-4 text-xs uppercase tracking-wide2 text-cream shadow-lg backdrop-blur-sm transition-colors hover:border-gold hover:text-gold focus:opacity-100 sm:inline-flex sm:opacity-0">
                {showImageNotes ? <EyeOff size={15} /> : <Eye size={15} />}{showImageNotes ? "Hide notes" : "View notes"}
              </button>
              <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 text-[10px] uppercase tracking-wide2 text-cream/85 drop-shadow sm:flex" style={{ opacity: showImageNotes ? 0 : 1 }}><Eye size={14} className="text-gold" /> Hover to reveal fragrance notes</div>
            </motion.div>
            {similarProducts.length > 0 && (
              <div className="mt-5 border-t border-cream/10 pt-4">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2 className="text-[10px] uppercase tracking-[0.2em] text-cream/55">Similar fragrances</h2>
                  <span className="text-[9px] uppercase tracking-wide2 text-gold/70">{categoryMeta?.label}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {similarProducts.map((item) => (
                    <Link key={item.id} to={`/product/${item.id}`} className="group/similar w-[76px] shrink-0 sm:w-[88px]">
                      <div className="aspect-square overflow-hidden border border-cream/10 bg-espresso">
                        <img src={item.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover/similar:scale-105" />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-cream/65 transition-colors group-hover/similar:text-gold">{item.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.24em] text-gold sm:text-xs">{categoryMeta?.label}</span>
              <span className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] ${!stockConfirmed ? "border-cream/15 text-cream/55" : product.inStock ? "border-emerald-300/20 bg-emerald-950/20 text-emerald-200" : "border-red-300/20 bg-red-950/20 text-red-200"}`} role="status"><i className={`h-1.5 w-1.5 rounded-full ${!stockConfirmed ? "bg-cream/40" : product.inStock ? "bg-emerald-300" : "bg-red-300"}`} />{!stockConfirmed ? "Checking availability" : product.inStock ? "Available to order" : "Currently unavailable"}</span>
            </div>
            <h1 className="mt-3 break-words font-display text-4xl leading-[1.05] text-cream sm:text-5xl">{product.name}</h1>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/50 sm:text-sm">{product.fragranceType}</p>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-b border-cream/10 pb-5">
              <div><span className="block text-[9px] uppercase tracking-[0.2em] text-cream/40">{sizes.length ? "Selected size price" : "Price"}</span><span className="mt-1 flex flex-wrap items-baseline gap-x-3"><strong className="font-sans text-3xl font-semibold tracking-tight tabular-nums text-gold sm:text-4xl">{formatPrice(currentPrice)}</strong>{activeOffer && <del className="text-sm text-cream/45">{formatPrice(originalPrice)}</del>}</span>{activeOffer && <span className="mt-1 inline-block border border-gold/40 bg-gold/10 px-2 py-1 text-[9px] uppercase tracking-wide2 text-gold">{activeOffer.title}</span>}</div>
              {product.rating > 0 && <div className="flex items-center gap-2"><StarRating rating={product.rating} size={14} /><span className="text-xs text-cream/55">{product.rating.toFixed(1)}{product.reviews > 0 ? ` · ${product.reviews} reviews` : ""}</span></div>}
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-cream/70 sm:text-base">{product.description}</p>

            {/* SIZES / DECANTS */}
            {sizes.length > 0 && (
              <div className="mt-7">
                <div className="flex items-end justify-between gap-3">
                  <div><h2 className="text-xs uppercase tracking-wide2 text-gold">Choose your size</h2><p className="mt-1 text-xs text-cream/45">Select a bottle or decant option</p></div>
                  {selectedSize && (
                    <span className="text-right text-xs text-cream/65">Selected<br /><strong className="mt-0.5 inline-block font-medium text-cream">{selectedSize.label}</strong></span>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {sizes.map((s) => {
                    const active = selectedSize?.label === s.label;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => s.in_stock && setSelectedSize(s)}
                        disabled={!s.in_stock}
                        className={`flex min-h-[68px] flex-col items-start justify-center gap-1 border px-3.5 py-2.5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                          active && s.in_stock
                            ? "border-gold bg-gold/10 text-cream shadow-[inset_0_0_0_1px_rgba(201,164,92,0.2)]"
                            : "border-cream/15 bg-espresso/40 text-cream/75 hover:border-gold/60"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.15em]">{s.label}</span>
                        <span className="flex flex-wrap items-baseline gap-x-1.5">
                          <span className={`font-sans text-base font-semibold tracking-tight tabular-nums sm:text-lg ${active && s.in_stock ? "text-gold" : "text-cream/85"}`}>{formatPrice(activeOffer ? getPromotionPrice(s.price, activeOffer) : s.price)}</span>
                          {activeOffer && <del className="text-[10px] text-cream/40">{formatPrice(s.price)}</del>}
                          {!s.in_stock && <span className="text-[10px] text-cream/50">· Sold out</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NOTES */}
            <div className="mt-8 border-t border-cream/10 pt-6">
              <div className="flex items-baseline justify-between gap-3"><h2 className="text-xs uppercase tracking-wide2 text-gold">Fragrance notes</h2><span className="text-[9px] uppercase tracking-[0.16em] text-cream/35">Top · Heart · Base</span></div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                {[
                  ["Top Notes", product.notes.top],
                  ["Heart Notes", product.notes.heart],
                  ["Base Notes", product.notes.base],
                ].map(([label, notes]) => (
                  <div key={label} className="border-l border-gold/35 bg-espresso/35 px-3 py-3 sm:min-h-[88px] sm:px-4">
                    <h3 className="text-[9px] uppercase tracking-[0.18em] text-gold/75">{label}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-cream/80 sm:text-sm">{notes.join(" · ") || "Not listed"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* QUANTITY & ACTIONS */}
            <div className="mt-7 border border-cream/10 bg-espresso/40 p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-[10px] uppercase tracking-[0.2em] text-cream/55">Quantity & ordering</h2><span className="text-right text-[10px] text-cream/40">{selectedSize?.label || "Standard size"}</span></div>
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 shrink-0 items-center border border-cream/20 bg-ink/40">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="flex h-11 w-10 items-center justify-center text-cream/70 hover:text-gold"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-8 text-center text-sm text-cream" aria-live="polite">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="flex h-11 w-10 items-center justify-center text-cream/70 hover:text-gold"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  {stockConfirmed && product.inStock && (
                    <Button onClick={handleAddToCart} variant="outline" size="lg" icon={added ? Check : undefined} iconPosition="left" className="min-w-0 flex-1 px-3 sm:px-7">
                      {added ? "Added to Cart" : "Add to Cart"}
                    </Button>
                  )}
                </div>

                {stockConfirmed && product.inStock ? (
                  <Button as="button" type="button" onClick={() => setWhatsappOrderOpen(true)} variant="primary" size="lg" icon={MessageCircle} iconPosition="left" className="w-full px-4 sm:px-7">
                    Order on WhatsApp
                  </Button>
                ) : (
                  <div className="border border-red-300/30 bg-red-950/30 px-5 py-3 text-xs uppercase tracking-wide2 text-red-200" role="status">
                    {stockConfirmed ? "Currently out of stock" : "Availability could not be confirmed"}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(product.id)}
                aria-pressed={wishlisted}
                className="inline-flex min-h-10 items-center gap-2 border border-cream/10 px-3 text-xs text-cream/65 transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Heart size={16} fill={wishlisted ? "currentColor" : "none"} className={wishlisted ? "text-gold" : ""} />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
              <button
                type="button"
                onClick={() =>
                  navigator.share?.({ title: product.name, url: window.location.href }) ||
                  navigator.clipboard?.writeText(window.location.href)
                }
                className="inline-flex min-h-10 items-center gap-2 border border-cream/10 px-3 text-xs text-cream/65 transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-white py-20 sm:py-24">
          <div className="container-px mx-auto max-w-content">
            <SectionHeading align="left" light eyebrow="Beyond This Collection" title="A New Scent Story" subtitle="Explore fragrances from other collections, chosen for notes and moods you may enjoy." className="items-start text-left" />
            <div className="mt-12">
              <ProductGrid products={related} light />
            </div>
          </div>
        </section>
      )}

      <WhatsAppOrderModal
        open={whatsappOrderOpen}
        onClose={() => setWhatsappOrderOpen(false)}
        items={[{ ...product, size: selectedSize?.label, quantity, price: currentPrice, originalPrice: activeOffer && currentPrice < originalPrice ? originalPrice : null }]}
        subtotal={currentPrice * quantity}
      />
    </>
  );
}
