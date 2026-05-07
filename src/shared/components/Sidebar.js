"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { APP_CONFIG, UPDATER_CONFIG } from "@/shared/constants/config";
import { MEDIA_PROVIDER_KINDS } from "@/shared/constants/providers";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import Button from "./Button";
import { ConfirmModal } from "./Modal";

const VISIBLE_MEDIA_KINDS = ["embedding", "image", "tts", "stt"];
const COMBINED_WEB_ITEM = { id: "web", label: "Web Fetch & Search", icon: "travel_explore", href: "/dashboard/media-providers/web" };

const navItems = [
  { href: "/dashboard/endpoint", label: "Endpoint", icon: "api" },
  { href: "/dashboard/providers", label: "Providers", icon: "dns" },
  { href: "/dashboard/combos", label: "Combos", icon: "layers" },
  { href: "/dashboard/usage", label: "Usage", icon: "bar_chart" },
  { href: "/dashboard/quota", label: "Quota Tracker", icon: "data_usage" },
  { href: "/dashboard/mitm", label: "MITM", icon: "security" },
  { href: "/dashboard/cli-tools", label: "CLI Tools", icon: "terminal" },
];

const debugItems = [
  { href: "/dashboard/console-log", label: "Console Log", icon: "terminal" },
  { href: "/dashboard/translator", label: "Translator", icon: "translate" },
];

const systemItems = [
  { href: "/dashboard/proxy-pools", label: "Proxy Pools", icon: "lan" },
  { href: "/dashboard/skills", label: "Skills", icon: "extension" },
];

function NavLink({ href, label, icon, active, onClick, compact = false }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "nav-link-pro group relative flex items-center gap-3 rounded-[14px] transition-all",
        compact ? "px-4 py-2" : "px-3 py-2.5",
        active
          ? "bg-gradient-to-r from-brand-500/18 via-brand-500/10 to-transparent text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
          : "text-text-muted hover:bg-white/50 hover:text-text-main dark:hover:bg-white/[0.04]"
      )}
    >
      {active && (
        <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-brand-500" />
      )}
      <span
        className={cn(
          "material-symbols-outlined text-[18px] transition-colors",
          active ? "fill-1 text-primary" : "group-hover:text-primary"
        )}
      >
        {icon}
      </span>
      <span className={cn("font-medium tracking-tight", compact ? "text-sm" : "text-[13px]")}>{label}</span>
    </Link>
  );
}

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  compact: PropTypes.bool,
};

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [enableTranslator, setEnableTranslator] = useState(false);
  const { copied, copy } = useCopyToClipboard(2000);

  const INSTALL_CMD = UPDATER_CONFIG.installCmd;
  const STATUS_URL = `http://localhost:${UPDATER_CONFIG.statusPort}/update/status`;

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.enableTranslator) setEnableTranslator(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/version")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasUpdate) setUpdateInfo(data);
      })
      .catch(() => {});
  }, []);

  const isActive = (href) => {
    if (href === "/dashboard/endpoint") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/endpoint");
    }
    return pathname.startsWith(href);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setShowUpdateModal(false);
    try {
      const res = await fetch("/api/version/update", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Update failed. Please run the install command manually.");
        setIsUpdating(false);
        return;
      }
      setIsDisconnected(true);
    } catch {
      setIsDisconnected(true);
    }
  };

  useEffect(() => {
    if (!isUpdating || !isDisconnected) return;
    let stopped = false;

    const tick = async () => {
      try {
        const res = await fetch(STATUS_URL, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!stopped) setUpdateStatus(data);
        }
      } catch {}
    };

    tick();
    const id = setInterval(tick, UPDATER_CONFIG.statusPollIntervalMs);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [isUpdating, isDisconnected, STATUS_URL]);

  const handleShutdown = async () => {
    setIsShuttingDown(true);
    try {
      await fetch("/api/shutdown", { method: "POST" });
    } catch {}
    setIsShuttingDown(false);
    setShowShutdownModal(false);
    setIsDisconnected(true);
  };

  return (
    <>
      <aside className="surface-noise flex min-h-full w-[18.5rem] flex-col border-r border-border bg-white/74 shadow-[24px_0_70px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl transition-colors duration-300 dark:bg-slate-950/70">
        <div className="flex items-center gap-2 px-6 pb-2 pt-5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        </div>

        <div className="flex flex-col gap-3 px-5 py-4">
          <Link href="/dashboard" className="dashboard-panel group flex items-center gap-3 rounded-[18px] px-4 py-3">
            <div className="brand-orb star-logo flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/75 bg-[linear-gradient(145deg,rgba(125,211,252,0.9),rgba(56,189,248,0.82)_42%,rgba(129,140,248,0.78))] text-white shadow-[0_18px_36px_-18px_rgba(14,165,233,0.86),inset_0_1px_0_rgba(255,255,255,0.9)] transition group-hover:scale-105 dark:border-cyan-200/24 dark:bg-[linear-gradient(145deg,rgba(34,211,238,0.48),rgba(37,99,235,0.42)_48%,rgba(124,58,237,0.44))]" aria-hidden="true">
              <span className="star-logo__core" />
              <span className="star-logo__ray star-logo__ray--v" />
              <span className="star-logo__ray star-logo__ray--h" />
              <span className="star-logo__spark star-logo__spark--one" />
              <span className="star-logo__spark star-logo__spark--two" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted/70">
                Control Center
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight text-text-main">
                {APP_CONFIG.name}
              </h1>
              <span className="text-xs text-text-muted" data-i18n-skip="true">
                Phiên bản {APP_CONFIG.version}
              </span>
            </div>
          </Link>

          {updateInfo && (
            <div className="rounded-[16px] border border-green-500/15 bg-green-500/8 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:border-amber-400/15 dark:bg-amber-400/6">
              <span className="block text-xs font-semibold text-green-700 dark:text-amber-400">
                New version available: v{updateInfo.latestVersion}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="cursor-pointer rounded-[10px] bg-green-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-green-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  Update now
                </button>
                <button
                  onClick={() => copy(INSTALL_CMD)}
                  title="Copy install command"
                  className="min-w-0 flex-1 rounded-[10px] border border-black/5 bg-white/50 px-2 py-1.5 text-left transition hover:opacity-80 dark:border-white/6 dark:bg-white/[0.03]"
                >
                  <code className="block truncate font-mono text-[10px] text-green-700/80 dark:text-amber-400/70">
                    {copied ? "Copied!" : INSTALL_CMD}
                  </code>
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
              onClick={onClose}
            />
          ))}

          <div className="mt-3 space-y-1 pt-3">
            <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted/55">
              System
            </p>

            <button
              onClick={() => setMediaOpen((v) => !v)}
              className={cn(
                "nav-link-pro group relative flex w-full items-center gap-3 overflow-hidden rounded-[14px] px-3 py-2.5 transition-all",
                pathname.startsWith("/dashboard/media-providers")
                  ? "bg-gradient-to-r from-brand-500/18 via-brand-500/10 to-transparent text-primary"
                  : "text-text-muted hover:bg-white/50 hover:text-text-main dark:hover:bg-white/[0.04]"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">perm_media</span>
              <span className="flex-1 text-left text-[13px] font-medium tracking-tight">Media Providers</span>
              <span
                className="material-symbols-outlined text-[14px] transition-transform"
                style={{ transform: mediaOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                expand_more
              </span>
            </button>

            {mediaOpen && (
              <div className="pl-4 pt-1">
                {MEDIA_PROVIDER_KINDS.filter((k) => VISIBLE_MEDIA_KINDS.includes(k.id)).map((kind) => (
                  <NavLink
                    key={kind.id}
                    href={`/dashboard/media-providers/${kind.id}`}
                    label={kind.label}
                    icon={kind.icon}
                    active={pathname.startsWith(`/dashboard/media-providers/${kind.id}`)}
                    onClick={onClose}
                    compact
                  />
                ))}
                <NavLink
                  href={COMBINED_WEB_ITEM.href}
                  label={COMBINED_WEB_ITEM.label}
                  icon={COMBINED_WEB_ITEM.icon}
                  active={pathname.startsWith(COMBINED_WEB_ITEM.href)}
                  onClick={onClose}
                  compact
                />
              </div>
            )}

            {systemItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
                onClick={onClose}
              />
            ))}

            {debugItems.map((item) => {
              const show = item.href !== "/dashboard/translator" || enableTranslator;
              return show ? (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.href)}
                  onClick={onClose}
                />
              ) : null;
            })}

            <NavLink
              href="/dashboard/profile"
              label="Settings"
              icon="settings"
              active={isActive("/dashboard/profile")}
              onClick={onClose}
            />
          </div>
        </nav>

        <div className="border-t border-white/50 p-4 dark:border-white/6">
          <Button
            variant="outline"
            fullWidth
            icon="power_settings_new"
            onClick={() => setShowShutdownModal(true)}
            className="border-red-200/70 text-red-500 hover:border-red-300 hover:bg-red-50/80 dark:border-red-500/20 dark:hover:bg-red-500/10"
          >
            Shutdown
          </Button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showShutdownModal}
        onClose={() => setShowShutdownModal(false)}
        onConfirm={handleShutdown}
        title="Close Proxy"
        message="Are you sure you want to close the proxy server?"
        confirmText="Close"
        cancelText="Cancel"
        variant="danger"
        loading={isShuttingDown}
      />

      <ConfirmModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleUpdate}
        title="Update TTT Router API"
        message={`This will close TTT Router API and install v${updateInfo?.latestVersion || ""} in a separate window. Continue?`}
        confirmText="Update"
        cancelText="Cancel"
        variant="primary"
        loading={isUpdating}
      />

      {isDisconnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          {isUpdating ? (
            <UpdateProgress
              status={updateStatus}
              latestVersion={updateInfo?.latestVersion}
              installCmd={INSTALL_CMD}
              copied={copied}
              onCopy={() => copy(INSTALL_CMD)}
            />
          ) : (
            <div className="text-center p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
                <span className="material-symbols-outlined text-[32px]">power_off</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Server Disconnected</h2>
              <p className="mb-6 text-text-muted">The proxy server has been stopped.</p>
              <Button variant="secondary" onClick={() => globalThis.location.reload()}>
                Reload Page
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

Sidebar.propTypes = {
  onClose: PropTypes.func,
};

function UpdateProgress({ status, latestVersion, installCmd, copied, onCopy }) {
  const phase = status?.phase || "connecting";
  const done = status?.done === true;
  const success = status?.success === true;
  const attempt = status?.attempt || 0;
  const maxRetries = status?.maxRetries || 0;
  const logTail = status?.logTail || [];
  const errorMsg = status?.error;

  const steps = [
    { key: "stopped", label: "Stopped TTT Router API server", state: "done" },
    {
      key: "launched",
      label: "Launched background installer",
      state: status ? "done" : "active",
    },
    {
      key: "waiting",
      label: "Waiting for app processes to exit",
      state: phase === "waitingForExit" ? "active" : (status && phase !== "starting" ? "done" : "pending"),
    },
    {
      key: "installing",
      label: attempt > 1 ? `Installing v${latestVersion || "latest"} (attempt ${attempt}/${maxRetries})` : `Installing v${latestVersion || "latest"}`,
      state: done ? (success ? "done" : "error") : (phase === "installing" ? "active" : "pending"),
    },
    {
      key: "finished",
      label: done && success ? "Installed - ready to restart" : "Waiting to finish",
      state: done && success ? "done" : (done && !success ? "error" : "pending"),
    },
  ];

  return (
    <div className="w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900/95 p-6 text-white">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full",
            done && success ? "bg-green-500/20 text-green-400" :
              done && !success ? "bg-red-500/20 text-red-400" :
                "bg-blue-500/20 text-blue-400"
          )}
        >
          <span
            className={cn(
              "material-symbols-outlined text-[24px]",
              !done && "animate-spin"
            )}
          >
            {done && success ? "check_circle" : done && !success ? "error" : "progress_activity"}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {done && success ? "Update Completed" : done && !success ? "Update Failed" : "Updating TTT Router API"}
          </h2>
          <p className="text-xs text-white/60">
            {done && success
              ? `Installed v${latestVersion || "latest"} successfully`
              : done && !success
                ? (errorMsg || "Installation failed")
                : `Installing v${latestVersion || "latest"} from npm...`}
          </p>
        </div>
      </div>

      <ul className="mb-4 space-y-2">
        {steps.map((s) => (
          <li key={s.key} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "material-symbols-outlined shrink-0 text-[18px]",
                s.state === "done" && "text-green-400",
                s.state === "active" && "animate-pulse text-blue-400",
                s.state === "error" && "text-red-400",
                s.state === "pending" && "text-white/30"
              )}
            >
              {s.state === "done" ? "check_circle" :
                s.state === "error" ? "cancel" :
                  s.state === "active" ? "radio_button_checked" : "radio_button_unchecked"}
            </span>
            <span className={cn(s.state === "pending" ? "text-white/40" : "text-white/90")}>{s.label}</span>
          </li>
        ))}
      </ul>

      {logTail.length > 0 && (
        <div className="mb-4 max-h-40 overflow-auto rounded-md border border-white/5 bg-black/50 p-3">
          <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-white/70">
            {logTail.join("\n")}
          </pre>
        </div>
      )}

      {done && success ? (
        <div className="space-y-2">
          <p className="text-sm text-white/80">
            Run <code className="rounded bg-white/10 px-1.5 py-0.5 text-green-400">ttt_router</code> in your terminal to start the new TTT Router API version.
          </p>
          <Button variant="secondary" fullWidth onClick={() => globalThis.location.reload()}>
            Reload Page
          </Button>
        </div>
      ) : done && !success ? (
        <div className="space-y-2">
          <p className="text-sm text-white/80">Run the install command manually:</p>
          <button
            onClick={onCopy}
            className="w-full rounded bg-white/5 px-3 py-2 text-left transition-colors hover:bg-white/10"
          >
            <code className="font-mono text-xs text-amber-400">
              {copied ? "Copied!" : installCmd}
            </code>
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-white/50">
          This may take 30-60 seconds. Please don't close this window.
        </p>
      )}
    </div>
  );
}

UpdateProgress.propTypes = {
  status: PropTypes.object,
  latestVersion: PropTypes.string,
  installCmd: PropTypes.string.isRequired,
  copied: PropTypes.bool,
  onCopy: PropTypes.func.isRequired,
};
