"use client";

import { cn } from "@/shared/utils/cn";

const variants = {
  primary: "bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-warm)] hover:-translate-y-px hover:brightness-[1.05] hover:shadow-[var(--shadow-glow)] disabled:bg-surface-3 disabled:text-text-muted",
  secondary: "border border-border bg-white/82 text-text-main shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_28px_-24px_rgba(15,23,42,0.3)] hover:-translate-y-px hover:bg-white hover:border-brand-500/25 dark:bg-white/[0.055] dark:hover:bg-white/[0.09]",
  outline: "border border-border bg-transparent text-text-main hover:-translate-y-px hover:bg-brand-500/8 hover:border-brand-500/35 dark:hover:bg-cyan-400/8",
  ghost: "text-text-muted hover:-translate-y-px hover:bg-brand-500/8 hover:text-text-main dark:hover:bg-white/[0.05]",
  danger: "bg-gradient-to-b from-red-400 to-red-600 text-white shadow-[0_10px_24px_-12px_rgba(239,68,68,0.75)] hover:brightness-[1.03] disabled:bg-surface-3 disabled:text-text-muted",
  success: "bg-gradient-to-b from-green-500 to-green-700 text-white shadow-[0_10px_24px_-12px_rgba(34,197,94,0.8)] hover:brightness-[1.03] disabled:bg-surface-3 disabled:text-text-muted",
};

const sizes = {
  sm: "h-8 px-3 text-xs rounded-[10px]",
  md: "h-10 px-4 text-sm rounded-[10px]",
  lg: "h-11 px-6 text-sm rounded-[12px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "btn-premium group/btn relative isolate overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 ease-out cursor-pointer",
        "active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px] transition group-hover/btn:scale-110">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
      {iconRight && !loading && (
        <span className="material-symbols-outlined text-[18px] transition group-hover/btn:translate-x-0.5">{iconRight}</span>
      )}
    </button>
  );
}
