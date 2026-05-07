"use client";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";

export default function GetStarted() {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = (text) => {
    copy(text, "landing");
  };

  return (
    <section className="py-24 px-6 bg-white/55 backdrop-blur dark:bg-[#070b14]/80">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1">
            <div className="hero-kicker mb-4">&gt; Quick Start</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Started in 30 Seconds</h2>
            <p className="text-slate-600 text-lg mb-8 dark:text-slate-300">
              Install TTT Router API, configure your providers via web dashboard, and start routing AI requests.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-cyan-500/12 text-cyan-600 flex items-center justify-center font-bold dark:text-cyan-300">1</div>
                <div>
                  <h4 className="font-bold text-lg">Install TTT Router API</h4>
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Run npx command to start the server instantly</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-blue-500/12 text-blue-600 flex items-center justify-center font-bold dark:text-blue-300">2</div>
                <div>
                  <h4 className="font-bold text-lg">Open Dashboard</h4>
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Configure providers and API keys via web interface</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-violet-500/12 text-violet-600 flex items-center justify-center font-bold dark:text-violet-300">3</div>
                <div>
                  <h4 className="font-bold text-lg">Route Requests</h4>
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Point your CLI tools to http://localhost:20128</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="terminal-card overflow-hidden rounded-3xl">
              <div className="flex items-center gap-2 border-b border-cyan-400/15 bg-white/5 px-4 py-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-gray-500 font-mono">terminal</div>
              </div>

              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                <div
                  className="flex items-center gap-2 mb-4 group cursor-pointer"
                  onClick={() => handleCopy("npx ttt_router")}
                >
                  <span className="text-green-400">$</span>
                  <span className="text-white">npx ttt_router</span>
                  <span className="ml-auto text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied === "landing" ? "Copied" : "Copy"}
                  </span>
                </div>

                <div className="text-gray-400 mb-6">
                  <span className="text-cyan-300">&gt;</span> Starting TTT Router API...<br/>
                  <span className="text-cyan-300">&gt;</span> Server running on <span className="text-blue-300">http://localhost:20128</span><br/>
                  <span className="text-cyan-300">&gt;</span> Dashboard: <span className="text-blue-300">http://localhost:20128/dashboard</span><br/>
                  <span className="text-green-400">&gt;</span> Ready to route!
                </div>

                <div className="text-xs text-gray-500 mb-2 border-t border-gray-700 pt-4">
                  Configure providers in dashboard or use environment variables
                </div>

                <div className="text-gray-400 text-xs">
                  <span className="text-purple-400">Data Location:</span><br/>
                  <span className="text-gray-500">  macOS/Linux:</span> ~/.ttt_router/db.json<br/>
                  <span className="text-gray-500">  Windows:</span> %APPDATA%/ttt_router/db.json
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
