import Button from "../components/Button";
import { SITE_CONFIG } from "../data/siteConfig";

export default function NotFound() {
  return (
    <>
      <title>{`Page Not Found | ${SITE_CONFIG.brandName}`}</title>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="font-display text-7xl text-gold">404</span>
        <h1 className="mt-4 font-display text-3xl text-cream">This scent has drifted away.</h1>
        <p className="mt-3 max-w-sm text-sm text-cream/60">
          The page you're looking for doesn't exist. Let's get you back to something beautiful.
        </p>
        <Button to="/" variant="primary" className="mt-8">
          Back to Home
        </Button>
      </div>
    </>
  );
}
