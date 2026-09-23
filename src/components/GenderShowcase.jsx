"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

const TABS = [
  { id: "Men", label: "For Him", blurb: "Commanding woods, leather and smoke." },
  { id: "Women", label: "For Her", blurb: "Radiant florals, roses and soft musks." },
  { id: "Unisex", label: "For Everyone", blurb: "Shared signatures that follow no rules." },
];

export default function GenderShowcase({ products, currency, whatsapp }) {
  const genderOf = (p) => p.gender || "Unisex";
  const [tab, setTab] = useState(
    () => TABS.find((t) => products.some((p) => genderOf(p) === t.id))?.id || "Men"
  );

  const shown = products.filter((p) => genderOf(p) === tab).slice(0, 6);
  const active = TABS.find((t) => t.id === tab);

  return (
    <section className="container-lux py-20 md:py-24">
        <div className="text-center">
          <p className="eyebrow justify-center">Curated For You</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
            A scent for <span className="text-gold-gradient italic">every story</span>
          </h2>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Shop by gender"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                tab === t.id
                  ? "border-gold-500 bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-gold-sm"
                  : "border-line bg-white text-ink-soft hover:border-gold-400 hover:text-gold-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center font-display text-lg italic text-ink-muted">{active.blurb}</p>

        {shown.length === 0 ? (
          <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-dashed border-gold-300 bg-ivory/70 p-12 text-center">
            <p className="font-display text-xl text-ink">This edit is being composed…</p>
            <p className="mt-2 text-sm text-ink-muted">
              Fragrances for {active.label.toLowerCase()} are arriving shortly.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <ProductCard key={p._id} product={p} currency={currency} whatsapp={whatsapp} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href={`/shop?gender=${tab}`} className="btn-ghost">
            View all — {active.label} <ArrowRight size={14} />
          </Link>
        </div>
    </section>
  );
}
