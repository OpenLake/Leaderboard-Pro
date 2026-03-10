import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StreakProvider } from "./Context/StreakContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StreakProvider>
      <App />
    </StreakProvider>
  </React.StrictMode>,
);

reportWebVitals();
