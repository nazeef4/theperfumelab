"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Loader2,
  Megaphone,
  CheckCircle2,
  Circle,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import { toast } from "@/lib/toast";

export default function PromotionsManager({ onChange }) {
  const [promos, setPromos] = useState(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/promotions");
      if (res.status === 401) return location.reload();
      const data = await res.json();
      setPromos(data.promotions || []);
    } catch {
      toast("Failed to load promotions.", "error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function activate(p) {
    setBusyId(p._id);
    try {
      const res = await fetch(`/api/admin/promotions/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      setPromos((prev) => prev.map((x) => ({ ...x, active: x._id === p._id })));
      onChange?.();
      toast("Banner is now live on the storefront.");
    } catch (err) {
      toast(err.message || "Activation failed.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function clearActive() {
    setBusyId("clear");
    try {
      const res = await fetch("/api/admin/promotions/clear", { method: "POST" });
      if (!res.ok) throw new Error("Could not clear the banner.");
      setPromos((prev) => prev.map((x) => ({ ...x, active: false })));
      onChange?.();
      toast("Banner cleared — the default brand hero is live.", "info");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p) {
    if (!confirm(`Delete the promotion "${p.title || "Untitled"}"? Its poster image will be removed too.`)) return;
    setBusyId(p._id);
    try {
      const res = await fetch(`/api/admin/promotions/${p._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      setPromos((prev) => prev.filter((x) => x._id !== p._id));
      onChange?.();
      toast("Promotion deleted.");
    } catch (err) {
      toast(err.message || "Delete failed.", "error");
    } finally {
      setBusyId(null);
    }
  }

  const active = promos?.find((p) => p.active);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink">Promotions &amp; Events</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Manage the poster shown in the storefront hero banner.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearActive}
            disabled={busyId === "clear" || !active}
            className="btn border border-line !px-5 !py-2.5 text-ink-soft transition hover:bg-sand/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyId === "clear" ? <Loader2 size={15} className="animate-spin" /> : <Circle size={15} />}
            Use Default Hero
          </button>
          <button onClick={() => setCreating(true)} className="btn-gold !px-5 !py-2.5">
            <Plus size={15} /> Upload Poster
          </button>
        </div>
      </div>

      {/* live status */}
      <div
        className={`mb-7 flex items-center gap-3 rounded-2xl border px-5 py-4 ${
          active ? "border-gold-300 bg-gold-50" : "border-line bg-white"
        }`}
      >
        {active ? (
          <>
            <CheckCircle2 size={20} className="shrink-0 text-gold-600" />
            <p className="text-sm text-ink-soft">
              Live banner: <strong className="text-ink">{active.title || "Untitled promotion"}</strong>
            </p>
          </>
        ) : (
          <>
            <Sparkles size={20} className="shrink-0 text-gold-500" />
            <p className="text-sm text-ink-soft">
              No active poster — the storefront shows the <strong className="text-ink">default brand hero</strong>.
            </p>
          </>
        )}
      </div>

      {!promos ? (
        <div className="grid place-items-center rounded-2xl border border-line bg-white py-24">
          <Loader2 size={26} className="animate-spin text-gold-500" />
        </div>
      ) : promos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold-300 bg-white py-20 text-center">
          <Megaphone size={36} className="mx-auto text-gold-400" strokeWidth={1.4} />
          <p className="mt-4 font-display text-xl text-ink">No posters uploaded yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink-muted">
            Upload sale posters or event banners, then toggle one live. The storefront falls back to
            the default brand hero whenever nothing is active.
          </p>
          <button onClick={() => setCreating(true)} className="btn-gold mt-6">
            <Plus size={15} /> Upload Poster
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {promos.map((p) => (
            <div
              key={p._id}
              className={`overflow-hidden rounded-2xl border bg-white transition ${
                p.active ? "border-gold-400 shadow-gold-sm" : "border-line hover:border-gold-300"
              }`}
            >
              <div className="relative aspect-[16/9] bg-sand/50">
                {p.image ? (
                  <Image src={p.image} alt={p.title || "Poster"} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-ink-muted">
                    <ImageIcon size={30} strokeWidth={1.3} />
                  </div>
                )}
                {p.active && (
                  <span className="badge absolute left-3 top-3 bg-gold-500 text-white shadow-gold-sm">
                    ● Live
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-ink">{p.title || "Untitled promotion"}</h3>
                {p.subtitle && <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{p.subtitle}</p>}
                {p.linkUrl && (
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-gold-600">Links to {p.linkUrl}</p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  {p.active ? (
                    <span className="flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gold-700">
                      <CheckCircle2 size={13} /> Currently Live
                    </span>
                  ) : (
                    <button
                      onClick={() => activate(p)}
                      disabled={busyId === p._id}
                      className="btn-dark !px-4 !py-2 !text-[10px] disabled:opacity-60"
                    >
                      {busyId === p._id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      Set Live
                    </button>
                  )}
                  <button
                    onClick={() => remove(p)}
                    disabled={busyId === p._id}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    title="Delete promotion"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <PromotionForm
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            load();
            onChange?.();
          }}
        />
      )}
    </div>
  );
}

function PromotionForm({ onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [image, setImage] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!image.length) return setError("Please upload a poster image.");
    setBusy(true);
    try {
      const img = image[0];
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          linkUrl,
          image: img.url || img,
          imageId: img.id || String(img).split("/").pop(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast("Poster uploaded — set it live when ready.");
      onSaved?.();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto my-10 w-full max-w-2xl rounded-3xl border border-line bg-white shadow-lux">
        <div className="flex items-center justify-between border-b border-line px-7 py-5">
          <div>
            <h3 className="font-display text-2xl font-semibold text-ink">Upload Poster</h3>
            <p className="mt-0.5 text-xs text-ink-muted">Wide 16:9 images look best in the hero banner</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-muted transition hover:border-gold-400 hover:text-gold-600"
            aria-label="Close"
          >
            <Plus size={17} className="rotate-45" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 px-7 py-6">
          <ImageUploader
            label="Poster Image *"
            kind="poster"
            single
            value={image}
            onChange={setImage}
          />
          <div>
            <label className="label" htmlFor="pr-title">Headline <span className="normal-case text-ink-muted">(shown under the poster)</span></label>
            <input
              id="pr-title"
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Festive Edit — Up to 25% Off"
              maxLength={90}
            />
          </div>
          <div>
            <label className="label" htmlFor="pr-sub">Subheadline</label>
            <input
              id="pr-sub"
              className="field"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Celebrate the season with limited-edition fragrances."
              maxLength={140}
            />
          </div>
          <div>
            <label className="label" htmlFor="pr-link">Button Link <span className="normal-case text-ink-muted">(e.g. /shop)</span></label>
            <input
              id="pr-link"
              className="field"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/shop"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="flex justify-end gap-3 border-t border-line pt-5">
            <button type="button" onClick={onClose} className="btn border border-line !px-6 !py-3 text-ink-soft hover:bg-sand/60">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn-gold !px-7 disabled:opacity-60">
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Megaphone size={15} />}
              Save Poster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
