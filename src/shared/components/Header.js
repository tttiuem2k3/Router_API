"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import ProviderIcon from "@/shared/components/ProviderIcon";
import HeaderMenu from "@/shared/components/HeaderMenu";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { useHeaderSearchStore } from "@/store/headerSearchStore";
import { OAUTH_PROVIDERS, APIKEY_PROVIDERS } from "@/shared/constants/config";
import { MEDIA_PROVIDER_KINDS, AI_PROVIDERS } from "@/shared/constants/providers";
import { translate } from "@/i18n/runtime";

const getPageInfo = (pathname) => {
  if (!pathname) return { title: "", description: "", breadcrumbs: [] };

  const mediaDetailMatch = pathname.match(/\/media-providers\/([^/]+)\/([^/]+)$/);
  if (mediaDetailMatch) {
    const kindId = mediaDetailMatch[1];
    const providerId = mediaDetailMatch[2];
    const kindConfig = MEDIA_PROVIDER_KINDS.find((k) => k.id === kindId);
    const provider = AI_PROVIDERS[providerId];
    return {
      title: provider?.name || providerId,
      description: "",
      breadcrumbs: [
        { label: "Media Providers", href: `/dashboard/media-providers/${kindId}` },
        { label: kindConfig?.label || kindId, href: `/dashboard/media-providers/${kindId}` },
        { label: provider?.name || providerId, image: `/providers/${providerId}.png` },
      ],
    };
  }

  const mediaKindMatch = pathname.match(/\/media-providers\/([^/]+)$/);
  if (mediaKindMatch) {
    const kindId = mediaKindMatch[1];
    const kindConfig = MEDIA_PROVIDER_KINDS.find((k) => k.id === kindId);
    return {
      title: kindConfig?.label || kindId,
      description: `Manage your ${kindConfig?.label || kindId} providers`,
      icon: kindConfig?.icon || "perm_media",
      breadcrumbs: [],
    };
  }

  const providerMatch = pathname.match(/\/providers\/([^/]+)$/);
  if (providerMatch) {
    const providerId = providerMatch[1];
    const providerInfo = OAUTH_PROVIDERS[providerId] || APIKEY_PROVIDERS[providerId];
    if (providerInfo) {
      return {
        title: providerInfo.name,
        description: "",
        breadcrumbs: [
          { label: "Providers", href: "/dashboard/providers" },
          { label: providerInfo.name, image: `/providers/${providerInfo.id}.png` },
        ],
      };
    }
  }

  if (pathname.includes("/providers") && !pathname.includes("/media-providers")) {
    return {
      title: "Providers",
      description: "Manage your AI provider connections",
      icon: "dns",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/combos")) {
    return {
      title: "Combos",
      description: "Model combos with fallback",
      icon: "layers",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/usage")) {
    return {
      title: "Usage & Analytics",
      description: "Monitor your API usage, token consumption, and request logs",
      icon: "bar_chart",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/auth-files")) {
    return {
      title: "Auth Files",
      description: "Map provider credentials stored in the local database",
      icon: "vpn_key",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/quota")) {
    return {
      title: "Quota Tracker",
      description: "Track and manage your API quota limits",
      icon: "data_usage",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/mitm")) {
    return {
      title: "MITM Proxy",
      description: "Intercept CLI tool traffic and route through TTT Router API",
      icon: "security",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/cli-tools")) {
    return {
      title: "CLI Tools",
      description: "Configure CLI tools",
      icon: "terminal",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/proxy-pools")) {
    return {
      title: "Proxy Pools",
      description: "Manage your proxy pool configurations",
      icon: "lan",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/skills")) {
    return {
      title: "Agent Skills",
      description: "Copy a link and paste to your AI to use TTT Router API - no install needed",
      icon: "extension",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/endpoint")) {
    return {
      title: "Endpoint",
      description: "API endpoint configuration",
      icon: "api",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/profile")) {
    return {
      title: "Settings",
      description: "Manage your preferences",
      icon: "settings",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/translator")) {
    return {
      title: "Translator",
      description: "Debug translation flow between formats",
      icon: "translate",
      breadcrumbs: [],
    };
  }
  if (pathname.includes("/console-log")) {
    return {
      title: "Console Log",
      description: "Live server console output",
      icon: "monitor",
      breadcrumbs: [],
    };
  }
  if (pathname === "/dashboard") {
    return {
      title: "Endpoint",
      description: "API endpoint configuration",
      icon: "api",
      breadcrumbs: [],
    };
  }
  return { title: "", description: "", breadcrumbs: [] };
};

export default function Header({ onMenuClick, showMenuButton = true }) {
  const pathname = usePathname();
  const router = useRouter();
  const pageInfo = useMemo(() => getPageInfo(pathname), [pathname]);
  const { title, description, icon, breadcrumbs } = pageInfo;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <header className="topbar-glow sticky top-0 z-20 flex shrink-0 items-center justify-between gap-3 border-b border-border bg-white/78 px-4 pb-3 pt-3 shadow-[0_18px_54px_-42px_rgba(15,23,42,0.42)] backdrop-blur-2xl dark:bg-slate-950/58 lg:px-8">
      <div className="flex shrink-0 items-center gap-3 lg:hidden">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-black/5 bg-white/70 text-text-main shadow-[0_8px_18px_-14px_rgba(16,24,22,0.35)] transition hover:border-brand-500/25 hover:text-primary dark:border-white/8 dark:bg-white/[0.05]"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <div
                key={`${crumb.label}-${crumb.href || "current"}`}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <span className="material-symbols-outlined text-base text-text-muted">
                    chevron_right
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded-md px-1.5 py-1 text-text-muted transition-colors hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    {crumb.image && (
                      <ProviderIcon
                        src={crumb.image}
                        alt={crumb.label}
                        size={28}
                        className="max-h-[28px] max-w-[28px] rounded object-contain"
                        fallbackText={crumb.label.slice(0, 2).toUpperCase()}
                      />
                    )}
                    <h1 className="truncate text-base font-semibold tracking-tight text-text-main lg:text-[1.7rem]">
                      {translate(crumb.label)}
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : title ? (
          <div className="gradient-ring group rounded-[16px] border border-border bg-white/72 px-3 py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-500/25 hover:bg-white/88 dark:bg-slate-900/42 dark:hover:bg-slate-900/62">
            <div className="flex items-center gap-2">
              {icon && (
                <span className="material-symbols-outlined text-primary text-xl transition group-hover:scale-110 lg:text-2xl">
                  {icon}
                </span>
              )}
              <h1 className="truncate text-base font-semibold tracking-tight lg:text-[1.7rem]">
                {translate(title)}
              </h1>
            </div>
            {description && (
              <p className="mt-1 hidden truncate text-sm text-text-muted lg:block">
                {translate(description)}
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <HeaderSearch />
        <ThemeToggle />
        <HeaderMenu onLogout={handleLogout} />
      </div>
    </header>
  );
}

function HeaderSearch() {
  const visible = useHeaderSearchStore((s) => s.visible);
  const query = useHeaderSearchStore((s) => s.query);
  const placeholder = useHeaderSearchStore((s) => s.placeholder);
  const setQuery = useHeaderSearchStore((s) => s.setQuery);

  if (!visible) return null;

  return (
    <div className="relative w-[170px] sm:w-[240px]">
      <span className="material-symbols-outlined pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-text-muted">
        search
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[10px] border border-black/5 bg-white/72 pl-8 pr-8 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_30px_-24px_rgba(16,24,22,0.32)] transition-colors focus:border-primary/35 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/8 dark:bg-white/[0.045]"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:text-text-main"
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}

Header.propTypes = {
  onMenuClick: PropTypes.func,
  showMenuButton: PropTypes.bool,
};
