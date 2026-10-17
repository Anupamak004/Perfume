import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import CategoryCard from "../components/CategoryCard";
import ProductGrid from "../components/ProductGrid";
import CustomerReviews from "../components/CustomerReviews";
import StoreLocation from "../components/StoreLocation";
import Button from "../components/Button";
import { CATEGORIES, HERO_IMAGE } from "../data/products";
import { useCatalog } from "../context/CatalogContext";

import { SITE_CONFIG } from "../data/siteConfig";

const MOODS = ["Fresh", "Sweet", "Woody", "Floral", "Oud", "Musky"];
const HOME_FEATURED_ORDER = [
  "velvet-noir",
  "love-muse",
  "mystique-elegance",
  "eternal-radiance",
  "missoni-wave",
  "kaaf-noir",
  "boss-bottled-absolu",
  "carolina-bad-boy-cobalt",
];

export default function Home() {
  const { products } = useCatalog();
  const featured = products.filter((product) => product.featured);
  const homeFeatured = HOME_FEATURED_ORDER.map((id) => featured.find((product) => product.id === id)).filter(Boolean);
  const [mood, setMood] = useState(null);

  return (
    <>
      <title>{SITE_CONFIG.meta.title}</title>
      <meta name="description" content={SITE_CONFIG.meta.description} />

      {/* HERO */}
      <HeroSection
        fullScreen
        homeHero
        image={HERO_IMAGE}
        noOverlay
        imagePosition="center 52%"
        mobileImagePosition="center 47%"
        title={
          <>
            <span className="tracking-[-0.03em]">The Quest of</span>
            <br />
            <span className="font-extrabold [text-shadow:1px_0_currentColor,-1px_0_currentColor,0_1px_currentColor,0_-1px_currentColor]">Fragrance</span>
          </>
        }
        subtitle="Discover premium perfumes, rare blends, and authentic decants, carefully chosen for every fragrance journey."
        actions={[
          { label: "Explore Collection", to: "/collections", variant: "primary" },
          { label: "Visit Our Store", to: "/contact", variant: "outline" },
        ]}
      />

      {/* FIND YOUR SIGNATURE */}
      <section className="relative overflow-hidden py-5 sm:py-5">
        <img
          src="/images/collection-bg.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-[5px]"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/28 to-transparent" />
        <div className="container-px relative z-10 mx-auto max-w-content">
          <SectionHeading
            align="left"
            title="Find Your Signature"
          />
          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} to={`/collections/${cat.id}`} image={cat.image} label={cat.label} tagline={cat.tagline} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="border-t border-ink/10 bg-[#faf9f6] py-10 sm:py-16">
        <div className="container-px mx-auto max-w-content">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading align="left" title="Featured Collection" light className="items-start text-left" />
            <Link to="/collections" className="link-underline text-xs uppercase tracking-wide2 text-gold">
              View All →
            </Link>
          </div>
          <div className="mt-14">
            <ProductGrid products={homeFeatured} light />
          </div>
        </div>
      </section>

      {/* OUD SECTION */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden py-14 sm:min-h-[70vh] sm:py-20">
        <img src="/images/the_soul.webp" alt="Oud and attar fragrance ambiance" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="container-px relative mx-auto max-w-content text-left">
          <div className="max-w-xl text-left">
            <span className="text-xs uppercase tracking-wide3 text-gold">Oud & Attar</span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-cream sm:text-5xl md:text-6xl">
              THE SOUL OF OUD
            </h2>
            <p className="mt-6 font-display text-2xl italic text-cream/80 sm:text-3xl">
              Deep. Warm. Unforgettable.
            </p>
            <p className="mt-5 max-w-md text-sm text-cream/65 sm:text-base">
              Discover the world of oud, attar and timeless oriental fragrances.
            </p>
            <Button to="/collections/oud-attar" variant="primary" className="mt-9">
              Discover Oud
            </Button>
          </div>
        </div>
      </section>

      {/* FRAGRANCE FINDER PREVIEW */}
      <section className="relative overflow-hidden bg-ink py-10 sm:py-14">
        <img
          src="/images/guided_discover1.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="container-px relative z-10 mx-auto flex max-w-content flex-col items-end">
          <SectionHeading
            align="left"
            eyebrow="Guided Discovery"
            title="Find Your Signature Scent"
            subtitle="Not sure what to choose? Let us help you discover the fragrance that suits you."
            className="w-full max-w-2xl items-start text-left"
          />
          <div className="mt-12 w-full max-w-2xl text-left">
            <p className="text-xs uppercase tracking-wide2 text-cream/50">What kind of fragrance do you prefer?</p>
            <div className="mt-6 flex flex-wrap items-center justify-start gap-3">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  aria-pressed={mood === m}
                  className={`border px-6 py-3 text-xs uppercase tracking-wide2 transition-colors ${
                    mood === m
                      ? "border-gold bg-gold text-ink"
                      : "border-cream/20 text-cream/75 hover:border-gold hover:text-gold"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <Button
              to={mood ? `/fragrance-finder?mood=${encodeURIComponent(mood)}` : "/fragrance-finder"}
              variant="primary"
              className="mt-10"
            >
              Find My Fragrance →
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="relative min-h-[280px] overflow-hidden border-t border-cream/5 py-8 sm:min-h-[400px] sm:py-12">
        <img
          src="/images/store.webp"
          alt={`Inside ${SITE_CONFIG.brandName} boutique`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
        <div className="container-px relative z-10 mx-auto flex max-w-content items-start pt-8 sm:pt-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <span className="text-xs uppercase tracking-wide3 text-gold">Our Story</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-cream sm:text-4xl md:text-5xl">
              MORE THAN A PERFUME.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
              A fragrance is more than a scent. It is the impression you leave behind.
            </p>
            <Button to="/about" variant="outline" className="mt-8">
              Our Story
            </Button>
          </motion.div>
        </div>
      </section>

      <CustomerReviews />

      {/* VISIT THE PERFUME PIRATE */}
      <section className="border-t border-cream/5 bg-espresso/20 py-12 sm:py-16">
        <div className="container-px mx-auto max-w-content">
          <StoreLocation image="/images/storePlace.webp" compact />
        </div>
      </section>
    </>
  );
}
