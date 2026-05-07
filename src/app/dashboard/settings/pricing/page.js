"use client";

import { useState, useEffect } from "react";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import PricingModal from "@/shared/components/PricingModal";

export default function PricingSettingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [currentPricing, setCurrentPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pricing");
      if (response.ok) {
        const data = await response.json();
        setCurrentPricing(data);
      }
    } catch (error) {
      console.error("Failed to load pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePricingUpdated = () => {
    loadPricing();
  };

  const getModelCount = () => {
    if (!currentPricing) return 0;
    let count = 0;
    for (const provider in currentPricing) {
      count += Object.keys(currentPricing[provider]).length;
    }
    return count;
  };

  const getProviders = () => {
    if (!currentPricing) return [];
    return Object.keys(currentPricing).sort();
  };

  return (
    <div className="dashboard-page mx-auto max-w-6xl space-y-6 p-6">
      <div className="dashboard-hero flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="hero-kicker mb-3">
            <span className="material-symbols-outlined text-[16px]">paid</span>
            Cost Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pricing <span className="gradient-text">Settings</span>
          </h1>
          <p className="mt-2 max-w-2xl text-text-muted">
            Configure pricing rates for cost tracking and calculations
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} icon="edit" className="shrink-0">
          Edit Pricing
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="metric-card p-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Total Models</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight gradient-text">
            {loading ? "..." : getModelCount()}
          </div>
        </Card>
        <Card className="metric-card p-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Providers</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">
            {loading ? "..." : getProviders().length}
          </div>
        </Card>
        <Card className="metric-card p-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Status</div>
          <div className="mt-2 flex items-center gap-2 text-3xl font-extrabold tracking-tight text-success">
            {!loading && <span className="live-dot" />}
            {loading ? "..." : "Active"}
          </div>
        </Card>
      </div>

      <Card className="dashboard-surface rounded-[22px] p-6">
        <h2 className="section-heading mb-4 text-xl">How Pricing Works</h2>
        <div className="space-y-3 text-sm leading-6 text-text-muted">
          <p>
            <strong>Cost Calculation:</strong> Costs are calculated based on token usage and pricing rates.
            Each request&apos;s cost is determined by: (input_tokens x input_rate) + (output_tokens x output_rate) + (cached_tokens x cached_rate)
          </p>
          <p>
            <strong>Pricing Format:</strong> All rates are in <strong>dollars per million tokens</strong> ($/1M tokens).
            Example: An input rate of 2.50 means $2.50 per 1,000,000 input tokens.
          </p>
          <p><strong>Token Types:</strong></p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li><strong>Input:</strong> Standard prompt tokens</li>
            <li><strong>Output:</strong> Completion/response tokens</li>
            <li><strong>Cached:</strong> Cached input tokens, typically 50% of input rate</li>
            <li><strong>Reasoning:</strong> Special reasoning/thinking tokens, fallback to output rate</li>
            <li><strong>Cache Creation:</strong> Tokens used to create cache entries, fallback to input rate</li>
          </ul>
          <p>
            <strong>Custom Pricing:</strong> You can override default pricing for specific models.
            Reset to defaults anytime to restore standard rates.
          </p>
        </div>
      </Card>

      <Card className="dashboard-surface rounded-[22px] p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-heading text-xl">Current Pricing Overview</h2>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-sm font-semibold text-primary transition hover:-translate-y-px hover:bg-brand-500/15"
          >
            View Full Details
          </button>
        </div>

        {loading ? (
          <div className="py-4 text-center text-text-muted">Loading pricing data...</div>
        ) : currentPricing ? (
          <div className="space-y-3">
            {Object.keys(currentPricing).slice(0, 5).map((provider) => (
              <div key={provider} className="flex items-center justify-between rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm">
                <span className="font-mono font-semibold text-primary">{provider.toUpperCase()}</span>
                <span className="text-text-muted">{Object.keys(currentPricing[provider]).length} models</span>
              </div>
            ))}
            {Object.keys(currentPricing).length > 5 && (
              <div className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-text-muted">
                + {Object.keys(currentPricing).length - 5} more providers
              </div>
            )}
          </div>
        ) : (
          <div className="text-text-muted">No pricing data available</div>
        )}
      </Card>

      {showModal && (
        <PricingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handlePricingUpdated}
        />
      )}
    </div>
  );
}
