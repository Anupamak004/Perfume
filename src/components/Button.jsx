import { Link } from "react-router-dom";

const VARIANTS = {
  primary:
    "bg-gold text-ink hover:bg-gold-light border border-gold hover:border-gold-light",
  outline:
    "bg-transparent text-cream border border-gold/60 hover:border-gold hover:bg-gold/10",
  dark:
    "bg-ink text-cream border border-cream/20 hover:border-gold/60 hover:text-gold",
  ghost:
    "bg-transparent text-cream border border-transparent hover:text-gold",
};

const SIZES = {
  sm: "px-5 py-2.5 text-[11px]",
  md: "px-7 py-3.5 text-xs",
  lg: "px-9 py-4 text-sm",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  icon: Icon,
  iconPosition = "right",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-sans uppercase tracking-wide2 font-medium transition-all duration-300 ease-out rounded-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon size={16} aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon size={16} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target={props.target} rel={props.target ? "noopener noreferrer" : undefined} {...props}>
        {content}
      </a>
    );
  }

  const Component = as || "button";
  return (
    <Component className={classes} {...props}>
      {content}
    </Component>
  );
}
