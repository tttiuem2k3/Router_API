"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/78 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-cyan-400/15 dark:bg-[#050816]/78">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
          onClick={() => router.push("/")}
          aria-label="Navigate to home"
        >
          <div className="brand-orb size-8 rounded-xl bg-linear-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-white shadow-glow">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">TTT Router API</h2>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="#features">Features</a>
          <a className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="#how-it-works">How it Works</a>
          <a className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="https://github.com/decolua/ttt-router-api#readme" target="_blank" rel="noopener noreferrer">Docs</a>
          <a className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="https://github.com/decolua/ttt-router-api" target="_blank" rel="noopener noreferrer">
            GitHub <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>

        {/* CTA + Mobile menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
            className="btn-premium relative hidden h-9 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-cyan-400 via-blue-500 to-violet-600 px-4 text-sm font-bold text-white shadow-[0_12px_28px_-14px_rgba(37,99,235,0.9)] transition-all hover:-translate-y-0.5"
          >
            Get Started
          </button>
          <button 
            className="md:hidden text-slate-900 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="menu-pop md:hidden border-t border-slate-200 bg-white/95 shadow-soft backdrop-blur-xl dark:border-cyan-400/15 dark:bg-[#050816]/95">
          <div className="flex flex-col gap-4 p-6">
            <a className="text-sm font-medium text-slate-700 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a className="text-sm font-medium text-slate-700 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a className="text-sm font-medium text-slate-700 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="https://github.com/decolua/ttt-router-api#readme" target="_blank" rel="noopener noreferrer">Docs</a>
            <a className="text-sm font-medium text-slate-700 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300" href="https://github.com/decolua/ttt-router-api" target="_blank" rel="noopener noreferrer">GitHub</a>
            <button 
              onClick={() => router.push("/dashboard")}
              className="h-9 rounded-full bg-linear-to-br from-cyan-400 via-blue-500 to-violet-600 text-sm font-bold text-white"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

