import { Quote } from "lucide-react";
import StarRating from "./StarRating";

export default function ReviewCard({ review, light = false }) {
  const name = review.name || review.customer_name || "Customer";
  const initials = review.initials || name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`flex h-full flex-col border p-7 ${light ? "border-ink/15 bg-white" : "border-cream/10 bg-espresso/40"}`}>
      <Quote className="text-gold/40" size={26} />
      <p className={`mt-4 flex-1 text-base leading-relaxed sm:text-lg ${light ? "text-ink/80" : "text-cream/80"}`}>“{review.quote}”</p>
      {review.images?.length > 0 && <div className="mt-5 flex gap-2 overflow-x-auto">{review.images.map((url, index) => <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer" aria-label={`Open customer review photo ${index + 1}`}><img src={url} alt={`Customer review ${index + 1}`} loading="lazy" className="h-20 w-20 rounded object-cover" /></a>)}</div>}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-xs text-gold">
          {initials}
        </div>
        <div className="ml-3 flex min-w-0 flex-1 items-center justify-between gap-3"><span className={`truncate text-sm font-medium ${light ? "text-ink" : "text-cream"}`}>{name}</span><StarRating rating={review.rating} size={13} /></div>
      </div>
    </div>
  );
}
