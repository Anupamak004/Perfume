import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
const Home = lazy(() => import("./pages/Home"));
const Collections = lazy(() => import("./pages/Collections"));
const CollectionCategory = lazy(() => import("./pages/CollectionCategory"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const FragranceFinder = lazy(() => import("./pages/FragranceFinder"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

function RouteBoundary({ children }) {
  return <Suspense fallback={<div className="container-px mx-auto flex min-h-[55vh] max-w-content items-center justify-center py-24 text-sm text-cream/55" role="status">Loading page…</div>}>{children}</Suspense>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RouteBoundary><Home /></RouteBoundary>} />
        <Route path="/collections" element={<RouteBoundary><Collections /></RouteBoundary>} />
        <Route path="/collections/:category" element={<RouteBoundary><CollectionCategory /></RouteBoundary>} />
        <Route path="/product/:id" element={<RouteBoundary><ProductDetail /></RouteBoundary>} />
        <Route path="/about" element={<RouteBoundary><About /></RouteBoundary>} />
        <Route path="/fragrance-finder" element={<RouteBoundary><FragranceFinder /></RouteBoundary>} />
        <Route path="/contact" element={<RouteBoundary><Contact /></RouteBoundary>} />
        <Route path="/wishlist" element={<RouteBoundary><Wishlist /></RouteBoundary>} />
        <Route path="*" element={<RouteBoundary><NotFound /></RouteBoundary>} />
      </Route>
    </Routes>
  );
}
