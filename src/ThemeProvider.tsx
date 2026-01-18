import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  // load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("site_theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-bs-theme", isDark ? "dark" : "light");
  }, []);

  // apply + save
  useEffect(() => {
    localStorage.setItem("site_theme", dark ? "dark" : "light");
    document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <>
      {/* زرار عام للموقع كله (اختياري) */}
      <button
        onClick={() => setDark((v) => !v)}
        className="btn primarycolorbg2 border-0 shadow"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 9999,
          borderRadius: 12,
          padding: "8px 12px",
        }}
        title="Toggle theme"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {children}
    </>
  );
}