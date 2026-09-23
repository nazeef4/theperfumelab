"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

function Skeleton() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink-soft to-ink" />
      <div className="container-lux relative z-10 py-28 md:py-40">
        <div className="max-w-2xl animate-pulse space-y-6">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="h-14 w-4/5 rounded bg-white/10" />
          <div className="h-14 w-3/5 rounded bg-white/10" />
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="h-12 w-48 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}

function DefaultHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      <Image
        src="/images/default-hero.jpg"
        alt="The Perfume Lab signature collection"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

      <div className="container-lux relative z-10 py-28 md:py-40 lg:py-48">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-4 animate-fade-up text-[11px] font-semibold uppercase tracking-luxe text-gold-300 [animation-delay:.1s]">
            <span className="hairline !w-12" /> Maison de Parfum · Est. 2024
          </p>
          <h1 className="animate-fade-up font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl [animation-delay:.25s]">
            Where Fragrance
            <br />
            Becomes <span className="text-gold-gradient italic">Art</span>
          </h1>
          <p className="mt-6 max-w-lg animate-fade-up text-base leading-relaxed text-ivory/80 [animation-delay:.45s] sm:text-lg">
            Hand-blended luxury perfumes crafted from rare ouds, noble florals and golden ambers —
            bottled in small batches for those who wear distinction.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:.6s]">
            <Link href="/shop" className="btn-gold">
              Explore the Collection <ArrowRight size={15} />
            </Link>
            <Link
              href="/#atelier"
              className="btn border border-ivory/30 text-ivory hover:border-gold-400 hover:text-gold-300"
            >
              Our Atelier
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/50 md:flex">
        <span className="text-[9px] uppercase tracking-luxe">Scroll</span>
        <span className="h-10 w-px animate-floaty bg-gradient-to-b from-gold-400 to-transparent" />
      </div>
    </section>
  );
}

function PromoHero({ promo }) {
  const wrapper = (children) => (
    <section className="relative bg-ink text-ivory">
      <div className="relative mx-auto aspect-[16/9] max-h-[78vh] w-full overflow-hidden sm:aspect-[21/9]">
        {children}
      </div>
    </section>
  );

  if (promo.image) {
    return wrapper(
      <>
        <Image
          src={promo.image}
          alt={promo.title || "Special promotion"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
        {(promo.title || promo.linkUrl) && (
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="container-lux flex flex-wrap items-center justify-between gap-4 pb-6 pt-16">
              <div>
                {promo.title && (
                  <h2 className="font-display text-2xl font-semibold text-white drop-shadow-md sm:text-3xl">
                    {promo.title}
                  </h2>
                )}
                {promo.subtitle && (
                  <p className="mt-1 max-w-xl text-sm text-white/85 drop-shadow">{promo.subtitle}</p>
                )}
              </div>
              {promo.linkUrl && (
                <Link href={promo.linkUrl} className="btn-gold !px-6 !py-2.5">
                  Shop the Offer <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // no image uploaded — typographic gold banner
  return wrapper(
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#17130E] via-[#2A2115] to-[#17130E]" />
      <div className="gold-glow absolute inset-0 opacity-60" />
      <div className="absolute inset-5 rounded-2xl border border-gold-500/30 sm:inset-8" />
      <div className="absolute inset-6 rounded-xl border border-gold-500/15 sm:inset-10" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {promo.subtitle && (
          <p className="animate-fade-up text-[10px] font-semibold uppercase tracking-luxe text-gold-300 [animation-delay:.1s]">
            {promo.subtitle}
          </p>
        )}
        <h2 className="mt-4 animate-fade-up font-display text-4xl font-semibold text-transparent sm:text-6xl [animation-delay:.3s] text-gold-gradient">
          {promo.title || "A Special Announcement"}
        </h2>
        {promo.linkUrl && (
          <Link
            href={promo.linkUrl}
            className="btn-gold mt-8 animate-fade-up [animation-delay:.5s]"
          >
            Discover <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function HeroBanner({ promo }) {
  return promo ? <PromoHero promo={promo} /> : <DefaultHero />;
}
