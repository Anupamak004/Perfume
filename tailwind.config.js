/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0907",
        espresso: "#1B120D",
        gold: {
          DEFAULT: "#C9A45C",
          muted: "#9D7B3F",
          light: "#E4C88A",
        },
        cream: "#F4EBDD",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"Jost"', "sans-serif"],
      },
      letterSpacing: {
        wide2: "0.14em",
        wide3: "0.28em",
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, transparent, #C9A45C, transparent)",
        "fade-ink": "linear-gradient(180deg, rgba(11,9,7,0) 0%, rgba(11,9,7,0.7) 60%, rgba(11,9,7,1) 100%)",
        "fade-ink-top": "linear-gradient(0deg, rgba(11,9,7,0) 0%, rgba(11,9,7,0.85) 100%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(28px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        scaleSlow: {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) forwards",
        fadeIn: "fadeIn 1.2s ease forwards",
        scaleSlow: "scaleSlow 6s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};
