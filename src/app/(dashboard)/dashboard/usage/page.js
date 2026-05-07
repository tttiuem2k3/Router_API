"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UsageStats, RequestLogger, Card, CardSkeleton, SegmentedControl } from "@/shared/components";
import RequestDetailsTab from "./components/RequestDetailsTab";

const PERIODS = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "60d", label: "60D" },
];

export default function UsagePage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <UsageContent />
    </Suspense>
  );
}

function UsageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tabLoading, setTabLoading] = useState(false);
  const [period, setPeriod] = useState("7d");

  const tabFromUrl = searchParams.get("tab");
  const activeTab = tabFromUrl && ["overview", "logs", "details"].includes(tabFromUrl)
    ? tabFromUrl
    : "overview";

  const handleTabChange = (value) => {
    if (value === activeTab) return;
    setTabLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`/dashboard/usage?${params.toString()}`, { scroll: false });
    setTimeout(() => setTabLoading(false), 300);
  };

  return (
    <div className="dashboard-page page-rise flex min-w-0 flex-col gap-6 px-1 sm:px-0">
      <section className="dashboard-hero p-5 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="hero-kicker">
              <span className="material-symbols-outlined text-[15px]">monitoring</span>
              Usage intelligence
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-text-main sm:text-3xl">
              Understand traffic, latency, and request details at a glance.
            </h1>
            <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
              Switch between executive overview and deep request analysis without losing the clean dashboard rhythm.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <div className="hero-stat">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">View</p>
              <p className="mt-1 text-lg font-semibold capitalize text-text-main">{activeTab}</p>
            </div>
            <div className="hero-stat">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">Window</p>
              <p className="mt-1 text-lg font-semibold text-text-main">{period.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </section>

      <Card padding="sm" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          options={[
            { value: "overview", label: "Overview" },
            { value: "details", label: "Details" },
          ]}
          value={activeTab}
          onChange={handleTabChange}
          className="w-full sm:w-auto"
        />
        {activeTab === "overview" && (
          <SegmentedControl
            options={PERIODS}
            value={period}
            onChange={setPeriod}
            size="sm"
            className="w-full sm:w-auto"
          />
        )}
      </Card>

      {tabLoading ? (
        <CardSkeleton />
      ) : (
        <>
          {activeTab === "overview" && (
            <Suspense fallback={<CardSkeleton />}>
              <UsageStats period={period} setPeriod={setPeriod} hidePeriodSelector />
            </Suspense>
          )}
          {activeTab === "logs" && <RequestLogger />}
          {activeTab === "details" && <RequestDetailsTab />}
        </>
      )}
    </div>
  );
}
