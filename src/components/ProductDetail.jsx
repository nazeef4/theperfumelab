"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { orderMessage, waLink, GENERAL_ENQUIRY } from "@/lib/whatsapp";

export default function ProductDetail({ product, currency, whatsapp }) {
  const imgs = product.images?.length ? product.images : [];
  const [idx, setIdx] = useState(0);
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  const paragraphs = (product.description || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);

  return (
    <main className="container-lux pt-10 pb-20 md:pt-14">
      <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-gold-600">Home</Link>
        <span>/</span>
        <Link href="/shop" className="transition hover:text-gold-600">Collection</Link>
        <span>/</span>
        <span className="text-gold-700">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-sand/40 shadow-lux">
            {imgs[idx] ? (
              <Image
                src={imgs[idx]}
                alt={`${product.name} — image ${idx + 1} of ${imgs.length}`}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-muted">
                <Sparkles size={48} strokeWidth={1} />
              </div>
            )}
            {discount > 0 && (
              <span className="badge absolute left-4 top-4 bg-gold-500 text-white shadow-gold-sm">
                Save {discount}%
              </span>
            )}
            {imgs.length > 1 && (
              <>
                <button
                  onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setIdx((i) => (i + 1) % imgs.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {imgs.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {imgs.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setIdx(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === idx ? "border-gold-500 shadow-gold-sm" : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="eyebrow flex items-center gap-3">
            <span className="hairline !w-10" /> {product.category}
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.05] text-ink sm:text-6xl">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mt-4 font-display text-xl italic leading-relaxed text-ink-soft">
              “{product.shortDescription}”
            </p>
          )}

          <div className="mt-6 flex items-end gap-4">
            <p className="font-display text-4xl font-semibold text-gold-700">
              {formatPrice(product.price, currency)}
            </p>
            {product.compareAtPrice > product.price && (
              <p className="pb-1 text-lg text-ink-muted line-through">
                {formatPrice(product.compareAtPrice, currency)}
              </p>
            )}
          </div>

          <div className="hairline my-8" />

          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-[15px] leading-relaxed text-ink-soft ${
                  i > 0 ? "whitespace-pre-line" : ""
                }`}
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
            <a
              href={waLink(whatsapp, orderMessage(product, currency))}
              target="_blank"
              rel="noreferrer"
              className="btn-wa flex-1 !py-4 !text-[12px]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01" />
              </svg>
              Buy Now on WhatsApp
            </a>
            <a
              href={waLink(whatsapp, GENERAL_ENQUIRY)}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost flex-1 !py-4 !text-[12px]"
            >
              Ask a Question
            </a>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] uppercase tracking-[0.16em] text-ink-muted">
            <BadgeCheck size={14} className="text-gold-600" />
            You will be redirected to WhatsApp with your order pre-filled
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, t: "Sealed & Authentic" },
              { icon: Truck, t: "Nationwide Delivery" },
              { icon: RotateCcw, t: "Careful Packaging" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="rounded-2xl border border-line bg-ivory/60 px-3 py-4 text-center">
                <Icon size={20} className="mx-auto text-gold-600" strokeWidth={1.5} />
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
