import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CatalogProvider } from "./context/CatalogContext.jsx";
import { OffersProvider } from "./context/OffersContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <OffersProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </OffersProvider>
      </CatalogProvider>
    </BrowserRouter>
  </StrictMode>
);
