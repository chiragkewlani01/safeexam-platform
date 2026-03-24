"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#2563EB" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#2563EB" /><path stroke="#2563EB" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
      )}
    </button>
  );
}
