import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./AdminApp.jsx";
import "./admin.css";
import "./admin-overrides.css";

createRoot(document.getElementById("admin-root")).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
