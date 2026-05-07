"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getDefaultPricing } from "@/shared/constants/pricing.js";

export default function PricingModal({ isOpen, onClose, onSave }) {
  const [pricingData, setPricingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPricing();
    }
  }, [isOpen]);

  const loadPricing = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pricing");
      if (response.ok) {
        const data = await response.json();
        setPricingData(data);
      } else {
        const defaults = getDefaultPricing();
        setPricingData(defaults);
      }
    } catch (error) {
      console.error("Failed to load pricing:", error);
      const defaults = getDefaultPricing();
      setPricingData(defaults);
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = (provider, model, field, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;

    setPricingData(prev => {
      const newData = { ...prev };
      if (!newData[provider]) newData[provider] = {};
      if (!newData[provider][model]) newData[provider][model] = {};
      newData[provider][model][field] = numValue;
      return newData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricingData)
      });

      if (response.ok) {
        onSave?.();
        onClose();
      } else {
        const error = await response.json();
        alert(`Failed to save pricing: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to save pricing:", error);
      alert("Failed to save pricing");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset all pricing to defaults? This cannot be undone.")) return;

    try {
      const response = await fetch("/api/pricing", { method: "DELETE" });
      if (response.ok) {
        const defaults = getDefaultPricing();
        setPricingData(defaults);
      }
    } catch (error) {
      console.error("Failed to reset pricing:", error);
      alert("Failed to reset pricing");
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  const allProviders = Object.keys(pricingData).sort();
  const pricingFields = ["input", "output", "cached", "reasoning", "cache_creation"];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="dashboard-surface flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-border shadow-[0_28px_90px_-36px_rgba(15,23,42,0.72)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="hero-kicker mb-2">Pricing Matrix</div>
            <h2 className="text-xl font-bold tracking-tight">Pricing Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-surface/70 text-text-muted transition hover:-translate-y-px hover:text-text-main hover:shadow-soft"
            aria-label="Close pricing configuration"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-text-muted">
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              Loading pricing data...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="terminal-card rounded-2xl p-4 text-sm">
                <p className="mb-1 font-semibold text-cyan-200">Pricing Rates Format</p>
                <p className="text-slate-300">
                  All rates are in <strong>dollars per million tokens</strong> ($/1M tokens).
                  Example: Input rate of 2.50 means $2.50 per 1,000,000 input tokens.
                </p>
              </div>

              {allProviders.map(provider => {
                const models = Object.keys(pricingData[provider]).sort();
                return (
                  <div key={provider} className="overflow-hidden rounded-[20px] border border-border bg-surface/70 shadow-soft">
                    <div className="flex items-center justify-between border-b border-border bg-surface-2/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="live-dot" />
                        <span className="font-mono text-sm font-bold text-primary">{provider.toUpperCase()}</span>
                      </div>
                      <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-muted">
                        {models.length} models
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-surface-2/80 text-xs uppercase tracking-[0.12em] text-text-muted">
                          <tr>
                            <th className="px-3 py-3 text-left">Model</th>
                            <th className="px-3 py-3 text-right">Input</th>
                            <th className="px-3 py-3 text-right">Output</th>
                            <th className="px-3 py-3 text-right">Cached</th>
                            <th className="px-3 py-3 text-right">Reasoning</th>
                            <th className="px-3 py-3 text-right">Cache Creation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/70">
                          {models.map(model => (
                            <tr key={model} className="transition-colors hover:bg-brand-500/5">
                              <td className="max-w-[260px] truncate px-3 py-2 font-mono text-xs font-medium text-text-main" title={model}>{model}</td>
                              {pricingFields.map(field => (
                                <td key={field} className="px-3 py-2">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={pricingData[provider][model][field] || 0}
                                    onChange={(e) => handlePricingChange(provider, model, field, e.target.value)}
                                    className="w-24 rounded-xl border border-border bg-surface px-2 py-1.5 text-right font-mono text-xs text-text-main transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {allProviders.length === 0 && (
                <div className="py-8 text-center text-text-muted">
                  No pricing data available
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleReset}
            className="rounded-xl border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500 transition hover:-translate-y-px hover:bg-red-500/10 disabled:opacity-50"
            disabled={saving}
          >
            Reset to Defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-border bg-surface/70 px-4 py-2 text-sm font-semibold text-text-muted transition hover:-translate-y-px hover:text-text-main"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-premium relative overflow-hidden rounded-xl bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-warm)] transition hover:-translate-y-px disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
