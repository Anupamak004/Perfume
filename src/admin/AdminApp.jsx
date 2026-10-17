import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, BadgePercent, Box, CalendarDays, Check, ChevronDown, CircleHelp, ImagePlus, LayoutDashboard, LogOut, Megaphone, MessageSquareText, PackagePlus, Plus, RefreshCw, Search, Settings2, ShieldCheck, Sparkles, Star, Tag, Trash2, Upload, X } from "lucide-react";
import { CATEGORIES, getDefaultSizes, PRODUCTS } from "../data/products";
import { isSupabaseConfigured, supabase } from "./supabase";

const blankProduct = () => ({
  id: "", name: "", category: "men", gender: "Men", fragrance_type: "",
  description: "", image: "", imagesText: "", featured: false,
  moodsText: "", occasionText: "", styleText: "", topText: "", heartText: "", baseText: "",
  sizes: [{ label: "", price: "", in_stock: true }],
});

const split = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);
const optimizedImageUrl = (url) => typeof url === "string"
  ? url.replace(/^(\/images\/[^?#]+)\.(?:png|jpe?g)([?#].*)?$/i, "$1.webp$2")
  : url;
const fromRow = (row) => ({
  ...row,
  image: optimizedImageUrl(row.image),
  imagesText: (row.images || []).map(optimizedImageUrl).join(", "), moodsText: (row.moods || []).join(", "),
  occasionText: (row.occasion || []).join(", "), styleText: (row.style || []).join(", "),
  topText: (row.notes?.top || []).join(", "), heartText: (row.notes?.heart || []).join(", "),
  baseText: (row.notes?.base || []).join(", "),
  sizes: (row.sizes?.length ? row.sizes : getDefaultSizes(row.price)).map((size) => ({
    label: size.label || "", price: String(size.price ?? ""),
    in_stock: typeof size.in_stock === "boolean" ? size.in_stock : row.in_stock !== false,
  })),
});

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) setError(authError.message); else onLogin(data.session);
  }
  return <main className="login-shell"><section className="login-card">
    <div className="brand-mark">TPP<span>ADMIN</span></div><div className="eyebrow">THE PERFUME PIRATE · CATALOGUE</div>
    <h1>Welcome back.</h1><p>Sign in to manage your fragrance catalogue.</p>
    <form onSubmit={submit} className="login-form"><label>Email address<input autoComplete="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      {error && <div className="error-banner">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form><div className="secure-note"><ShieldCheck size={15} /> Private, administrator-only access</div>
  </section></main>;
}

function ProductEditor({ product, onClose, onSave, onUpload, saving }) {
  const [form, setForm] = useState(product ? fromRow(product) : blankProduct());
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState("");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateSize = (index, key, value) => setForm((current) => ({
    ...current,
    sizes: current.sizes.map((size, i) => i === index ? { ...size, [key]: value } : size),
  }));
  async function uploadSelected(event, target) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    const invalid = files.find((file) => !allowedTypes.includes(file.type) || file.size > 8 * 1024 * 1024);
    if (invalid) { setError(`${invalid.name} must be a JPG, PNG, WebP, GIF, or AVIF image smaller than 8 MB.`); return; }
    setError(""); setUploading(target);
    try {
      const urls = await onUpload(files);
      if (target === "main") set("image", urls[0]);
      else set("imagesText", [...split(form.imagesText), ...urls].join(", "));
    } catch (uploadError) { setError(uploadError.message || "Image upload failed. Check the Storage setup and try again."); }
    finally { setUploading(""); }
  }
  async function submit(event) {
    event.preventDefault(); setError("");
    const enteredSizes = form.sizes.filter((size) => size.label.trim() || String(size.price).trim());
    if (!enteredSizes.length || enteredSizes.some((size) => !size.label.trim() || size.price === "" || !Number.isFinite(Number(size.price)) || Number(size.price) < 0)) {
      setError("Add a bottle size and a valid price for every size row."); return;
    }
    const sizes = enteredSizes.map((size) => ({ label: size.label.trim(), price: Number(size.price), in_stock: size.in_stock }));
    const availableSizes = sizes.filter((size) => size.in_stock);
    const displayPrice = Math.min(...(availableSizes.length ? availableSizes : sizes).map((size) => size.price));
    const id = form.id.trim() || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!id) { setError("Add a product name to create its product ID."); return; }
    await onSave({ id, name: form.name.trim(), category: form.category, gender: form.gender, price: displayPrice,
      fragrance_type: form.fragrance_type.trim(), description: form.description.trim(), image: form.image.trim(),
      images: split(form.imagesText), featured: form.featured, in_stock: availableSizes.length > 0,
      moods: split(form.moodsText), occasion: split(form.occasionText), style: split(form.styleText),
      notes: { top: split(form.topText), heart: split(form.heartText), base: split(form.baseText) }, sizes });
  }
  return <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="editor-panel" role="dialog" aria-modal="true" aria-label={product ? "Edit product" : "Add product"}>
    <header className="editor-header"><div><div className="eyebrow">CATALOGUE ENTRY</div><h2>{product ? "Edit product" : "Add a product"}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X /></button></header>
    <form onSubmit={submit} className="editor-form"><div className="form-grid">
      <label className="span-2">Product name<input autoFocus value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Velvet Noir" required /></label>
      <label>Product ID <span className="field-hint">Leave blank to generate</span><input value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="velvet-noir" /></label>
      <label>Category<select value={form.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
      <label>Gender<select value={form.gender} onChange={(e) => set("gender", e.target.value)}>{["Men", "Women", "Unisex"].map((g) => <option key={g}>{g}</option>)}</select></label>
      <label className="span-2">Fragrance family<input value={form.fragrance_type} onChange={(e) => set("fragrance_type", e.target.value)} placeholder="Woody · Spicy" /></label>
      <div className="span-2 image-field-group"><label htmlFor="main-product-image">Main product image <span className="field-hint">Upload from your computer or paste an existing URL</span></label><div className="image-upload-field"><input id="main-product-image" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" /><label className="upload-button"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(e) => uploadSelected(e, "main")} disabled={Boolean(uploading)} /><Upload size={15} />{uploading === "main" ? "Uploading…" : "Choose image"}</label></div>{form.image && <img className="image-preview" src={form.image} alt="Main product preview" />}</div>
      <div className="span-2 image-field-group"><label htmlFor="product-gallery-images">Product gallery <span className="field-hint">Upload one or more images, or paste URLs separated by commas</span></label><div className="image-upload-field"><input id="product-gallery-images" value={form.imagesText} onChange={(e) => set("imagesText", e.target.value)} placeholder="Image URLs…" /><label className="upload-button"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple onChange={(e) => uploadSelected(e, "gallery")} disabled={Boolean(uploading)} /><ImagePlus size={15} />{uploading === "gallery" ? "Uploading…" : "Add images"}</label></div><span className="upload-hint">Images are stored in your Supabase product-images bucket. Maximum 8 MB each.</span></div>
      <label className="span-2">Description<textarea rows="3" value={form.description} onChange={(e) => set("description", e.target.value)} /></label>
      <label>Top notes <span className="field-hint">Comma separated</span><input value={form.topText} onChange={(e) => set("topText", e.target.value)} /></label>
      <label>Heart notes <span className="field-hint">Comma separated</span><input value={form.heartText} onChange={(e) => set("heartText", e.target.value)} /></label>
      <label>Base notes <span className="field-hint">Comma separated</span><input value={form.baseText} onChange={(e) => set("baseText", e.target.value)} /></label>
      <label>Moods <span className="field-hint">Comma separated</span><input value={form.moodsText} onChange={(e) => set("moodsText", e.target.value)} /></label>
      <label>Occasions <span className="field-hint">Comma separated</span><input value={form.occasionText} onChange={(e) => set("occasionText", e.target.value)} /></label>
      <label>Style tags <span className="field-hint">Comma separated</span><input value={form.styleText} onChange={(e) => set("styleText", e.target.value)} /></label>
      <div className="span-2 variant-editor"><div className="variant-heading"><div><strong>Bottle sizes & availability</strong><span>Set a price and stock status for each size.</span></div><div className="bulk-stock"><span>Set all:</span><button type="button" onClick={() => set("sizes", form.sizes.map((size) => ({ ...size, in_stock: true })))}>In stock</button><button type="button" onClick={() => set("sizes", form.sizes.map((size) => ({ ...size, in_stock: false })))}>Out of stock</button></div></div>
        <div className="variant-list">{form.sizes.map((size, index) => <div className="variant-row" key={index}>
          <label className="variant-name">Bottle size<input value={size.label} onChange={(e) => updateSize(index, "label", e.target.value)} placeholder="e.g. 50ml Bottle" /></label>
          <label className="variant-price">Price (₹)<input type="number" min="0" step="1" value={size.price} onChange={(e) => updateSize(index, "price", e.target.value)} placeholder="2499" /></label>
          <label className="variant-stock"><input type="checkbox" checked={size.in_stock} onChange={(e) => updateSize(index, "in_stock", e.target.checked)} /><span>{size.in_stock ? "In stock" : "Out"}</span></label>
          <button type="button" className="remove-variant" onClick={() => set("sizes", form.sizes.length > 1 ? form.sizes.filter((_, i) => i !== index) : [{ label: "", price: "", in_stock: true }])} aria-label={`Remove size ${index + 1}`}><Trash2 size={14} /></button>
        </div>)}</div><button type="button" className="add-variant" onClick={() => set("sizes", [...form.sizes, { label: "", price: "", in_stock: true }])}><Plus size={15} /> Add bottle size</button>
      </div>
    </div><div className="toggle-row"><label className="check-label"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on storefront</label><span className="stock-summary">Product availability follows its in-stock sizes.</span></div>
      {error && <div className="error-banner">{error}</div>}<footer className="editor-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={saving}>{saving ? "Saving…" : product ? "Save changes" : "Create product"}</button></footer>
    </form>
  </section></div>;
}

const toLocalDateTime = (value) => {
  const date = value ? new Date(value) : new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function PromotionEditor({ promotion, products, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => ({
    kind: promotion?.kind || "announcement",
    title: promotion?.title || "",
    message: promotion?.message || "",
    discount_type: promotion?.discount_type || "percent",
    discount_value: promotion?.discount_value ?? "",
    scope: promotion?.scope || "all",
    category: promotion?.category || "men",
    product_ids: promotion?.product_ids || [],
    show_in_banner: promotion?.show_in_banner ?? true,
    cta_label: promotion?.cta_label || "Shop now",
    cta_url: promotion?.cta_url || "/collections",
    starts_at: toLocalDateTime(promotion?.starts_at || new Date(Date.now() - 60000)),
    ends_at: toLocalDateTime(promotion?.ends_at || new Date(Date.now() + 7 * 86400000)),
    is_active: promotion?.is_active ?? true,
  }));
  const [error, setError] = useState("");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleProduct = (id) => set("product_ids", form.product_ids.includes(id) ? form.product_ids.filter((item) => item !== id) : [...form.product_ids, id]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    const start = new Date(form.starts_at);
    const end = new Date(form.ends_at);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) { setError("Choose an end date and time after the start."); return; }
    if (form.kind === "discount" && (!Number(form.discount_value) || Number(form.discount_value) <= 0 || (form.discount_type === "percent" && Number(form.discount_value) > 100))) { setError("Enter a valid discount. Percentage discounts must be between 1 and 100."); return; }
    if (form.kind === "discount" && form.scope === "products" && !form.product_ids.length) { setError("Choose at least one product for this offer."); return; }
    await onSave({
      ...(promotion?.id ? { id: promotion.id } : {}),
      kind: form.kind, title: form.title.trim(), message: form.message.trim(),
      discount_type: form.kind === "discount" ? form.discount_type : null,
      discount_value: form.kind === "discount" ? Number(form.discount_value) : null,
      scope: form.kind === "discount" ? form.scope : "all",
      category: form.kind === "discount" && form.scope === "category" ? form.category : null,
      product_ids: form.kind === "discount" && form.scope === "products" ? form.product_ids : [],
      show_in_banner: form.show_in_banner, cta_label: form.cta_label.trim(), cta_url: form.cta_url.trim(),
      starts_at: start.toISOString(), ends_at: end.toISOString(), is_active: form.is_active,
    });
  }

  return <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="editor-panel promotion-editor" role="dialog" aria-modal="true" aria-label={promotion ? "Edit offer" : "Create offer"}>
    <header className="editor-header"><div><div className="eyebrow">STOREFRONT PROMOTION</div><h2>{promotion ? "Edit offer or announcement" : "Create an offer or announcement"}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close"><X /></button></header>
    <form onSubmit={submit} className="editor-form"><div className="form-grid">
      <label className="span-2">Promotion type<select value={form.kind} onChange={(event) => set("kind", event.target.value)}><option value="announcement">Announcement</option><option value="discount">Discount offer</option></select></label>
      <label className="span-2">Headline<input value={form.title} onChange={(event) => set("title", event.target.value)} placeholder="e.g. Weekend fragrance edit" required maxLength={100} /></label>
      <label className="span-2">Supporting message<textarea rows="2" value={form.message} onChange={(event) => set("message", event.target.value)} placeholder="Tell customers what the offer includes" maxLength={220} /></label>
      {form.kind === "discount" && <>
        <label>Discount type<select value={form.discount_type} onChange={(event) => set("discount_type", event.target.value)}><option value="percent">Percentage off</option><option value="fixed">Amount off (₹)</option></select></label>
        <label>{form.discount_type === "percent" ? "Discount (%)" : "Discount amount (₹)"}<input type="number" min="1" max={form.discount_type === "percent" ? "100" : undefined} step="1" value={form.discount_value} onChange={(event) => set("discount_value", event.target.value)} required /></label>
        <label className="span-2">Applies to<select value={form.scope} onChange={(event) => set("scope", event.target.value)}><option value="all">All products</option><option value="category">One collection</option><option value="products">Selected products</option></select></label>
        {form.scope === "category" && <label className="span-2">Collection<select value={form.category} onChange={(event) => set("category", event.target.value)}>{CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>}
        {form.scope === "products" && <div className="span-2"><span className="field-label">Choose products</span><div className="promotion-product-picker">{products.map((product) => <label key={product.id}><input type="checkbox" checked={form.product_ids.includes(product.id)} onChange={() => toggleProduct(product.id)} /><span>{product.name}</span></label>)}{!products.length && <span className="field-hint">Load products before choosing specific items.</span>}</div></div>}
      </>}
      <label>Starts at<input type="datetime-local" value={form.starts_at} onChange={(event) => set("starts_at", event.target.value)} required /></label>
      <label>Ends at<input type="datetime-local" value={form.ends_at} onChange={(event) => set("ends_at", event.target.value)} required /></label>
      <label>Button label<input value={form.cta_label} onChange={(event) => set("cta_label", event.target.value)} placeholder="Shop now" maxLength={30} /></label>
      <label>Button link<input value={form.cta_url} onChange={(event) => set("cta_url", event.target.value)} placeholder="/collections" /></label>
      <label className="span-2 promotion-check"><input type="checkbox" checked={form.show_in_banner} onChange={(event) => set("show_in_banner", event.target.checked)} /> Show this promotion in the announcement bar</label>
      <label className="span-2 promotion-check"><input type="checkbox" checked={form.is_active} onChange={(event) => set("is_active", event.target.checked)} /> Promotion is enabled (dates still control when it appears)</label>
    </div>
    {error && <div className="error-banner">{error}</div>}
    <footer className="editor-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={saving}>{saving ? "Saving…" : promotion ? "Save promotion" : "Create promotion"}</button></footer>
    </form>
  </section></div>;
}

function PromotionsPage({ promotions, loading, onRefresh, onCreate, onEdit, onToggle, onDelete, problem, notice }) {
  const statusOf = (promotion) => {
    const now = Date.now();
    if (!promotion.is_active) return "Paused";
    if (new Date(promotion.starts_at).getTime() > now) return "Scheduled";
    if (new Date(promotion.ends_at).getTime() <= now) return "Ended";
    return "Live";
  };
  return <div className="promotions-page">
    <div className="page-heading"><div><div className="eyebrow">STOREFRONT CAMPAIGNS</div><h1>Offers & announcements</h1><p>Schedule store banners and discounts by collection or product.</p></div><button className="primary-button add-button" onClick={onCreate}><Plus size={17} /> New promotion</button></div>
    {problem && <div className="error-banner page-error">{problem}</div>}{notice && <div className="success-banner">{notice}</div>}
    <section className="catalog-card"><div className="catalog-title"><div><h2>Your promotions</h2><p>Dates determine when active offers appear to customers.</p></div><button className="text-button" onClick={onRefresh} disabled={loading}><RefreshCw size={16} /> Refresh</button></div>
      {loading ? <div className="overview-empty">Loading promotions…</div> : promotions.length ? <div className="promotion-list">{promotions.map((promotion) => {
        const status = statusOf(promotion);
        const scopeLabel = promotion.kind !== "discount" ? "Announcement" : promotion.scope === "all" ? "All products" : promotion.scope === "category" ? CATEGORIES.find((item) => item.id === promotion.category)?.label || promotion.category : `${(promotion.product_ids || []).length} selected products`;
        const offerLabel = promotion.kind === "discount" ? `${promotion.discount_type === "percent" ? `${promotion.discount_value}% off` : `₹${Number(promotion.discount_value).toLocaleString("en-IN")} off`} · ${scopeLabel}` : scopeLabel;
        return <article className="promotion-row" key={promotion.id}>
          <div className="promotion-icon">{promotion.kind === "discount" ? <BadgePercent size={18} /> : <Megaphone size={18} />}</div>
          <div className="promotion-copy"><div className="promotion-title-line"><strong>{promotion.title}</strong><span className={`promotion-status status-${status.toLowerCase()}`}>{status}</span></div><span>{offerLabel}{promotion.show_in_banner ? " · Announcement bar" : ""}</span><small><CalendarDays size={13} /> {new Date(promotion.starts_at).toLocaleString()} – {new Date(promotion.ends_at).toLocaleString()}</small></div>
          <div className="promotion-actions"><button className="row-edit-button" onClick={() => onEdit(promotion)}>Edit</button><button className="secondary-button promotion-toggle" onClick={() => onToggle(promotion)}>{promotion.is_active ? "Pause" : "Enable"}</button><button className="review-delete" onClick={() => onDelete(promotion)}>Delete</button></div>
        </article>;
      })}</div> : <div className="overview-empty promotion-empty"><Tag size={25} /><strong>No offers or announcements yet</strong><span>Create a scheduled offer to feature a discount in the banner, on product cards, and in the cart.</span><button className="primary-button" onClick={onCreate}><Plus size={16} /> Create first promotion</button></div>}
    </section>
    <div className="page-footnote"><ShieldCheck size={16} /> Promotions automatically start and end at their scheduled times. Active discounts are applied to eligible product sizes.</div>
  </div>;
}

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activeSection, setActiveSection] = useState("overview");
  const [editor, setEditor] = useState(undefined);
  const [promotionEditor, setPromotionEditor] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [problem, setProblem] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogConnected, setCatalogConnected] = useState(false);
  const [promotionSaving, setPromotionSaving] = useState(false);

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return undefined; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProducts = useCallback(async () => {
    if (!session) return;
    setCatalogLoading(true);
    setProblem("");
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) { setProblem(error.message); setCatalogConnected(false); }
    else { setProducts((data || []).map((row) => ({ ...row, image: optimizedImageUrl(row.image), images: (row.images || []).map(optimizedImageUrl) }))); setCatalogConnected(true); }
    setCatalogLoading(false);
  }, [session]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const loadReviews = useCallback(async () => {
    if (!session) return;
    setReviewsLoading(true);
    const { data, error } = await supabase.from("customer_reviews").select("*").order("created_at", { ascending: false });
    if (error) setProblem(error.message);
    else setReviews(data || []);
    setReviewsLoading(false);
  }, [session]);
  useEffect(() => { loadReviews(); }, [loadReviews]);
  const pendingReviews = useMemo(() => reviews.filter((review) => review.status === "pending"), [reviews]);

  const loadPromotions = useCallback(async () => {
    if (!session) return;
    setPromotionsLoading(true);
    const { data, error } = await supabase.from("store_promotions").select("*").order("created_at", { ascending: false });
    if (error) {
      setProblem(`Offers need one-time database setup. Run supabase/offers.sql in your Supabase SQL Editor. (${error.message})`);
    } else {
      setPromotions(data || []);
    }
    setPromotionsLoading(false);
  }, [session]);
  useEffect(() => { loadPromotions(); }, [loadPromotions]);

  async function savePromotion(promotion) {
    setPromotionSaving(true); setProblem("");
    const { error } = await supabase.from("store_promotions").upsert(promotion);
    setPromotionSaving(false);
    if (error) { setProblem(error.message); return; }
    setPromotionEditor(undefined); setNotice("Promotion saved"); await loadPromotions(); setTimeout(() => setNotice(""), 3000);
  }
  async function togglePromotion(promotion) {
    setProblem("");
    const { error } = await supabase.from("store_promotions").update({ is_active: !promotion.is_active }).eq("id", promotion.id);
    if (error) setProblem(error.message); else { setNotice(promotion.is_active ? "Promotion paused" : "Promotion enabled"); await loadPromotions(); setTimeout(() => setNotice(""), 3000); }
  }
  async function deletePromotion(promotion) {
    if (!window.confirm(`Delete “${promotion.title}”?`)) return;
    setProblem("");
    const { error } = await supabase.from("store_promotions").delete().eq("id", promotion.id);
    if (error) setProblem(error.message); else { setNotice("Promotion deleted"); await loadPromotions(); setTimeout(() => setNotice(""), 3000); }
  }

  async function moderateReview(review, status) {
    setProblem("");
    const { error } = await supabase.from("customer_reviews").update({ status, moderated_at: new Date().toISOString() }).eq("id", review.id);
    if (error) setProblem(error.message);
    else { setNotice(status === "approved" ? "Review approved and published" : "Review rejected"); await loadReviews(); setTimeout(() => setNotice(""), 2800); }
  }
  async function deleteReview(review) {
    if (!window.confirm(`Permanently delete the review from “${review.customer_name}”?`)) return;
    setProblem("");
    const paths = (review.image_urls || []).map((url) => url.split("/review-images/")[1]?.split("?")[0]).filter(Boolean);
    if (paths.length) {
      const { error: imageError } = await supabase.storage.from("review-images").remove(paths);
      if (imageError) { setProblem(`Review images could not be removed: ${imageError.message}`); return; }
    }
    const { error } = await supabase.from("customer_reviews").delete().eq("id", review.id);
    if (error) setProblem(error.message);
    else { setNotice("Review deleted"); await loadReviews(); setTimeout(() => setNotice(""), 2800); }
  }

  const filtered = useMemo(() => products.filter((p) =>
    (category === "all" || p.category === category) && `${p.name} ${p.id} ${p.fragrance_type || ""}`.toLowerCase().includes(query.toLowerCase())), [products, category, query]);
  const stats = useMemo(() => ({ total: products.length, active: products.filter((p) => p.in_stock).length, featured: products.filter((p) => p.featured).length }), [products]);
  const outOfStock = useMemo(() => products.filter((product) => !product.in_stock), [products]);
  const recentProducts = useMemo(() => [...products].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)).slice(0, 5), [products]);

  async function saveProduct(product) {
    setBusy(true); setProblem("");
    const { error } = await supabase.from("products").upsert(product);
    setBusy(false);
    if (error) { setProblem(error.message); return; }
    setEditor(undefined); setNotice("Product saved successfully"); await loadProducts(); setTimeout(() => setNotice(""), 2800);
  }
  async function uploadImages(files) {
    const uploaded = await Promise.all(files.map(async (file) => {
      const extension = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "image";
      const path = `${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600", upsert: false, contentType: file.type,
      });
      if (error) throw error;
      return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
    }));
    return uploaded;
  }
  async function deleteProduct(product) {
    if (!window.confirm(`Delete “${product.name}” from the catalogue?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) setProblem(error.message); else { setNotice("Product deleted"); await loadProducts(); setTimeout(() => setNotice(""), 2800); }
  }
  async function importCatalog() {
    if (!window.confirm(`Import ${PRODUCTS.length} current storefront products into Supabase? Existing product IDs will be updated.`)) return;
    setBusy(true); setProblem("");
    const rows = PRODUCTS.map((p) => ({ id: p.id, name: p.name, category: p.category, gender: p.gender || "Unisex", price: p.price,
      fragrance_type: p.fragranceType || "", description: p.description || "", image: p.image || "", images: p.images || [],
      notes: p.notes || {}, moods: p.moods || [], occasion: p.occasion || [], style: p.style || [],
      featured: Boolean(p.featured), in_stock: p.inStock !== false, rating: p.rating || 0, reviews: p.reviews || 0,
      sizes: (p.sizes?.length ? p.sizes : getDefaultSizes(p.price)).map((size) => ({ ...size, in_stock: p.inStock !== false })) }));
    const { error } = await supabase.from("products").upsert(rows);
    setBusy(false);
    if (error) setProblem(error.message); else { setNotice(`Imported ${rows.length} products`); await loadProducts(); setTimeout(() => setNotice(""), 3500); }
  }

  if (!isSupabaseConfigured) return <main className="setup-shell"><section className="setup-card"><div className="brand-mark">TPP<span>ADMIN</span></div><div className="eyebrow">ONE-TIME SETUP</div><h1>Connect your catalogue.</h1><p>Add your Supabase project URL and public anon key to <code>.env.local</code>, then restart the development server.</p><pre>VITE_SUPABASE_URL=https://your-project.supabase.co<br />VITE_SUPABASE_ANON_KEY=your-anon-key</pre><a href="/" className="secondary-button">Return to storefront</a></section></main>;
  if (!authReady) return <main className="loading-shell">Loading admin…</main>;
  if (!session) return <Login onLogin={setSession} />;

  return <div className="admin-layout">
    <aside className="sidebar"><a className="sidebar-brand" href="/admin.html"><div className="brand-mark">TPP<span>ADMIN</span></div></a><div className="workspace-label">WORKSPACE</div>
      <button type="button" onClick={() => setActiveSection("overview")} className={`side-link ${activeSection === "overview" ? "active" : ""}`}><LayoutDashboard size={19} /> Overview</button>
      <button type="button" onClick={() => setActiveSection("products")} className={`side-link ${activeSection === "products" ? "active" : ""}`}><Box size={19} /> Products <span className="side-count">{products.length}</span></button>
      <button type="button" onClick={() => setActiveSection("offers")} className={`side-link ${activeSection === "offers" ? "active" : ""}`}><Megaphone size={19} /> Offers <span className="side-count">{promotions.filter((promotion) => promotion.is_active).length}</span></button>
      <button type="button" onClick={() => setActiveSection("reviews")} className={`side-link ${activeSection === "reviews" ? "active" : ""}`}><MessageSquareText size={19} /> Reviews <span className="side-count">{pendingReviews.length}</span></button>
      <button type="button" onClick={() => setActiveSection("settings")} className={`side-link ${activeSection === "settings" ? "active" : ""}`}><Settings2 size={19} /> Settings</button>
      <div className="sidebar-bottom"><button className="help-card" onClick={() => setActiveSection("settings")}><CircleHelp size={19} /><div><strong>Account & connection</strong><span>View access and storage</span></div><ChevronDown size={16} /></button><div className="admin-user"><div className="avatar">{session.user.email?.[0]?.toUpperCase()}</div><div className="user-copy"><strong>{session.user.email}</strong><span>Administrator</span></div><button className="icon-button logout" onClick={() => supabase.auth.signOut()} aria-label="Sign out"><LogOut size={17} /></button></div></div>
    </aside>
    <main className="main-area"><header className="topbar"><div><span className="crumb-muted">Workspace</span><span className="crumb-divider">/</span><strong>{activeSection === "overview" ? "Overview" : activeSection === "settings" ? "Settings" : activeSection === "reviews" ? "Reviews" : activeSection === "offers" ? "Offers" : "Products"}</strong></div><div className="topbar-right"><span className={`status-dot ${catalogConnected ? "" : catalogLoading ? "status-dot-pending" : "status-dot-off"}`} /> {catalogLoading ? "Connecting…" : catalogConnected ? "Catalogue connected" : "Connection issue"} <div className="top-avatar">{session.user.email?.[0]?.toUpperCase()}</div></div></header>
      <section className="content">
      {activeSection === "offers" ? <PromotionsPage promotions={promotions} loading={promotionsLoading} onRefresh={loadPromotions} onCreate={() => setPromotionEditor(null)} onEdit={setPromotionEditor} onToggle={togglePromotion} onDelete={deletePromotion} problem={problem} notice={notice} /> : activeSection === "reviews" ? <div className="reviews-page">
        <div className="page-heading"><div><div className="eyebrow">CUSTOMER FEEDBACK</div><h1>Customer reviews</h1><p>Approve customer stories before they appear on the storefront.</p></div><button className="secondary-button" onClick={loadReviews} disabled={reviewsLoading}><RefreshCw size={16} /> Refresh</button></div>
        {problem && <div className="error-banner page-error">{problem}</div>}{notice && <div className="success-banner">{notice}</div>}
        <div className="stat-grid"><article className="stat-card"><div className="stat-top"><span>Awaiting review</span><span className="stat-icon purple"><MessageSquareText size={18} /></span></div><strong>{pendingReviews.length}</strong><small>Not yet visible to customers</small></article><article className="stat-card"><div className="stat-top"><span>Published</span><span className="stat-icon green"><Check size={18} /></span></div><strong>{reviews.filter((review) => review.status === "approved").length}</strong><small>Visible on storefront</small></article><article className="stat-card"><div className="stat-top"><span>Total submissions</span><span className="stat-icon"><Star size={18} /></span></div><strong>{reviews.length}</strong><small>All review submissions</small></article></div>
        {reviewsLoading && reviews.length === 0 ? <div className="catalog-card review-empty">Loading customer reviews…</div> : reviews.length === 0 ? <div className="catalog-card review-empty"><MessageSquareText size={30} /><strong>No reviews yet</strong><span>Customer submissions will appear here for moderation.</span></div> : <div className="admin-review-list">{reviews.map((review) => <article className="catalog-card admin-review-card" key={review.id}>
          <header className="admin-review-header"><div><div className="review-person">{review.customer_name}</div><div className="review-meta"><span className={`review-status status-${review.status}`}>{review.status}</span><span>{new Date(review.created_at).toLocaleString()}</span></div></div><div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={17} fill={i < review.rating ? "currentColor" : "none"} />)}</div></header>
          <p className="admin-review-text">{review.review_text}</p>
          {review.image_urls?.length > 0 && <div className="admin-review-photos">{review.image_urls.map((url, i) => <a href={url} target="_blank" rel="noreferrer" key={url}><img src={url} alt={`Photo ${i + 1} submitted by ${review.customer_name}`} /></a>)}</div>}
          <footer className="review-actions">{review.status !== "approved" && <button className="primary-button" onClick={() => moderateReview(review, "approved")}><Check size={16} /> Approve & publish</button>}{review.status !== "rejected" && <button className="secondary-button" onClick={() => moderateReview(review, "rejected")}>Reject</button>}<button className="review-delete" onClick={() => deleteReview(review)}><Trash2 size={16} /> Delete</button></footer>
        </article>)}</div>}
      </div> : activeSection === "overview" ? <div className="overview-page">
        <div className="page-heading"><div><div className="eyebrow">THE PERFUME PIRATE · ADMIN</div><h1>Overview</h1><p>Your product catalogue at a glance.</p></div><button className="primary-button add-button" onClick={() => setEditor(null)}><PackagePlus size={18} /> Add product</button></div>
        <div className="stat-grid"><article className="stat-card"><div className="stat-top"><span>Total products</span><span className="stat-icon"><Box size={19} /></span></div><strong>{stats.total}</strong><small>Products in your catalogue</small></article><article className="stat-card"><div className="stat-top"><span>Available sizes</span><span className="stat-icon green"><Check size={19} /></span></div><strong>{products.reduce((sum, product) => sum + (product.sizes || []).filter((size) => size.in_stock !== false).length, 0)}</strong><small>Variants ready to order</small></article><article className="stat-card"><div className="stat-top"><span>Out of stock</span><span className="stat-icon purple"><CircleHelp size={19} /></span></div><strong>{outOfStock.length}</strong><small>Products with no available sizes</small></article></div>
        {problem && <div className="error-banner page-error">{problem}</div>}{notice && <div className="success-banner">{notice}</div>}
        <div className="overview-grid">
          <section className="catalog-card overview-panel"><div className="catalog-title"><div><h2>Recently updated</h2><p>Products most recently added or edited</p></div><button className="text-button" onClick={() => setActiveSection("products")}>View all products <ChevronDown size={16} className="-rotate-90" /></button></div>
            <div className="recent-list">{recentProducts.map((product) => <div className="recent-row" key={product.id}><div className="product-thumb">{product.image ? <img src={product.image} alt="" /> : <Box size={19} />}</div><div className="recent-name"><strong>{product.name}</strong><span>{CATEGORIES.find((item) => item.id === product.category)?.label || product.category} · {product.sizes?.length || 0} sizes</span></div><span className={`status-chip ${product.in_stock ? "in-stock" : "out-stock"}`}><span />{product.in_stock ? "Available" : "Out of stock"}</span><button className="row-edit-button" onClick={() => setEditor(product)}>Edit</button></div>)}{!recentProducts.length && <div className="overview-empty">{catalogLoading ? "Loading your catalogue…" : "Your catalogue is empty. Add a product or import the current collection."}</div>}</div>
          </section>
          <section className="catalog-card overview-panel attention-panel"><div className="catalog-title"><div><h2>Stock attention</h2><p>Products with every size marked out of stock</p></div><span className="attention-count">{outOfStock.length}</span></div>
            {catalogLoading ? <div className="overview-empty">Checking current stock…</div> : outOfStock.length ? <div className="attention-list">{outOfStock.slice(0, 5).map((product) => <div className="attention-row" key={product.id}><span className="attention-dot" /><div><strong>{product.name}</strong><span>{product.category}</span></div><button onClick={() => setEditor(product)}>Review</button></div>)}</div> : <div className="all-stock-good"><Check size={18} />All products have at least one available size.</div>}
          </section>
        </div>
      </div> : activeSection === "settings" ? <div className="settings-page">
        <div className="page-heading"><div><div className="eyebrow">WORKSPACE PREFERENCES</div><h1>Settings</h1><p>Review your admin access and catalogue connection.</p></div></div>
        <div className="settings-grid"><section className="catalog-card settings-card"><div className="settings-icon"><ShieldCheck size={22} /></div><div><h2>Administrator account</h2><p>This signed-in account can manage the product catalogue.</p></div><div className="settings-detail"><span>Email</span><strong>{session.user.email}</strong></div><div className="settings-detail"><span>Access</span><strong>Administrator</strong></div><button className="secondary-button settings-action" onClick={() => supabase.auth.signOut()}><LogOut size={16} /> Sign out</button></section>
          <section className="catalog-card settings-card"><div className="settings-icon"><Box size={22} /></div><div><h2>Catalogue & image storage</h2><p>Product content and uploaded images are stored in your Supabase project.</p></div><div className="settings-detail"><span>Connection</span><strong className="connected-label"><i className={catalogConnected ? "" : "off"} /> {catalogLoading ? "Checking…" : catalogConnected ? "Connected" : "Connection issue"}</strong></div><div className="settings-detail"><span>Image bucket</span><strong>product-images · up to 8 MB per file</strong></div><div className="settings-detail"><span>Stock management</span><strong>Availability is managed per bottle size</strong></div><button className="secondary-button settings-action" onClick={loadProducts} disabled={catalogLoading}><RefreshCw size={16} /> Refresh connection</button></section></div>
      </div> : <>
      <div className="page-heading"><div><div className="eyebrow">PRODUCT MANAGEMENT</div><h1>Product catalogue</h1><p>Manage fragrances, prices, variants, and stock availability.</p></div><button className="primary-button add-button" onClick={() => setEditor(null)}><PackagePlus size={18} /> Add product</button></div>
        <div className="stat-grid"><article className="stat-card"><div className="stat-top"><span>Total products</span><span className="stat-icon"><Box size={17} /></span></div><strong>{stats.total}</strong><small>In your catalogue</small></article><article className="stat-card"><div className="stat-top"><span>Available</span><span className="stat-icon green"><Check size={17} /></span></div><strong>{stats.active}</strong><small>Marked in stock</small></article><article className="stat-card"><div className="stat-top"><span>Featured</span><span className="stat-icon purple"><Sparkles size={17} /></span></div><strong>{stats.featured}</strong><small>Highlighted products</small></article></div>
        <section className="catalog-card"><div className="catalog-title"><div><h2>All products</h2><p>Your complete fragrance collection</p></div><div className="catalog-actions"><button className="text-button" onClick={loadProducts} disabled={catalogLoading}><RefreshCw size={16} /> Refresh</button><button className="text-button" onClick={importCatalog} disabled={busy}><ArrowDownToLine size={16} /> Import current catalogue</button></div></div>
          <div className="table-tools"><div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" /></div><select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All categories</option>{CATEGORIES.map((c) => <option value={c.id} key={c.id}>{c.label}</option>)}</select></div>
          {problem && <div className="error-banner page-error">{problem}</div>}{notice && <div className="success-banner">{notice}</div>}
          <div className="table-scroll"><table><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STATUS</th><th>FEATURED</th><th /></tr></thead><tbody>
            {filtered.map((p) => <tr key={p.id}><td><div className="product-cell"><div className="product-thumb">{p.image ? <img src={p.image} alt="" /> : <Box size={18} />}</div><div><strong>{p.name}</strong><span>{p.id} · {p.sizes?.length || 0} sizes</span></div></div></td><td><span className="category-chip">{CATEGORIES.find((c) => c.id === p.category)?.label || p.category}</span></td><td className="price-cell">₹{Number(p.price).toLocaleString("en-IN")}</td><td><span className={`status-chip ${p.in_stock ? "in-stock" : "out-stock"}`}><span />{p.in_stock ? "In stock" : "Out of stock"}</span></td><td>{p.featured ? <span className="featured-chip"><Sparkles size={12} /> Featured</span> : <span className="dash">—</span>}</td><td><div className="row-actions"><button onClick={() => setEditor(p)}>Edit</button><button className="delete-action" aria-label={`Delete ${p.name}`} onClick={() => deleteProduct(p)}><Trash2 size={15} /></button></div></td></tr>)}
            {filtered.length === 0 && <tr><td colSpan="6"><div className="empty-state"><div className="empty-icon"><Box /></div><strong>{catalogLoading ? "Loading catalogue…" : products.length ? "No matching products" : "Your catalogue is ready"}</strong><span>{catalogLoading ? "Fetching products from Supabase." : products.length ? "Try changing your search or category filter." : "Import your current catalogue or add your first fragrance."}</span>{!catalogLoading && !products.length && <button className="primary-button" onClick={importCatalog} disabled={busy}><ArrowDownToLine size={16} /> Import current products</button>}</div></td></tr>}
          </tbody></table></div><footer className="table-footer">Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products <span>Changes save directly to your catalogue</span></footer>
        </section><div className="page-footnote"><ShieldCheck size={16} /> Changes are stored securely in your Supabase database.</div>
      </>}
      </section>
      {editor !== undefined && <ProductEditor key={editor?.id || "new"} product={editor} onClose={() => setEditor(undefined)} onSave={saveProduct} onUpload={uploadImages} saving={busy} />}
      {promotionEditor !== undefined && <PromotionEditor key={promotionEditor?.id || "new-promotion"} promotion={promotionEditor} products={products} onClose={() => setPromotionEditor(undefined)} onSave={savePromotion} saving={promotionSaving} />}
    </main>
  </div>;
}
