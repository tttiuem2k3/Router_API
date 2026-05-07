"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LOCALES, LOCALE_COOKIE, normalizeLocale } from "@/i18n/config";
import { reloadTranslations } from "@/i18n/runtime";

function getLocaleFromCookie() {
  if (typeof document === "undefined") return "en";
  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${LOCALE_COOKIE}=`));
  const value = cookie ? decodeURIComponent(cookie.split("=")[1]) : "en";
  return normalizeLocale(value);
}

// Locale display names and flags - will be translated by runtime i18n
const getLocaleInfo = (locale) => {
  const locales = {
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
  return locales[locale] || { name: locale, flag: "--" };
};

export default function LanguageSwitcher({ className = "", isOpen: controlledOpen, onClose, hideTrigger = false }) {
  const [locale, setLocale] = useState("en");
  const [isPending, setIsPending] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const modalRef = useRef(null);

  const isControlled = typeof controlledOpen === "boolean";
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = (value) => {
    if (isControlled) {
      if (!value && onClose) onClose();
    } else {
      setInternalOpen(value);
    }
  };

  useEffect(() => {
    setLocale(getLocaleFromCookie());
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSetLocale = async (nextLocale) => {
    if (nextLocale === locale || isPending) return;

    setIsPending(true);
    setIsOpen(false);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      
      // Reload translations without full page reload
      await reloadTranslations();
      setLocale(nextLocale);
    } catch (err) {
      console.error("Failed to set locale:", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={className}>
      {/* Trigger button */}
      {!hideTrigger && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className="gradient-ring flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 py-2 text-text-muted shadow-soft backdrop-blur transition-all hover:-translate-y-px hover:text-primary"
          title="Language"
          data-i18n-skip="true"
        >
          <span className="material-symbols-outlined text-[20px]">language</span>
          <span className="text-sm font-medium">{getLocaleInfo(locale).name}</span>
          <span className="text-lg">{getLocaleInfo(locale).flag}</span>
        </button>
      )}

      {/* Portal modal - renders at document.body to avoid parent layout constraints */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" data-i18n-skip="true">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal content */}
          <div
            ref={modalRef}
            className="dashboard-surface relative flex max-h-[80vh] w-full max-w-2xl flex-col rounded-[24px] border border-border shadow-2xl menu-pop"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold text-text-main">Select Language</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-border bg-surface/60 p-1.5 text-text-muted transition hover:text-primary hover:shadow-soft"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal body - fixed grid columns, equal sizing */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2">
                {LOCALES.map((item) => {
                  const active = locale === item;
                  const info = getLocaleInfo(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handleSetLocale(item)}
                      disabled={isPending}
                      className={`flex flex-col items-center justify-start gap-1 px-2 py-3 rounded-2xl border text-xs font-medium transition-all hover:-translate-y-px w-full ${
                        active
                          ? "border-primary/40 bg-primary/12 text-primary ring-2 ring-primary/25"
                          : "border-border bg-surface/55 text-text-main hover:border-brand-500/25 hover:bg-brand-500/8"
                      } ${isPending ? "opacity-70 cursor-wait" : ""}`}
                      title={info.name}
                    >
                      <span className="text-2xl">{info.flag}</span>
                      {/* Fixed 2-line height so all cards are uniform */}
                      <span className="text-center leading-tight line-clamp-2 h-8 flex items-center">{info.name}</span>
                      {active && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

