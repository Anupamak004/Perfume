import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProductGrid({ products, columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4", light = false, darkCards = false }) {
  if (!products.length) {
    return (
      <div className={`border py-20 text-center ${light ? "border-ink/10" : "border-cream/10"}`}>
        <p className={`font-display text-2xl ${light ? "text-ink/60" : "text-cream/60"}`}>No fragrances match your filters.</p>
        <p className={`mt-2 text-sm ${light ? "text-ink/40" : "text-cream/40"}`}>Try adjusting or clearing your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={products.map((product) => product.id).join("|")}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`grid min-w-0 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 ${columns}`}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} light={light} darkSurface={darkCards} />
        </motion.div>
      ))}
    </motion.div>
  );
}
