import { notFound } from "next/navigation";
import Link from "next/link";
import { getStore } from "@/lib/store/factory";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const store = await getStore();
  const product = await store.getProductBySlug(params.slug);
  if (!product) return { title: "Not Found" };
  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 150) || undefined,
  };
}

export default async function ProductPage({ params }) {
  const store = await getStore();
  const product = await store.getProductBySlug(params.slug);
  if (!product || !product.active) notFound();

  const settings = await store.getSettings();
  const all = await store.listProducts();
  const related = all.filter((p) => p._id !== product._id).slice(0, 3);

  return (
    <main>
      <ProductDetail product={product} currency={settings.currency} whatsapp={settings.whatsappNumber} />
      {related.length > 0 && (
        <section className="container-lux py-20">
          <div className="mb-10 text-center">
            <p className="eyebrow justify-center">Continue Exploring</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink">
              You may also <span className="text-gold-gradient italic">adore</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} currency={settings.currency} whatsapp={settings.whatsappNumber} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/shop" className="btn-ghost">
              View the Full Collection
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
