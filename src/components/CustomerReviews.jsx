import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Star, X } from "lucide-react";
import ReviewCard from "./ReviewCard";
import SectionHeading from "./SectionHeading";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function uploadPath(file) {
  const extension = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "image";
  return `${crypto.randomUUID()}.${extension}`;
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewStart, setReviewStart] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReviews = useCallback(async () => {
    if (!supabase) { setReviews([]); setLoading(false); return; }
    const { data, error } = await supabase.from("customer_reviews")
      .select("id, customer_name, rating, review_text, image_urls, created_at")
      .eq("status", "approved").order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    else { setLoadError(""); setReviews(data || []); }
    setLoading(false);
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);
  useEffect(() => {
    if (!supabase) return undefined;
    const channel = supabase.channel("approved-customer-reviews")
      .on("postgres_changes", { event: "*", schema: "public", table: "customer_reviews" }, loadReviews)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadReviews]);

  useEffect(() => {
    if (showAllReviews || reviews.length <= 3) return undefined;
    const timer = window.setInterval(() => {
      setReviewStart((current) => (current + 3 >= reviews.length ? 0 : current + 3));
    }, 6500);
    return () => window.clearInterval(timer);
  }, [reviews.length, showAllReviews]);

  useEffect(() => {
    if (!reviewFormOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setReviewFormOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [reviewFormOpen]);

  const average = useMemo(() => reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0, [reviews]);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(reviewStart, reviewStart + 3);

  function moveReviewWindow(direction) {
    setReviewStart((current) => {
      const next = current + direction * 3;
      return next < 0 ? Math.max(0, Math.ceil(reviews.length / 3) * 3 - 3) : next >= reviews.length ? 0 : next;
    });
  }

  function chooseImages(event) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (selected.length + images.length > MAX_IMAGES) { setFormError(`You can attach up to ${MAX_IMAGES} images.`); return; }
    const invalid = selected.find((file) => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE);
    if (invalid) { setFormError(`${invalid.name} must be a JPG, PNG, WebP, or GIF smaller than 5 MB.`); return; }
    setFormError("");
    setImages((current) => [...current, ...selected]);
  }

  async function submitReview(event) {
    event.preventDefault(); setFormError(""); setSuccess("");
    if (!rating) { setFormError("Choose a star rating before submitting."); return; }
    if (!isSupabaseConfigured) { setFormError("Reviews are not connected yet. Please try again later."); return; }
    setSaving(true);
    try {
      const imageUrls = await Promise.all(images.map(async (file) => {
        const path = uploadPath(file);
        const { error } = await supabase.storage.from("review-images").upload(path, file, {
          cacheControl: "3600", upsert: false, contentType: file.type,
        });
        if (error) throw error;
        return supabase.storage.from("review-images").getPublicUrl(path).data.publicUrl;
      }));
      const { error } = await supabase.from("customer_reviews").insert({
        customer_name: customerName.trim(), rating, review_text: reviewText.trim(), image_urls: imageUrls,
      });
      if (error) throw error;
      setCustomerName(""); setRating(0); setReviewText(""); setImages([]);
      setSuccess("Thank you for sharing your experience. Your review is awaiting approval.");
    } catch (error) {
      setFormError(error.message || "We couldn’t submit your review. Please try again.");
    } finally { setSaving(false); }
  }

  return <section className="bg-[#faf9f6] py-20 sm:py-28">
    <div className="container-px mx-auto max-w-content">
      <SectionHeading eyebrow="Customer stories" title="Loved by Fragrance Lovers" light />
      <div className="mt-8 flex flex-col items-center gap-2">
        {reviews.length ? <><div className="flex items-center gap-3"><span className="font-display text-3xl text-gold">{average.toFixed(1)}</span><div className="flex gap-1 text-gold" aria-label={`${average.toFixed(1)} average stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} fill={i < Math.round(average) ? "currentColor" : "none"} />)}</div></div><p className="text-sm uppercase tracking-wide2 text-ink/60">From {reviews.length} approved {reviews.length === 1 ? "review" : "reviews"}</p></>
          : <p className="text-sm text-ink/55">{loading ? "Loading customer reviews…" : "Be the first to share your experience."}</p>}
      </div>

      {loadError && <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-red-700">Customer reviews are temporarily unavailable.</p>}
      {reviews.length > 0 && <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleReviews.map((review) => <ReviewCard key={review.id} review={{
        ...review, quote: review.review_text, name: review.customer_name, images: review.image_urls || [],
      }} light />)}</div>}

      {reviews.length > 3 && <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        {!showAllReviews && <div className="flex items-center gap-2"><button type="button" onClick={() => moveReviewWindow(-1)} aria-label="Previous customer reviews" className="grid h-10 w-10 place-items-center border border-ink/20 text-ink transition-colors hover:border-gold hover:text-gold"><ChevronLeft size={18} /></button><span className="px-2 text-xs tabular-nums text-ink/55">{Math.floor(reviewStart / 3) + 1} / {Math.ceil(reviews.length / 3)}</span><button type="button" onClick={() => moveReviewWindow(1)} aria-label="Next customer reviews" className="grid h-10 w-10 place-items-center border border-ink/20 text-ink transition-colors hover:border-gold hover:text-gold"><ChevronRight size={18} /></button></div>}
        <button type="button" onClick={() => { setShowAllReviews((current) => !current); setReviewStart(0); }} className="min-h-10 px-4 text-xs font-medium uppercase tracking-wide2 text-gold underline decoration-gold/40 underline-offset-4 hover:text-ink">{showAllReviews ? "Show featured reviews" : "View all reviews"}</button>
      </div>}

      <div className="mt-10 flex justify-center"><button type="button" onClick={() => { setReviewFormOpen(true); setFormError(""); }} className="min-h-12 bg-ink px-7 py-3 text-sm font-medium uppercase tracking-wide2 text-cream transition-colors hover:bg-gold hover:text-ink">Add a review</button></div>

      {reviewFormOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setReviewFormOpen(false); }}>
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-ink/15 bg-white p-6 shadow-2xl sm:p-9" role="dialog" aria-modal="true" aria-labelledby="review-form-title">
        <div className="mb-7 flex items-start justify-between gap-4"><div><p className="text-[11px] uppercase tracking-wide2 text-gold">Your experience matters</p><h3 id="review-form-title" className="mt-2 font-display text-3xl text-ink">Write a review</h3><p className="mt-2 text-sm leading-relaxed text-ink/60">Tell other fragrance lovers what you think. Reviews appear after our team approves them.</p></div><button type="button" onClick={() => setReviewFormOpen(false)} className="grid h-10 w-10 flex-none place-items-center border border-ink/15 text-ink/60 hover:border-gold hover:text-ink" aria-label="Close review form"><X size={20} /></button></div>
        <form onSubmit={submitReview} className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-ink">Your name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} maxLength={80} required placeholder="Name shown with your review" className="min-h-12 border border-ink/20 bg-white px-4 py-3 text-sm outline-none focus:border-gold" /></label>
          <fieldset><legend className="text-sm font-medium text-ink">Your rating <span className="text-red-700">*</span></legend><div className="mt-2 flex gap-2" role="radiogroup" aria-label="Choose a star rating">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} star${value === 1 ? "" : "s"}`} onClick={() => setRating(value)} className="rounded p-1 text-gold transition-transform hover:scale-110 focus-visible:outline-2"><Star size={30} fill={value <= rating ? "currentColor" : "none"} /></button>)}</div></fieldset>
          <label className="grid gap-2 text-sm font-medium text-ink">Your review<textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} minLength={10} maxLength={2000} rows={5} required placeholder="Share your experience with our fragrances or service…" className="resize-y border border-ink/20 bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-gold" /><span className="text-right text-xs font-normal text-ink/45">{reviewText.length}/2000</span></label>
          <div><span className="block text-sm font-medium text-ink">Photos <span className="font-normal text-ink/50">(optional, up to 3)</span></span><div className="mt-2 flex flex-wrap items-center gap-3"><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-ink/20 px-4 text-sm text-ink transition-colors hover:border-gold"><ImagePlus size={17} /> Add photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={chooseImages} className="sr-only" disabled={images.length >= MAX_IMAGES} /></label>{images.map((file, index) => <span key={`${file.name}-${index}`} className="max-w-48 truncate text-xs text-ink/60">{file.name}<button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="ml-2 text-red-700" aria-label={`Remove ${file.name}`}>×</button></span>)}</div><p className="mt-2 text-xs text-ink/45">JPG, PNG, WebP, or GIF. Up to 5 MB per image.</p></div>
          {formError && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</p>}
          {success && <p role="status" className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{success}</p>}
          <div className="flex flex-wrap items-center gap-3"><button className="min-h-12 justify-self-start bg-ink px-7 py-3 text-sm font-medium uppercase tracking-wide2 text-cream transition-colors hover:bg-gold hover:text-ink disabled:cursor-wait disabled:opacity-60" disabled={saving}>{saving ? "Submitting…" : "Submit review"}</button><button type="button" onClick={() => setReviewFormOpen(false)} className="min-h-12 px-5 text-sm text-ink/65 hover:text-ink">Cancel</button></div>
        </form>
      </div></div>}
    </div>
  </section>;
}
