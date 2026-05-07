"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input } from "@/shared/components";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

      try {
        const res = await fetch(`${baseUrl}/api/settings`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.requireLogin === false) {
            router.push("/dashboard");
            router.refresh();
            return;
          }
          setHasPassword(!!data.hasPassword);
        } else {
          // Safe fallback on non-OK response to avoid infinite loading state.
          setHasPassword(true);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        setHasPassword(true);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking password
  if (hasPassword === null) {
    return (
      <div className="cyber-grid min-h-screen flex items-center justify-center bg-bg p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary shadow-glow"></div>
          <p className="text-text-muted mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden">
      {/* Faint grid background */}
      <div className="soft-grid absolute inset-0 pointer-events-none dark:cyber-grid" aria-hidden="true" />
      <div className="aurora-blob absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-400/16 blur-[120px] dark:bg-cyan-400/10" aria-hidden="true" />
      <div className="aurora-blob absolute bottom-[-14rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/14 blur-[120px] dark:bg-violet-500/10" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="hero-kicker mx-auto mb-4">
            <span className="live-dot" />
            Secure Console
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight gradient-text mb-2">TTT Router API</h1>
          <p className="text-text-muted">Enter your password to access the dashboard</p>
        </div>

        <Card className="dashboard-surface rounded-[24px] p-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Login
            </Button>

            <p className="text-xs text-center text-text-muted mt-2">
              Default password is <code className="rounded-lg border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-primary">123456</code>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
