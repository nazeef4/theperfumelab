"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const t = e.detail;
      setItems((prev) => [...prev.slice(-3), t]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 4200);
    };
    window.addEventListener("tpl-toast", onToast);
    return () => window.removeEventListener("tpl-toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lux backdrop-blur animate-[fadeUp_.35s_ease] ${
            t.type === "error"
              ? "border-red-200 bg-red-50/95 text-red-800"
              : t.type === "info"
                ? "border-gold-200 bg-ivory/95 text-ink-soft"
                : "border-gold-200 bg-white/95 text-ink"
          }`}
          role="status"
        >
          {t.type === "error" ? (
            <AlertCircle size={17} className="shrink-0 text-red-500" />
          ) : t.type === "info" ? (
            <Info size={17} className="shrink-0 text-gold-500" />
          ) : (
            <CheckCircle2 size={17} className="shrink-0 text-gold-600" />
          )}
          <span className="flex-1 leading-snug">{t.message}</span>
          <button
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
            className="rounded p-0.5 opacity-50 transition hover:opacity-100"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
