"use client";

export default function AnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#050816]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14, 165, 233, 0.75) 1px, transparent 1px), linear-gradient(to bottom, rgba(124, 58, 237, 0.65) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="absolute -top-20 left-1/4 w-[600px] h-[600px] bg-cyan-400/18 rounded-full blur-[120px] animate-blob dark:bg-cyan-400/14" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-violet-500/14 rounded-full blur-[120px] animate-blob-delayed-1 dark:bg-violet-500/12" />
        <div className="absolute -bottom-20 left-1/2 w-[550px] h-[550px] bg-blue-500/12 rounded-full blur-[120px] animate-blob-delayed-2 dark:bg-blue-500/10" />

        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.08) 55%, rgba(5, 8, 22, 0.22) 100%)",
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate3d(26px, -34px, 0) scale(1.07) rotate(3deg);
          }
          50% {
            transform: translate3d(-16px, -14px, 0) scale(0.95) rotate(-2deg);
          }
          75% {
            transform: translate3d(18px, 24px, 0) scale(1.03) rotate(2deg);
          }
        }
        .animate-blob {
          animation: blob 18s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          will-change: transform;
        }
        .animate-blob-delayed-1 {
          animation: blob 22s cubic-bezier(0.22, 1, 0.36, 1) 1.5s infinite;
          will-change: transform;
        }
        .animate-blob-delayed-2 {
          animation: blob 26s cubic-bezier(0.22, 1, 0.36, 1) 3s infinite;
          will-change: transform;
        }
      `}</style>
    </>
  );
}
