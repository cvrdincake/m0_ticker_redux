// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Design tokens MUST load before any component CSS
import "@/design-system/tokens/accent.css";
import "@/design-system/motion/tokens.css"; // if you split motion tokens

// Global resets/utilities if you keep them separate
// import "@/design-system/base.css";

import { AccentProvider } from "@/app/AccentProvider";

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AccentProvider>
      <App />
    </AccentProvider>
  </React.StrictMode>
);
