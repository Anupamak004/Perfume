import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-cream/50">
      {trail.map((crumb, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={12} className="text-cream/30" />}
            {crumb.to && !isLast ? (
              <Link to={crumb.to} className="link-underline hover:text-gold">
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? "text-gold" : ""} aria-current={isLast ? "page" : undefined}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
