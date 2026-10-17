export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className = "",
}) {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="mb-3 text-[11px] sm:text-xs uppercase tracking-wide3 text-gold">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display font-medium leading-[1.1] text-3xl sm:text-4xl md:text-5xl ${
          light ? "text-ink" : "text-cream"
        }`}
      >
        {title}
      </h2>
      <div className="mt-2 h-px w-16 bg-gold-line" aria-hidden="true" />
      {subtitle && (
        <p className={`mt-5 max-w-xl text-sm sm:text-base leading-relaxed ${light ? "text-ink/85" : "text-cream/70"}`}>{subtitle}</p>
      )}
    </div>
  );
}
