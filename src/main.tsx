import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css"
import "./index.css";
import "./carousel.css"
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
   
  </StrictMode>,
);
