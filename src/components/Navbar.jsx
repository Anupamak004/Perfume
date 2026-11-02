import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, Heart, Megaphone } from "lucide-react";
import useScrolled from "../hooks/useScrolled";
import { useCart } from "../context/CartContext";
import { SITE_CONFIG } from "../data/siteConfig";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";
import { useWishlist } from "../context/WishlistContext";
import { useCatalog } from "../context/CatalogContext";
import { isPromotionLive, useOffers } from "../context/OffersContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const scrolled = useScrolled(30);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setIsCartOpen } = useCart();
  const { ids } = useWishlist();
  const { products } = useCatalog();
  const { promotions } = useOffers();
  const announcements = promotions.filter((promotion) => promotion.show_in_banner && isPromotionLive(promotion))
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const showAnnouncement = announcements.length > 0;
  const announcement = showAnnouncement ? announcements[announcementIndex % announcements.length] : null;
  useEffect(() => {
    if (announcements.length < 2) {
      setAnnouncementIndex(0);
      return undefined;
    }
    const timer = window.setInterval(() => setAnnouncementIndex((index) => (index + 1) % announcements.length), 5000);
    return () => window.clearInterval(timer);
  }, [announcements.length]);
  const wishlistCount = ids.filter((id) => products.some((product) => product.id === id)).length;

  return (
    <>
      {showAnnouncement && (
        <div className="fixed inset-x-0 top-0 z-[60] flex min-h-9 items-center justify-center gap-2 bg-gold px-10 py-2 text-center text-[10px] text-ink sm:min-h-10 sm:gap-3 sm:text-xs">
          <Megaphone size={14} className="hidden shrink-0 sm:block" />
          <p key={announcement.id} aria-live="polite" className="announcement-message min-w-0 leading-snug"><strong className="font-semibold">{announcement.title}</strong>{announcement.message ? <span className="hidden sm:inline"> — {announcement.message}</span> : null}</p>
          {announcement.cta_label && announcement.cta_url && (announcement.cta_url.startsWith("/") && !announcement.cta_url.startsWith("//")
            ? <Link to={announcement.cta_url} className="shrink-0 font-semibold uppercase tracking-wide2 underline underline-offset-2">{announcement.cta_label}</Link>
            : <a href={announcement.cta_url} target="_blank" rel="noreferrer" className="shrink-0 font-semibold uppercase tracking-wide2 underline underline-offset-2">{announcement.cta_label}</a>)}
        </div>
      )}
      <header
        className={`fixed inset-x-0 ${showAnnouncement ? "top-9 sm:top-10" : "top-0"} z-40 transition-all duration-500 ${
          scrolled
            ? "bg-ink/90 backdrop-blur-md border-b border-cream/10 py-3"
            : "bg-gradient-to-b from-ink/70 to-transparent py-4 sm:py-5 border-b border-transparent"
        }`}
      >
        <div className="container-px mx-auto flex max-w-content items-center justify-between gap-1 sm:gap-2">
          <Link
            to="/"
            className="flex min-w-0 shrink items-center gap-1.5 sm:gap-3 sm:shrink-0"
            aria-label={`${SITE_CONFIG.brandName} home`}
          >
            <img
              src="/perfume-store-logo.svg"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 shrink-0 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16"
            />
            <span className="brand-neon">
              <span>PERFUME</span>
              <span>STORE</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `link-underline text-xs uppercase tracking-wide2 transition-colors ${
                    isActive ? "text-gold" : "text-cream/85 hover:text-gold"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              type="button"
              aria-label="Search fragrances"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-cream/85 transition-colors hover:text-gold sm:h-10 sm:w-10"
            >
              <Search size={19} />
            </button>
            <Link
              to="/wishlist"
              aria-label={`View wishlist, ${wishlistCount} saved item${wishlistCount === 1 ? "" : "s"}`}
              className="relative flex h-9 w-9 items-center justify-center text-cream/85 transition-colors hover:text-gold sm:h-10 sm:w-10"
            >
              <Heart size={19} />
              {wishlistCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink">{wishlistCount > 9 ? "9+" : wishlistCount}</span>}
            </Link>
            <button
              type="button"
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center text-cream/85 transition-colors hover:text-gold sm:h-10 sm:w-10"
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-cream/85 transition-colors hover:text-gold sm:h-10 sm:w-10 lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
