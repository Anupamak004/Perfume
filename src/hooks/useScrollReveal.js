import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-reveal hook: returns a ref + boolean that flips to
 * true once the element enters the viewport. Pairs with the `fadeUp`
 * Tailwind animation utility. Respects prefers-reduced-motion by revealing
 * immediately.
 */
export default function useScrollReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
}
