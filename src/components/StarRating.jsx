import { Star, StarHalf } from "lucide-react";

export default function StarRating({ rating = 0, size = 14, showValue = false, reviews }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex items-center gap-0.5 text-gold">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} size={size} fill="currentColor" strokeWidth={0} />
        ))}
        {half && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="text-gold/25" fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      {showValue && (
        <span className="text-xs text-cream/60">
          {rating.toFixed(1)}
          {reviews != null && ` (${reviews})`}
        </span>
      )}
    </div>
  );
}
