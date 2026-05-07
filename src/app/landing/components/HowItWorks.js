"use client";

export default function HowItWorks() {
  return (
    <section className="py-24 border-y border-slate-200/80 bg-white/40 backdrop-blur dark:border-cyan-400/15 dark:bg-white/[0.03]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="hero-kicker mb-4">&gt; Flow</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How TTT Router API Works</h2>
          <p className="text-slate-600 max-w-xl text-lg dark:text-slate-300">
            Data flows seamlessly from your application through our intelligent routing layer to the best provider for the job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-linear-to-r from-transparent via-cyan-400/70 to-transparent -z-10"></div>

          <div className="flex flex-col gap-6 relative group">
            <div className="glass-card w-24 h-24 rounded-3xl flex items-center justify-center shadow-soft transition-all z-10 mx-auto md:mx-0 group-hover:-translate-y-1 group-hover:border-cyan-400/50">
              <span className="material-symbols-outlined text-4xl text-slate-600 dark:text-slate-300">terminal</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">1. CLI &amp; SDKs</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your requests start from your favorite tools or our unified SDK. Just change the base URL.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 relative group md:items-center md:text-center">
            <div className="glass-card w-24 h-24 rounded-3xl border-2 border-cyan-400/45 flex items-center justify-center shadow-glow transition-all z-10 mx-auto group-hover:-translate-y-1">
              <span className="material-symbols-outlined text-4xl text-cyan-400 animate-pulse">hub</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 gradient-text">2. TTT Router API Hub</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Our engine analyzes the prompt, checks provider health, and routes for lowest latency or cost.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 relative group md:items-end md:text-right">
            <div className="glass-card w-24 h-24 rounded-3xl flex items-center justify-center shadow-soft transition-all z-10 mx-auto md:mx-0 group-hover:-translate-y-1 group-hover:border-violet-400/50">
              <div className="grid grid-cols-2 gap-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-400/20"></div>
                <div className="w-6 h-6 rounded-lg bg-blue-500/20"></div>
                <div className="w-6 h-6 rounded-lg bg-violet-500/20"></div>
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">3. AI Providers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The request is fulfilled by OpenAI, Anthropic, Gemini, or others instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
