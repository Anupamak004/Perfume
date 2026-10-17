import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSection from "../components/HeroSection";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductGrid from "../components/ProductGrid";
import FilterPanel from "../components/FilterPanel";
import FilterDrawerMobile, { MobileFilterTrigger } from "../components/FilterDrawerMobile";
import useProductFilters from "../hooks/useProductFilters";
import { useCatalog } from "../context/CatalogContext";
import { SITE_CONFIG } from "../data/siteConfig";

export default function Collections() {
  const { products } = useCatalog();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? 14 : 15);
  const filterState = useProductFilters(products);
  const { filtered, activeFilterCount } = filterState;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const pageProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 767px)");
    const updatePageSize = () => setPageSize(breakpoint.matches ? 14 : 15);
    breakpoint.addEventListener("change", updatePageSize);
    return () => breakpoint.removeEventListener("change", updatePageSize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtered]);

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(Math.max(1, pageCount));
  }, [currentPage, pageCount]);

  return (
    <>
      <title>{`All Fragrances & Decants | ${SITE_CONFIG.brandName}`}</title>
      <meta
        name="description"
        content={`Explore ${SITE_CONFIG.brandName}'s complete collection of premium fragrances, decants, and rare ouds.`}
      />

      <HeroSection
        image="/images/collection-main1.webp"
        imagePosition="center 65%"
        noOverlay
        compactTitle
        bottomLeftShade
        title="OUR COLLECTION"
        subtitle="Explore our complete range of premium fragrances crafted for every mood and occasion."
        breadcrumb={<Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Collections" }]} />}
      />

      <section className="bg-cream py-14 sm:py-20">
        <div className="container-px mx-auto max-w-content">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <p className="text-sm text-ink">{filtered.length} fragrances</p>
            <MobileFilterTrigger onClick={() => setMobileFiltersOpen(true)} activeFilterCount={activeFilterCount} light />
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-x-14 lg:gap-y-4">
            <div className="hidden px-2 pt-2 lg:col-start-2 lg:row-start-1 lg:block sm:px-6">
              <h2 className="font-display text-2xl text-ink font-bold">All Fragrances <span className="font-sans text-sm font-normal text-ink/50">({filtered.length})</span></h2>
            </div>
            <aside className="hidden bg-cream lg:col-start-1 lg:row-start-2 lg:block">
              <div className="sticky top-28 bg-cream p-6 sm:p-8">
                <FilterPanel {...filterState} resultCount={filtered.length} light />
              </div>
            </aside>

            <div className="bg-white p-2 sm:p-6 lg:col-start-2 lg:row-start-2">
              <ProductGrid products={pageProducts} columns="grid-cols-2 md:grid-cols-3 xl:grid-cols-3" light />
              {pageCount > 1 && (
                <nav aria-label="Collection pages" className="mt-8 flex items-center justify-center gap-2 border-t border-ink/10 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-9 w-9 items-center justify-center border border-ink/15 text-ink transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-35"
                  ><ChevronLeft size={16} /></button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      aria-label={`Page ${page}`}
                      className={`h-9 min-w-9 border px-2 text-xs transition-colors ${currentPage === page ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink hover:border-gold"}`}
                    >{page}</button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                    disabled={currentPage === pageCount}
                    aria-label="Next page"
                    className="flex h-9 w-9 items-center justify-center border border-ink/15 text-ink transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-35"
                  ><ChevronRight size={16} /></button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>

      <FilterDrawerMobile open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} {...filterState} resultCount={filtered.length} />
    </>
  );
}
