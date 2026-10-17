"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Default to dark theme as requested
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add("light");
      localStorage.setItem("portfolio-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("portfolio-theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#A0A3B8] hover:text-[#F5F5FA] hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50"
    >
      {isDark ? <Sun className="w-4 h-4 text-[#38BDF8]" /> : <Moon className="w-4 h-4 text-[#6C63FF]" />}
    </button>
  );
}
