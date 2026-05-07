"use client";

const linkClass = "text-slate-500 hover:text-cyan-600 text-sm transition-colors dark:text-slate-400 dark:hover:text-cyan-300";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/75 pt-16 pb-8 px-6 backdrop-blur dark:border-cyan-400/15 dark:bg-[#050816]/90">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-6 rounded-lg bg-linear-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[16px]">hub</span>
              </div>
              <h3 className="text-slate-950 text-lg font-bold dark:text-white">TTT Router API</h3>
            </div>
            <p className="text-slate-500 text-sm max-w-xs mb-6 dark:text-slate-400">
              The unified endpoint for AI generation. Connect, route, and manage your AI providers with ease.
            </p>
            <div className="flex gap-4">
              <a className="text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300" href="https://github.com/decolua/ttt-router-api" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined">code</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-slate-950 dark:text-white">Product</h4>
            <a className={linkClass} href="#features">Features</a>
            <a className={linkClass} href="/dashboard">Dashboard</a>
            <a className={linkClass} href="https://github.com/decolua/ttt-router-api" target="_blank" rel="noopener noreferrer">Changelog</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-slate-950 dark:text-white">Resources</h4>
            <a className={linkClass} href="https://github.com/decolua/ttt-router-api#readme" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a className={linkClass} href="https://github.com/decolua/ttt-router-api" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className={linkClass} href="https://www.npmjs.com/package/ttt-router-api" target="_blank" rel="noopener noreferrer">NPM</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-slate-950 dark:text-white">Legal</h4>
            <a className={linkClass} href="https://github.com/decolua/ttt-router-api/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 dark:border-cyan-400/15">
          <p className="text-slate-500 text-sm dark:text-slate-500">© 2025 TTT Router API. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-slate-500 hover:text-cyan-600 text-sm transition-colors dark:text-slate-500 dark:hover:text-cyan-300" href="https://github.com/decolua/ttt-router-api" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-slate-500 hover:text-cyan-600 text-sm transition-colors dark:text-slate-500 dark:hover:text-cyan-300" href="https://www.npmjs.com/package/ttt-router-api" target="_blank" rel="noopener noreferrer">NPM</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
