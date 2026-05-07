"use client";

export default function Tooltip({ text, children, position = "top" }) {
  const posClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  }[position];

  return (
    <div className="relative inline-flex group">
      {children}
      <div className={`pointer-events-none absolute ${posClass} z-50 w-max max-w-56 rounded-xl border border-cyan-400/15 bg-slate-950/92 px-2.5 py-1.5 text-[11px] leading-snug text-slate-100 opacity-0 shadow-[0_12px_32px_-18px_rgba(34,211,238,0.7)] backdrop-blur-xl transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 whitespace-normal`}>
        {text}
      </div>
    </div>
  );
}
