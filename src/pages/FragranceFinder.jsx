import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import { useCatalog } from "../context/CatalogContext";
import { SITE_CONFIG } from "../data/siteConfig";

const STEPS = [
  {
    key: "mood",
    question: "What kind of fragrance are you looking for?",
    options: ["Fresh", "Sweet", "Woody", "Floral", "Fruity", "Oud", "Musky"],
  },
  {
    key: "occasion",
    question: "When will you wear it?",
    options: ["Everyday", "Office", "Date Night", "Wedding", "Special Occasion"],
  },
  {
    key: "style",
    question: "What is your style?",
    options: ["Elegant", "Bold", "Fresh", "Mysterious", "Romantic", "Traditional"],
  },
];

function scoreProduct(product, answers) {
  let score = 0;
  if (answers.mood && product.moods.includes(answers.mood)) score += 3;
  if (answers.occasion && product.occasion.includes(answers.occasion)) score += 2;
  if (answers.style && product.style.includes(answers.style)) score += 2;
  return score;
}

export default function FragranceFinder() {
  const { products } = useCatalog();
  const [searchParams] = useSearchParams();
  const prefillMood = searchParams.get("mood");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(prefillMood ? { mood: prefillMood } : {});
  const [showResult, setShowResult] = useState(false);

  const step = STEPS[stepIndex];

  const match = useMemo(() => {
    if (!showResult) return null;
    const scored = products.map((p) => ({ product: p, score: scoreProduct(p, answers) }));
    scored.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);
    return scored[0]?.product || products[0];
  }, [showResult, answers, products]);

  const selectOption = (key, value) => {
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    if (stepIndex < STEPS.length - 1) {
      setTimeout(() => setStepIndex((i) => i + 1), 260);
    } else {
      setTimeout(() => setShowResult(true), 260);
    }
  };

  const restart = () => {
    setAnswers({});
    setStepIndex(0);
    setShowResult(false);
  };

  const popularPicks = products.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <title>{`Fragrance Finder | ${SITE_CONFIG.brandName}`}</title>
      <meta
        name="description"
        content={`Answer a few simple questions and ${SITE_CONFIG.brandName} will help you discover your perfect fragrance match.`}
      />

      <div className="container-px mx-auto max-w-content pt-28 sm:pt-32">
        <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Fragrance Finder" }]} />
      </div>

      <section className="pb-20 sm:pb-28">
        <div className="container-px mx-auto max-w-content">
          <SectionHeading eyebrow="Guided Discovery" title="Fragrance Finder" subtitle="Answer a few simple questions and we'll help find your perfect fragrance." />

          <div className="mx-auto mt-14 max-w-2xl">
            {!showResult ? (
              <>
                <div className="mb-10 flex items-center justify-center gap-2" aria-hidden="true">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.key}
                      className={`h-1 w-14 rounded-full transition-colors duration-500 ${
                        i <= stepIndex ? "bg-gold" : "bg-cream/15"
                      }`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                  >
                    <p className="text-[11px] uppercase tracking-wide2 text-gold">
                      Step {stepIndex + 1} of {STEPS.length}
                    </p>
                    <h3 className="mt-3 font-display text-2xl text-cream sm:text-3xl">{step.question}</h3>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      {step.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => selectOption(step.key, opt)}
                          aria-pressed={answers[step.key] === opt}
                          className={`border px-6 py-3.5 text-xs uppercase tracking-wide2 transition-colors ${
                            answers[step.key] === opt
                              ? "border-gold bg-gold text-ink"
                              : "border-cream/20 text-cream/75 hover:border-gold hover:text-gold"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {stepIndex > 0 && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={() => setStepIndex((i) => i - 1)}
                      className="text-xs uppercase tracking-wide2 text-cream/50 hover:text-gold"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <Sparkles className="mx-auto text-gold" size={28} />
                <p className="mt-4 text-xs uppercase tracking-wide3 text-gold">Your Fragrance Match</p>
                <div className="mx-auto mt-8 max-w-xs">
                  <ProductCard product={match} />
                </div>
                <p className="mx-auto mt-8 max-w-md text-sm text-cream/65">
                  We think this fragrance matches your preferences.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Button to={`/product/${match.id}`} variant="primary">
                    View Fragrance
                  </Button>
                  <Button onClick={restart} variant="ghost">
                    Start Over
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-cream/5 bg-espresso/20 py-16 sm:py-20">
        <div className="container-px mx-auto max-w-content">
          <SectionHeading align="left" eyebrow="In the Meantime" title="Popular Recommendations" className="items-start text-left" />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {popularPicks.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
