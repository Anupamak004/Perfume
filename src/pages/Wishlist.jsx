import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductGrid from "../components/ProductGrid";
import Button from "../components/Button";
import { useCatalog } from "../context/CatalogContext";
import { useWishlist } from "../context/WishlistContext";
import { SITE_CONFIG } from "../data/siteConfig";

export default function Wishlist() {
  const { products, loading } = useCatalog();
  const { ids } = useWishlist();
  const savedProducts = products.filter((product) => ids.includes(product.id));

  return (
    <>
      <title>{`Your Wishlist | ${SITE_CONFIG.brandName}`}</title>
      <meta name="description" content={`Your saved fragrances from ${SITE_CONFIG.brandName}.`} />

      <div className="container-px mx-auto max-w-content pt-28 sm:pt-32">
        <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
      </div>

      <section className="container-px mx-auto min-h-[65vh] max-w-content pb-20 pt-8 sm:pt-12">
        <div className="mb-9 flex items-end justify-between border-b border-cream/10 pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-wide3 text-gold">Saved for your next discovery</p>
            <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">Your Wishlist</h1>
            <p className="mt-2 text-sm text-cream/55">
              {savedProducts.length} {savedProducts.length === 1 ? "fragrance" : "fragrances"} saved
            </p>
          </div>
          <Heart className="mb-2 hidden text-gold sm:block" size={27} />
        </div>

        {savedProducts.length ? (
          <ProductGrid products={savedProducts} columns="grid-cols-2 md:grid-cols-3 xl:grid-cols-4" />
        ) : (
          <div className="flex min-h-[340px] flex-col items-center justify-center border border-cream/10 px-6 text-center">
            <Heart className="text-gold/60" size={34} />
            <h2 className="mt-5 font-display text-2xl text-cream">{loading ? "Finding your saved fragrances…" : "Your wishlist is waiting"}</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/50">
              {loading ? "Your saved products will appear here in a moment." : "Tap the heart on any fragrance to keep it close and find it here later."}
            </p>
            {!loading && <Button to="/collections" variant="primary" size="md" className="mt-6">Explore the collection</Button>}
          </div>
        )}
      </section>
    </>
  );
}
