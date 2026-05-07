"use client";
import { useRouter } from "next/navigation";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import FlowAnimation from "./components/FlowAnimation";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import GetStarted from "./components/GetStarted";
import Footer from "./components/Footer";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="relative overflow-x-hidden font-sans text-slate-950 antialiased selection:bg-cyan-500/25 selection:text-cyan-950 dark:text-white dark:selection:text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#050816]">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `linear-gradient(to right, rgba(14, 165, 233, 0.75) 1px, transparent 1px), linear-gradient(to bottom, rgba(124, 58, 237, 0.65) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-cyan-400/18 blur-[130px] animate-blob dark:bg-cyan-400/14"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-violet-500/14 blur-[130px] animate-blob dark:bg-violet-500/12" style={{ animationDelay: '2s', animationDuration: '22s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-[650px] h-[650px] rounded-full bg-blue-500/12 blur-[130px] animate-blob dark:bg-blue-500/10" style={{ animationDelay: '4s', animationDuration: '25s' }}></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.08) 55%, rgba(5, 8, 22, 0.22) 100%)'
        }}></div>
      </div>

      <div className="relative z-10">
        <Navigation />
        
        <main>
          {/* Hero with Flow Animation */}
          <div className="relative">
          <HeroSection />
          <div className="flex justify-center pb-20">
            <FlowAnimation />
          </div>
        </div>
        
        <GetStarted />
        <HowItWorks />
        <Features />
        
        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none dark:from-cyan-400/8"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Simplify Your AI Infrastructure?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Join developers who are streamlining their AI integrations with TTT Router API. Open source and free to start.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => router.push("/dashboard")}
                className="btn-premium relative w-full overflow-hidden sm:w-auto h-14 px-10 rounded-2xl bg-linear-to-br from-cyan-400 via-blue-500 to-violet-600 text-white text-lg font-bold transition-all shadow-[0_18px_44px_-18px_rgba(37,99,235,0.75)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-22px_rgba(34,211,238,0.85)]"
              >
                Start Free
              </button>
              <button 
                onClick={() => window.open("https://github.com/decolua/ttt-router-api#readme", "_blank")}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl border border-slate-200 bg-white/75 text-slate-900 text-lg font-bold transition-all shadow-soft backdrop-blur hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-400/20 dark:bg-white/5 dark:text-white dark:hover:bg-cyan-400/10"
              >
                Read Documentation
              </button>
            </div>
          </div>
        </section>
        </main>
        
        <Footer />
      </div>
      
      {/* Global styles for keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes blob {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate3d(28px, -36px, 0) scale(1.07) rotate(3deg);
          }
          50% {
            transform: translate3d(-18px, -12px, 0) scale(0.95) rotate(-2deg);
          }
          75% {
            transform: translate3d(20px, 24px, 0) scale(1.03) rotate(2deg);
          }
        }
        .animate-blob {
          animation: blob 20s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

