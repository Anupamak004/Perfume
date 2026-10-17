import { motion } from "framer-motion";
import Button from "./Button";

export default function HeroSection({
  image,
  eyebrow,
  title,
  subtitle,
  actions = [],
  fullScreen = false,
  dark = false,
  noOverlay = false,
  compactTitle = false,
  largeSubtitle = false,
  lowerContent = false,
  higherContent = false,
  fullImage = false,
  displayTitle = false,
  imagePosition = "center",
  mobileImagePosition,
  bottomLeftShade = false,
  eyebrowAfterTitle = false,
  homeHero = false,
  breadcrumb,
}) {
  return (
    <section
      className={`relative flex items-end overflow-hidden bg-ink ${
        fullScreen ? "h-[100svh] min-h-[520px] sm:min-h-[560px]" : "h-[58svh] min-h-[390px] sm:h-[58vh] sm:min-h-[420px]"
      }`}
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className={`hero-background-image absolute inset-0 h-full w-full ${fullImage ? "object-cover object-[right_top]" : "object-cover"}`}
        style={{
          "--hero-object-position": fullImage ? "right top" : imagePosition,
          "--hero-mobile-object-position": fullImage ? "right top" : mobileImagePosition || imagePosition,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[58%] bg-gradient-to-t from-ink/75 via-ink/20 to-transparent sm:hidden" aria-hidden="true" />
      {!noOverlay && (
        <>
          <div
            className={`absolute inset-0 ${
              dark ? "bg-gradient-to-t from-ink via-ink/85 to-ink/60" : "bg-gradient-to-t from-ink via-ink/60 to-ink/20"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-transparent" />
        </>
      )}
      {bottomLeftShade && <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/20 to-transparent" />}

      <div className={`container-px relative z-10 mx-auto w-full max-w-content ${homeHero ? "pb-36 min-[390px]:pb-40 sm:pb-64 lg:pb-28" : higherContent ? "pb-32 sm:pb-56 lg:pb-28" : lowerContent ? "pb-32 sm:pb-48 lg:pb-16" : "pb-32 sm:pb-56 lg:pb-28"}`}>
        {breadcrumb}
        {eyebrow && !eyebrowAfterTitle && (
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mb-4 block font-display text-2xl italic text-gold sm:text-3xl"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`${displayTitle ? "font-display font-medium tracking-normal" : "font-sans font-semibold tracking-[-0.03em]"} max-w-5xl break-words leading-[0.98] text-cream ${
            compactTitle
              ? "text-3xl min-[390px]:text-4xl sm:text-6xl md:text-7xl"
              : "text-4xl min-[390px]:text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
          }`}
        >
          {title}
        </motion.h1>
        {eyebrow && eyebrowAfterTitle && (
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-4 block font-display text-2xl italic text-gold sm:text-3xl"
          >
            {eyebrow}
          </motion.span>
        )}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className={`mt-5 max-w-xl font-sans leading-snug text-cream/85 ${largeSubtitle ? "text-xl sm:text-3xl" : "text-base sm:text-xl"}`}
          >
            {subtitle}
          </motion.p>
        )}
        {actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {actions.map((action) => (
              <Button key={action.label} to={action.to} href={action.href} size="lg" variant={action.variant || "primary"}>
                {action.label}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
