"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import Sidebar from "../Sidebar";
import Header from "../Header";

function getToastStyle(type) {
  if (type === "success") {
    return {
      wrapper: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
      icon: "check_circle",
    };
  }
  if (type === "error") {
    return {
      wrapper: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
      icon: "error",
    };
  }
  if (type === "warning") {
    return {
      wrapper: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      icon: "warning",
    };
  }
  return {
    wrapper: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: "info",
  };
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  useEffect(() => {
    const updateSpotlight = (event) => {
      document.documentElement.style.setProperty("--spot-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--spot-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", updateSpotlight, { passive: true });
    return () => window.removeEventListener("pointermove", updateSpotlight);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-text-main">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="dashboard-ambient absolute inset-0 opacity-95" />
        <div className="aurora-blob absolute left-[-8rem] top-[-5rem] h-[26rem] w-[26rem] rounded-full bg-brand-500/14 blur-3xl" />
        <div className="aurora-blob absolute right-[-7rem] top-12 h-[28rem] w-[28rem] rounded-full bg-[color:var(--color-accent-cyan)]/14 blur-3xl" />
        <div className="aurora-blob absolute bottom-[-10rem] left-1/3 h-[22rem] w-[22rem] rounded-full bg-[color:var(--color-accent-violet)]/14 blur-3xl" />
        <div className="cursor-spotlight absolute inset-0" />
        <div className="scanline-overlay absolute inset-0" />
        <div className="grain-overlay absolute inset-0" />
      </div>
      <div className="fixed top-4 right-4 z-[80] flex w-[min(92vw,380px)] flex-col gap-2">
        {notifications.map((n) => {
          const style = getToastStyle(n.type);
          return (
            <div
              key={n.id}
              className={`toast-enter rounded-[14px] border px-3 py-2 shadow-[var(--shadow-elevated)] backdrop-blur-xl ${style.wrapper}`}
            >
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] leading-5">{style.icon}</span>
                <div className="min-w-0 flex-1">
                  {n.title ? <p className="text-xs font-semibold mb-0.5">{n.title}</p> : null}
                  <p className="text-xs whitespace-pre-wrap break-words">{n.message}</p>
                </div>
                {n.dismissible ? (
                  <button
                    type="button"
                    onClick={() => removeNotification(n.id)}
                    className="text-current/70 hover:text-current"
                    aria-label="Dismiss notification"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[3px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="relative isolate flex h-full min-w-0 flex-1 flex-col transition-colors duration-300">
        <div className="landing-grid absolute inset-0 pointer-events-none -z-10 opacity-[0.055] dark:opacity-[0.035]" aria-hidden="true" />
        <Header key={pathname} onMenuClick={() => setSidebarOpen(true)} />
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${pathname === "/dashboard/basic-chat" ? "" : "px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6"} ${pathname === "/dashboard/basic-chat" ? "flex flex-col overflow-hidden" : ""}`}>
          <div className={`${pathname === "/dashboard/basic-chat" ? "flex h-full w-full flex-1 flex-col page-rise" : "dashboard-page page-rise mx-auto w-full max-w-[1380px]"}`}>{children}</div>
        </div>
      </main>
    </div>
  );
}
