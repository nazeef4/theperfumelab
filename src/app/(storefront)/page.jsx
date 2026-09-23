import { getStore } from "@/lib/store/factory";
import ProductCard from "@/components/ProductCard";
import HeroBanner from "@/components/HeroBanner";
import GenderShowcase from "@/components/GenderShowcase";
import Link from "next/link";
import { ArrowRight, FlaskConical, Layers, Timer } from "lucide-react";

export const dynamic = "force-dynamic";

const NOTES = [
  { letter: "T", title: "Top Notes", text: "A sparkling first impression — saffron, bergamot and dew-fresh florals that lift the moment." },
  { letter: "H", title: "Heart Notes", text: "The soul of the blend — smoked oud, Damask rose and noble woods unfolding over hours." },
  { letter: "B", title: "Base Notes", text: "The lingering trail — golden amber, vanilla bean and musk that stays close till dawn." },
];

const STEPS = [
  { icon: FlaskConical, n: "01", title: "Source", text: "Rare raw materials — Cambodian oud, Grasse rose, Calabrian bergamot — procured at origin." },
  { icon: Layers, n: "02", title: "Blend", text: "Our perfumer layers each accord by hand in micro-batches of no more than fifty bottles." },
  { icon: Timer, n: "03", title: "Rest & Seal", text: "Every blend macerates for 21 days, then is bottled, wax-sealed and numbered by hand." },
];

export default async function HomePage() {
  const store = await getStore();
  const [products, promo, settings] = await Promise.all([
    store.listProducts(),
    store.getActivePromotion(),
    store.getSettings(),
  ]);

  const featured = products.filter((p) => p.featured);
  const shown = (featured.length >= 3 ? featured : products).slice(0, 6);

  return (
    <main>
      <HeroBanner promo={promo} />

      {/* Collection */}
      <section className="container-lux py-20 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="hairline !w-10" /> The Collection
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
              Fragrances in <span className="text-gold-gradient italic">Focus</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-700 transition hover:text-gold-600"
          >
            View all
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {shown.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold-300 bg-ivory p-16 text-center">
            <p className="font-display text-2xl text-ink">The atelier is preparing new blends…</p>
            <p className="mt-2 text-sm text-ink-muted">Our first fragrances will be revealed here shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <ProductCard key={p._id} product={p} currency={settings.currency} whatsapp={settings.whatsappNumber} />
            ))}
          </div>
        )}
      </section>

      {/* For Him / For Her / Unisex */}
      <GenderShowcase products={products} currency={settings.currency} whatsapp={settings.whatsappNumber} />

      {/* Atelier */}
      <section id="atelier" className="gold-glow border-y border-line/70 bg-ivory/60 scroll-mt-24">
        <div className="container-lux grid gap-14 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="hairline !w-10" /> The Atelier
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Perfume, practiced as a <span className="text-gold-gradient italic">craft</span>
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-muted">
              The Perfume Lab is not a factory — it is an atelier. Every fragrance begins as a
              formula sketched by nose, debated over weeks, and refined drop by drop. We release
              nothing until it deserves a name.
            </p>
            <div className="mt-10 space-y-8">
              {NOTES.map((n) => (
                <div key={n.letter} className="flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-400/60 bg-white font-display text-xl font-semibold text-gold-600 shadow-gold-sm">
                    {n.letter}
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">{n.title}</p>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-muted">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] border border-gold-300/50" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/default-hero.jpg"
              alt="Inside The Perfume Lab atelier"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lux lg:aspect-[5/6]"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-2 rounded-2xl border border-gold-300/60 bg-white/95 px-7 py-5 shadow-lux backdrop-blur sm:-left-6">
              <p className="font-display text-4xl font-semibold text-gold-gradient">21</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Days of maceration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-lux py-20 md:py-28">
        <div className="text-center">
          <p className="eyebrow justify-center">From Source to Skin</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Three rituals, <span className="text-gold-gradient italic">one signature</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, n, title, text }) => (
            <div
              key={n}
              className="group relative overflow-hidden rounded-2xl border border-line bg-white p-9 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-lux"
            >
              <span className="absolute -right-3 -top-6 font-display text-[110px] font-semibold text-gold-100 transition-colors duration-500 group-hover:text-gold-200">
                {n}
              </span>
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-gold-300 to-gold-600 text-white shadow-gold-sm">
                <Icon size={24} strokeWidth={1.5} />
              </span>
              <h3 className="relative mt-6 font-display text-2xl font-semibold text-ink">{title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
