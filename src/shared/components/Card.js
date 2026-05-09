"use client";

import { cn } from "@/shared/utils/cn";

export default function Card({
  children,
  title,
  subtitle,
  icon,
  action,
  padding = "md",
  hover = false,
  elev = false,
  className,
  ...props
}) {
  const paddings = {
    none: "",
    xs: "p-3",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "dashboard-panel group/card",
        elev ? "rounded-lg shadow-[var(--shadow-soft)]" : "rounded-lg shadow-[var(--shadow-soft)]",
        hover && "hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[var(--shadow-glow)] transition-all duration-200 cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-text-muted shadow-[var(--shadow-soft)] transition group-hover/card:-translate-y-0.5 group-hover/card:border-brand-500/25 group-hover/card:text-primary">
                <span className="material-symbols-outlined text-[20px] transition group-hover/card:scale-110">{icon}</span>
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-[15px] font-semibold tracking-tight text-text-main sm:text-base">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>
              )}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

Card.Section = function CardSection({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-2 p-4",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Row = function CardRow({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "-mx-3 border-b border-border-subtle px-3 py-3 transition-colors last:border-b-0",
        "hover:bg-black/[0.025] dark:hover:bg-white/[0.03]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.ListItem = function CardListItem({
  children,
  actions,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "group -mx-3 flex items-center justify-between border-b border-border-subtle px-3 py-3 last:border-b-0",
        "hover:bg-black/[0.025] transition-colors dark:hover:bg-white/[0.03]",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {actions && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {actions}
        </div>
      )}
    </div>
  );
};
