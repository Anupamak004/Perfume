import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import StarRating from "./StarRating";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCatalog } from "../context/CatalogContext";
import { getProductPromotion, getPromotionPrice, useOffers } from "../context/OffersContext";

export default function ProductCard({ product, light = false, darkSurface = false }) {
  const { addItem } = useCart();
  const { stockConfirmed } = useCatalog();
  const { promotions } = useOffers();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const quickAddSize = product.sizes?.filter((size) => size.in_stock !== false).sort((a, b) => a.price - b.price)[0];
  const canOrder = stockConfirmed && product.inStock && (!product.sizes?.length || quickAddSize);
  const activeOffer = getProductPromotion(product, promotions)?.promotion;
  const displayPrice = activeOffer ? getPromotionPrice(product.price, activeOffer) : product.price;
  const offerLabel = activeOffer ? activeOffer.discount_type === "percent" ? `${Number(activeOffer.discount_value)}% OFF` : `${formatPrice(activeOffer.discount_value)} OFF` : "";

  return (
    <div className={`group relative flex h-full min-w-0 flex-col ${light ? `border p-2 sm:p-3 ${darkSurface ? "border-ink bg-black" : "border-ink/15 bg-cream"}` : ""}`}>
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[3/4] overflow-hidden bg-espresso"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={`${product.name} — ${product.fragranceType} perfume bottle`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/10 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        {!product.inStock && <span className="absolute bottom-3 left-3 border border-cream/40 bg-ink/85 px-2.5 py-1.5 text-[10px] uppercase tracking-wide2 text-cream">Out of stock</span>}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-cream/20 bg-ink/40 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} className={wishlisted ? "text-gold" : ""} />
        </button>

        <span className="absolute left-3 right-14 top-3 w-fit max-w-[calc(100%-4.5rem)] truncate border border-gold/50 bg-ink/40 px-2.5 py-1 text-[10px] uppercase tracking-wide2 text-gold backdrop-blur-sm">
          {product.fragranceType}
        </span>
        {activeOffer && <span className="absolute left-3 top-12 border border-gold bg-gold px-2 py-1 text-[9px] font-semibold uppercase tracking-wide2 text-ink">{offerLabel}</span>}

        <div className="product-quick-add absolute inset-x-0 bottom-0 p-2 sm:p-3">
          {canOrder ? <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product, 1, quickAddSize || null);
            }}
            className="w-full border border-gold bg-ink/90 py-2.5 text-[10px] uppercase tracking-wide2 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink sm:py-3 sm:text-[11px]"
          >Add to Cart</button> : <div aria-disabled="true" className="w-full border border-cream/30 bg-ink/90 py-3 text-center text-[11px] uppercase tracking-wide2 text-cream/60 backdrop-blur-sm">
            {!stockConfirmed ? "Checking Availability" : "Out of Stock"}
          </div>}
        </div>
      </Link>

      <Link to={`/product/${product.id}`} className="product-card-info mt-3 flex flex-1 flex-col sm:mt-4">
        <h3 title={product.name} className={`product-card-title font-display transition-colors group-hover:text-gold ${light && !darkSurface ? "text-lg font-semibold text-ink sm:text-2xl" : "text-lg text-cream sm:text-xl"}`}>
          {product.name}
        </h3>
        <p title={product.fragranceType} className={`product-card-family mt-1 text-xs uppercase tracking-wide2 ${light && !darkSurface ? "font-medium text-ink" : "text-cream/50"}`}>{product.fragranceType}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className={`whitespace-nowrap font-display text-gold ${light ? "text-xl font-semibold" : "text-lg"}`}>{formatPrice(displayPrice)}</span>
            {activeOffer && <del className="whitespace-nowrap text-[11px] text-current opacity-50">{formatPrice(product.price)}</del>}
          </span>
          <StarRating rating={product.rating} size={12} />
        </div>
      </Link>
    </div>
  );
}
