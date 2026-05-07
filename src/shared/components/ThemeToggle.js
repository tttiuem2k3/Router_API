"use client";

import { useTheme } from "@/shared/hooks/useTheme";
import { cn } from "@/shared/utils/cn";

export default function ThemeToggle({ className, variant = "default" }) {
  const { isDark, toggleTheme } = useTheme();

  const variants = {
    default: cn(
      "gradient-ring flex items-center justify-center size-10 rounded-full",
      "border border-border bg-surface/70 text-text-muted shadow-[var(--shadow-soft)] backdrop-blur-xl",
      "hover:-translate-y-px hover:text-primary hover:shadow-[var(--shadow-warm)] transition-all"
    ),
    card: cn(
      "flex items-center justify-center size-11 rounded-full",
      "bg-surface/60 hover:bg-surface",
      "border border-border",
      "backdrop-blur-md shadow-sm hover:shadow-[var(--shadow-warm)]",
      "text-text-muted hover:text-brand-500",
      "transition-all group"
    ),
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(variants[variant], className)}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        className={cn(
        "material-symbols-outlined text-[22px] transition-transform duration-300 hover:rotate-12",
        variant === "card" && "group-hover:rotate-12"
        )}
      >
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
