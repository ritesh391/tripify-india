import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; resolved: Resolved; setTheme: (t: Theme) => void }>({
  theme: "system", resolved: "dark", setTheme: () => {},
});

const KEY = "tripify-theme";

function apply(resolved: Resolved) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<Resolved>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem(KEY) as Theme)) || "system";
    setThemeState(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const compute = (): Resolved => theme === "system" ? (mql.matches ? "dark" : "light") : theme;
    const update = () => { const r = compute(); setResolved(r); apply(r); };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem(KEY, t); } catch {}
  };

  return <ThemeCtx.Provider value={{ theme, resolved, setTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

// Inline script to prevent theme flash on first paint
export const themeBootScript = `
(function(){try{
  var t = localStorage.getItem('${KEY}') || 'system';
  var d = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var r = document.documentElement;
  r.classList.toggle('dark', d);
  r.style.colorScheme = d ? 'dark' : 'light';
}catch(e){}})();
`;