import { useEffect, useState } from "react";

/**
 * Returns true once the page has scrolled past `threshold` px.
 * Used by the Navbar to switch from a transparent hero overlay
 * to a solid/blurred background.
 */
export default function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(typeof window !== "undefined" ? window.scrollY > threshold : false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
