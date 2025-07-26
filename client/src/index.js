import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ Import ThemeProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // ✅ Import your global styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider> {/* ✅ Wrap App in ThemeProvider */}
          <App />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);


