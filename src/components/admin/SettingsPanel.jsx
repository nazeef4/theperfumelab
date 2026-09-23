"use client";

import { useState } from "react";
import { Loader2, Save, KeyRound, MessageCircle, Coins, ExternalLink } from "lucide-react";
import { toast } from "@/lib/toast";
import { waLink } from "@/lib/whatsapp";

export default function SettingsPanel({ settings, onSaved }) {
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber || "");
  const [currency, setCurrency] = useState(settings.currency || "PKR");
  const [busy, setBusy] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  async function saveStore(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber: whatsapp, currency }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast("Store settings saved.");
      onSaved?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (next.length < 8) return toast("New password must be at least 8 characters.", "error");
    if (next !== confirm) return toast("New passwords do not match.", "error");
    setPwBusy(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Password change failed");
      toast("Password updated successfully.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold text-ink">Settings</h2>
        <p className="mt-1 text-sm text-ink-muted">Storefront preferences and account security.</p>
      </div>

      {/* store settings */}
      <form onSubmit={saveStore} className="rounded-2xl border border-line bg-white p-7">
        <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-100 text-gold-700">
            <MessageCircle size={16} />
          </span>
          WhatsApp Ordering
        </h3>
        <p className="mb-5 mt-2 text-sm text-ink-muted">
          Every “Order on WhatsApp” button opens this number with the order message pre-filled.
        </p>
        <label className="label" htmlFor="st-wa">WhatsApp Number (with country code)</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            id="st-wa"
            className="field !w-64"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="923001234567"
          />
          {whatsapp.replace(/\D/g, "").length >= 8 && (
            <a
              href={waLink(whatsapp, "Hello, I would like to know more about The Perfume Lab's collection.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-whatsapp transition hover:opacity-80"
            >
              Test link <ExternalLink size={12} />
            </a>
          )}
        </div>

        <div className="my-6 h-px bg-line" />

        <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-100 text-gold-700">
            <Coins size={16} />
          </span>
          Currency
        </h3>
        <p className="mb-5 mt-2 text-sm text-ink-muted">Shown on all prices across the storefront.</p>
        <label className="label" htmlFor="st-cur">Currency Code</label>
        <input
          id="st-cur"
          className="field !w-40"
          value={currency}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          placeholder="PKR"
          maxLength={6}
        />

        <div className="mt-7 flex justify-end">
          <button type="submit" disabled={busy} className="btn-gold !px-7 disabled:opacity-60">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Settings
          </button>
        </div>
      </form>

      {/* password */}
      <form onSubmit={changePassword} className="rounded-2xl border border-line bg-white p-7">
        <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-100 text-gold-700">
            <KeyRound size={16} />
          </span>
          Administrator Password
        </h3>
        <p className="mb-5 mt-2 text-sm text-ink-muted">
          Change the password used to sign in to this dashboard.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="pw-cur">Current</label>
            <input id="pw-cur" type="password" className="field" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
          </div>
          <div>
            <label className="label" htmlFor="pw-new">New (min 8)</label>
            <input id="pw-new" type="password" className="field" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
          </div>
          <div>
            <label className="label" htmlFor="pw-con">Confirm New</label>
            <input id="pw-con" type="password" className="field" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={pwBusy} className="btn-dark !px-7 disabled:opacity-60">
            {pwBusy ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
