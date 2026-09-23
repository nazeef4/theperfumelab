import Link from "next/link";
import Monogram from "@/components/Monogram";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-6 text-center text-ivory">
      <div className="gold-glow absolute inset-0 opacity-70" />
      <div className="absolute inset-4 rounded-3xl border border-gold-500/15 sm:inset-8" aria-hidden="true" />
      <div className="relative">
        <Monogram className="mx-auto h-16 w-16" />
        <p className="mt-8 font-display text-7xl font-semibold text-gold-gradient sm:text-8xl">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">This essence has evaporated</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/60">
          The page you are looking for does not exist or may have been retired from the collection.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-gold">Return Home</Link>
          <Link href="/shop" className="btn border border-ivory/25 text-ivory hover:border-gold-400 hover:text-gold-300">
            Browse Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
