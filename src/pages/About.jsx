import { Gem, Sparkles, Users } from "lucide-react";
import HeroSection from "../components/HeroSection";
import Breadcrumbs from "../components/Breadcrumbs";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import { ABOUT_HERO_IMAGE } from "../data/products";
import { SITE_CONFIG } from "../data/siteConfig";

const PHILOSOPHY = [
  {
    icon: Gem,
    title: "Curated Excellence",
    text: "Handpicked selections evaluated for lasting sillage, depth of character, and genuine olfactory distinction.",
  },
  {
    icon: Sparkles,
    title: "Discovery & Decants",
    text: "From accessible 5ml & 10ml discovery decants to full collector bottles, explore without boundaries.",
  },
  {
    icon: Users,
    title: "Personalized Guidance",
    text: "We take the time to understand your taste and guide you toward a fragrance that genuinely elevates you.",
  },
];

export default function About() {
  return (
    <>
      <title>{`About Us | ${SITE_CONFIG.brandName}`}</title>
      <meta
        name="description"
        content={`Discover ${SITE_CONFIG.brandName} — premium fragrances, curated decants, and bespoke scents.`}
      />

      <HeroSection
        image={ABOUT_HERO_IMAGE}
        eyebrow="More Than a Perfume."
        title={
          <>
            ABOUT
            <br />
            PERFUME STORE
          </>
        }
        noOverlay
        compactTitle
        displayTitle
        eyebrowAfterTitle
        breadcrumb={
          <div className="relative lg:top-8">
            <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "About" }]} />
          </div>
        }
      />

      <section className="bg-cream py-20 sm:py-28">
        <div className="container-px mx-auto max-w-content">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-wide3 text-gold sm:text-base">Our Story</span>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-6xl">A Destination for Fragrance Lovers</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/75 sm:text-xl">
              {SITE_CONFIG.brandName} was founded with a singular pursuit: making the world of exceptional perfumery truly accessible and deeply personal. We curate premium perfumes, rare attars, and authentic fragrance decants crafted to become uniquely yours.
            </p>
            <p className="mt-4 text-base text-ink/65 sm:text-lg leading-relaxed">
              We believe a fragrance is more than a scent — it is the invisible mark of your character, your presence, and your memories. Whether you are exploring decants to find your next signature scent or investing in a statement bottle, we are here to guide your journey.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-cream/5 bg-espresso/20 py-20 sm:py-28">
        <div className="container-px mx-auto max-w-content">
          <SectionHeading eyebrow="What We Stand For" title="Our Philosophy" />
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {PHILOSOPHY.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl text-cream">{title}</h3>
                <p className="mt-2 text-sm text-cream/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-24">
        <div className="container-px mx-auto max-w-content">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="max-w-md">
              <span className="text-sm uppercase tracking-wide3 text-gold">Step Inside</span>
              <h2 className="mt-4 font-display text-4xl text-cream sm:text-5xl">Our Store</h2>
              <p className="mt-5 text-base leading-relaxed text-cream/70 sm:text-lg">
                Step into {SITE_CONFIG.brandName} and experience our curated collection of luxury fragrances and decants in person.
              </p>
              <Button to="/contact" size="md" className="mt-7">
                Visit Our Store
              </Button>
            </div>
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src="/images/about.webp"
                alt={`Interior of ${SITE_CONFIG.brandName} boutique`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
