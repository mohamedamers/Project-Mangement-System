import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "./Context/AuthContext";
import ModeProvider from "./Context/ModeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModeProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ModeProvider>
    <ToastContainer />
  </StrictMode>
);
