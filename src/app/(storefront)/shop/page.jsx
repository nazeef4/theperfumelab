import { getStore } from "@/lib/store/factory";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = { title: "The Collection" };

export default async function ShopPage() {
  const store = await getStore();
  const [products, settings] = await Promise.all([store.listProducts(), store.getSettings()]);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();

  return (
    <main>
      <header className="gold-glow border-b border-line/70 bg-ivory/50">
        <div className="container-lux py-16 text-center md:py-20">
          <p className="eyebrow justify-center">Browse</p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-ink sm:text-6xl">
            The <span className="text-gold-gradient italic">Collection</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Each fragrance is hand-blended, rested and numbered. Tap any flacon to discover its
            story — order instantly through WhatsApp.
          </p>
          {categories.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {categories.map((c) => (
                <span key={c} className="badge border border-line bg-white px-4 py-1.5 text-ink-soft">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="container-lux py-14 md:py-20">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold-300 bg-ivory p-16 text-center">
            <p className="font-display text-2xl text-ink">No fragrances listed yet</p>
            <p className="mt-2 text-sm text-ink-muted">
              New blends are being prepared in the atelier — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} currency={settings.currency} whatsapp={settings.whatsappNumber} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
