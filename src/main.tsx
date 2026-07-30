import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//import "./styles/theme-fixes.css";
//import "./styles/light-force.css";
// فقط اگر فایل auth.css وجود داره این خط رو نگه دار
// import "./styles/auth.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
