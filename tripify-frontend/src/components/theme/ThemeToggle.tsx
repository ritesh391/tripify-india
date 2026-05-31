import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, resolved, setTheme } = useTheme();
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "system" ? Monitor : resolved === "dark" ? Moon : Sun;
  const label = theme === "system" ? "System" : resolved === "dark" ? "Dark" : "Light";
  return (
    <button
      onClick={() => setTheme(next)}
      title={`Theme: ${label} · click for ${next}`}
      className="relative h-10 w-10 rounded-lg border border-border/60 flex items-center justify-center hover:bg-secondary/60 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={{ y: 12, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}