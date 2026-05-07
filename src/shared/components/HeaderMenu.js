"use client";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { LOCALE_COOKIE, normalizeLocale } from "@/i18n/config";
import { useTheme } from "@/shared/hooks/useTheme";
import ChangelogModal from "./ChangelogModal";
import NineRemotePromoModal from "./NineRemotePromoModal";
import LanguageSwitcher from "./LanguageSwitcher";

const LOCALE_INFO = {
  "en": { name: "English", flag: "EN" },
  "vi": { name: "Vietnamese", flag: "VI" },
  "zh-CN": { name: "Chinese Simplified", flag: "ZH" },
  "zh-TW": { name: "Chinese Traditional", flag: "TW" },
  "ja": { name: "Japanese", flag: "JA" },
  "pt-BR": { name: "Portuguese BR", flag: "BR" },
  "pt-PT": { name: "Portuguese PT", flag: "PT" },
  "ko": { name: "Korean", flag: "KO" },
  "es": { name: "Spanish", flag: "ES" },
  "de": { name: "German", flag: "DE" },
  "fr": { name: "French", flag: "FR" },
  "he": { name: "Hebrew", flag: "HE" },
  "ar": { name: "Arabic", flag: "AR" },
  "ru": { name: "Russian", flag: "RU" },
  "pl": { name: "Polish", flag: "PL" },
  "cs": { name: "Czech", flag: "CS" },
  "nl": { name: "Dutch", flag: "NL" },
  "tr": { name: "Turkish", flag: "TR" },
  "uk": { name: "Ukrainian", flag: "UK" },
  "tl": { name: "Tagalog", flag: "TL" },
  "id": { name: "Indonesian", flag: "ID" },
  "th": { name: "Thai", flag: "TH" },
  "hi": { name: "Hindi", flag: "HI" },
  "bn": { name: "Bengali", flag: "BN" },
  "ur": { name: "Urdu", flag: "UR" },
  "ro": { name: "Romanian", flag: "RO" },
  "sv": { name: "Swedish", flag: "SV" },
  "it": { name: "Italian", flag: "IT" },
  "el": { name: "Greek", flag: "EL" },
  "hu": { name: "Hungarian", flag: "HU" },
  "fi": { name: "Finnish", flag: "FI" },
  "da": { name: "Danish", flag: "DA" },
  "no": { name: "Norwegian", flag: "NO" },
};

function getLocaleFromCookie() {
  if (typeof document === "undefined") return "en";
  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${LOCALE_COOKIE}=`));
  const value = cookie ? decodeURIComponent(cookie.split("=")[1]) : "en";
  return normalizeLocale(value);
}

function MenuItem({ icon, label, onClick, trailing, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-500/10"
          : "text-text-main hover:bg-brand-500/8 dark:hover:bg-white/5"
      }`}
    >
      <span className={`material-symbols-outlined text-[20px] ${danger ? "" : "text-text-muted"}`}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {trailing && <span className="text-base">{trailing}</span>}
    </button>
  );
}

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  trailing: PropTypes.node,
  danger: PropTypes.bool,
};

export default function HeaderMenu({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [remoteOpen, setRemoteOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [locale, setLocale] = useState("en");
  const { toggleTheme, isDark } = useTheme();
  const menuRef = useRef(null);

  useEffect(() => {
    setLocale(getLocaleFromCookie());
  }, [langOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="gradient-ring flex items-center justify-center rounded-xl border border-border bg-surface/70 p-2 text-text-muted shadow-soft backdrop-blur transition-all hover:-translate-y-px hover:text-primary hover:shadow-warm"
          title="Menu"
        >
          <span className="material-symbols-outlined">grid_view</span>
        </button>

        {isOpen && (
          <div className="menu-pop absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-black/10 bg-surface/92 py-1 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-surface/88">
            <MenuItem
              icon="history"
              label="Change Log"
              onClick={() => { close(); setChangelogOpen(true); }}
            />
            <MenuItem
              icon="language"
              label={LOCALE_INFO[locale]?.name || locale}
              trailing={LOCALE_INFO[locale]?.flag || "--"}
              onClick={() => { close(); setLangOpen(true); }}
            />
            <MenuItem
              icon={isDark ? "light_mode" : "dark_mode"}
              label="Theme"
              onClick={() => { toggleTheme(); close(); }}
            />
            <MenuItem
              icon="computer"
              label="Remote"
              onClick={() => { close(); setRemoteOpen(true); }}
            />
            <MenuItem
              icon="logout"
              label="Logout"
              danger
              onClick={() => { close(); onLogout(); }}
            />
          </div>
        )}
      </div>

      <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
      <NineRemotePromoModal isOpen={remoteOpen} onClose={() => setRemoteOpen(false)} />
      <LanguageSwitcher hideTrigger isOpen={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}

HeaderMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

