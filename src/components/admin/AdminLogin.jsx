"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, ShieldCheck, ArrowLeft } from "lucide-react";
import Monogram from "@/components/Monogram";
import { toast } from "@/lib/toast";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign-in failed");
      toast("Welcome back — dashboard unlocked.");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#241C10] to-ink" />
      <div className="gold-glow absolute inset-0 opacity-70" />
      <div className="absolute inset-4 rounded-3xl border border-gold-500/15 sm:inset-8" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/50 transition hover:text-gold-300"
        >
          <ArrowLeft size={14} /> Back to store
        </Link>

        <div className="rounded-3xl border border-gold-500/25 bg-white/[0.06] p-8 shadow-lux backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Monogram className="h-16 w-16" />
            <h1 className="mt-5 font-display text-3xl font-semibold text-ivory">
              The Perfume Lab
            </h1>
            <p className="mt-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-luxe text-gold-300">
              <ShieldCheck size={13} /> Administrator Access
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="adm-user" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ivory/60">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/70" />
                <input
                  id="adm-user"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-gold-500/25 bg-ink/40 py-3.5 pl-11 pr-4 text-sm text-ivory placeholder:text-ivory/30 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adm-pass" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ivory/60">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/70" />
                <input
                  id="adm-pass"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gold-500/25 bg-ink/40 py-3.5 pl-11 pr-4 text-sm text-ivory placeholder:text-ivory/30 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-gold w-full !py-4 disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? "Verifying…" : "Sign In Securely"}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-ivory/40">
            Protected area · Authorized personnel only.
            <br />
            First run? Credentials come from <span className="text-gold-300/80">ADMIN_USERNAME / ADMIN_PASSWORD</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
