"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { orderMessage, waLink } from "@/lib/whatsapp";

export default function ProductCard({ product, currency = "PKR", whatsapp }) {
  const imgs = product.images?.length ? product.images : [null];
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  const go = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + dir + imgs.length) % imgs.length);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      aria-label={`View ${product.name}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-sand/40 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-lux">
        <div
          className="relative aspect-[4/5] w-full touch-pan-y"
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (startX.current === null) return;
            const dx = e.changedTouches[0].clientX - startX.current;
            if (Math.abs(dx) > 42) go(e, dx > 0 ? -1 : 1);
            startX.current = null;
          }}
        >
          {imgs[idx] ? (
            <Image
              src={imgs[idx]}
              alt={`${product.name} — image ${idx + 1}`}
              fill
              sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-muted">
              <Sparkles size={40} strokeWidth={1} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.featured && (
              <span className="badge bg-ink/85 text-gold-300 backdrop-blur">Signature</span>
            )}
            {discount > 0 && (
              <span className="badge bg-gold-500 text-white shadow-gold-sm">−{discount}%</span>
            )}
            {!product.active && (
              <span className="badge bg-red-600/90 text-white">Hidden</span>
            )}
          </div>

          {/* gallery arrows */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={(e) => go(e, -1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow transition hover:bg-white group-hover:opacity-100"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={(e) => go(e, 1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow transition hover:bg-white group-hover:opacity-100"
              >
                <ChevronRight size={17} />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {imgs.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === idx ? "w-5 bg-gold-500" : "w-1.5 bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-1.5 pb-1 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-600">
          {product.category}
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="font-display text-[22px] font-semibold leading-tight text-ink transition group-hover:text-gold-700">
            {product.name}
          </h3>
          <div className="whitespace-nowrap text-right">
            <p className="text-[15px] font-semibold text-ink">{formatPrice(product.price, currency)}</p>
            {product.compareAtPrice > product.price && (
              <p className="text-xs text-ink-muted line-through">
                {formatPrice(product.compareAtPrice, currency)}
              </p>
            )}
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
          {product.shortDescription}
        </p>

        <a
          href={waLink(whatsapp, orderMessage(product, currency))}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn-wa mt-4 w-full !px-4 !py-3 !text-[11px]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01" />
          </svg>
          Order on WhatsApp
        </a>
      </div>
    </Link>
  );
}
