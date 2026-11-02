# Perfume Store — Website

A premium fragrance and decant boutique website for **Perfume Store** — built with React, Vite, Tailwind CSS, React Router, Lucide icons and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
├── components/     Reusable UI (Navbar, Footer, ProductCard, CategoryCard, HeroSection, filters, cart drawer, etc.)
├── pages/          One file per route (Home, Collections, ProductDetail, About, Contact, FragranceFinder, NotFound)
├── data/
│   ├── siteConfig.js Central business configuration (phone, WhatsApp, Instagram, Google Maps, address)
│   ├── products.js   Product catalogue & decants system
│   └── store.js      Store hours & review summaries
├── context/        Cart + Wishlist state (persisted to localStorage)
├── hooks/          Small reusable hooks (scroll state, filters, scroll-reveal)
└── utils/          Formatting helpers
```

## Business Configuration

All client contact details are centrally managed in `src/data/siteConfig.js`:
- **Brand**: Perfume Store
- **Phone / WhatsApp**: `9999999999`
- **Address**: ABC Building, Main Street, Your City, India
- **Instagram**: `https://www.instagram.com/`
- **Google Maps**: Generic placeholder search for ABC Building

## Features

- **WhatsApp Ordering**: Direct WhatsApp order integration on both Product Detail pages and the Shopping Bag with itemized breakdown and size/decant specs.
- **Decants & Sizes**: Support for multiple bottle and decant sizes (5ml, 10ml, 50ml, 100ml) with dynamic pricing.
- **Fragrance Finder**: Interactive multi-step questionnaire recommending optimal fragrance matches based on user preferences.
- **Filtering & Search**: Dynamic filtering across category, fragrance families, price bands, and instant keyword search.
- **Fully Responsive**: Fluid typography and responsive layout tested across 320px mobile through 2560px+ ultrawide viewports.
