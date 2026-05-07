"use client";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-cyan-400/14 blur-[120px] pointer-events-none dark:bg-cyan-400/10"></div>
      
      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-8">
        {/* Version badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-cyan-700 shadow-soft backdrop-blur dark:text-cyan-300">
          <span className="live-dot"></span>
          v1.0 is now live
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
          One Endpoint for <br/>
          <span className="gradient-text">All AI Providers</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light dark:text-slate-300">
          AI endpoint proxy with web dashboard - A JavaScript port of CLIProxyAPI. Works seamlessly with Claude Code, OpenAI Codex, Cline, RooCode, and other CLI tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <button className="btn-premium relative flex h-12 items-center gap-2 overflow-hidden rounded-2xl bg-linear-to-br from-cyan-400 via-blue-500 to-violet-600 px-8 text-base font-bold text-white shadow-[0_18px_44px_-18px_rgba(37,99,235,0.75)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-22px_rgba(34,211,238,0.85)]">
            <span className="material-symbols-outlined">rocket_launch</span>
            Get Started
          </button>
          <a 
            href="https://github.com/decolua/ttt-router-api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white/75 px-8 text-base font-bold text-slate-900 shadow-soft backdrop-blur transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-400/20 dark:bg-white/5 dark:text-white dark:hover:bg-cyan-400/10"
          >
            <span className="material-symbols-outlined">code</span>
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

