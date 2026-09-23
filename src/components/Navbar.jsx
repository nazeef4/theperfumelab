"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import Monogram from "./Monogram";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Collection" },
  { href: "/#atelier", label: "Atelier" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* announcement ribbon */}
      <div className="relative z-[60] overflow-hidden bg-ink text-ivory">
        <div className="flex w-max animate-marquee whitespace-nowrap py-2 text-[10px] font-medium uppercase tracking-[0.22em]">
          {[0, 1].map((n) => (
            <span key={n} className="flex items-center">
              {[
                "Hand-blended in small batches",
                "Cash on delivery available",
                "Long-lasting · alcohol-free options",
                "Nationwide delivery",
                "Order instantly on WhatsApp",
              ].map((t) => (
                <span key={t} className="flex items-center">
                  <Sparkles size={11} className="mx-5 text-gold-400" />
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-line/80 bg-white/90 shadow-[0_10px_40px_-20px_rgba(23,19,14,0.25)] backdrop-blur-xl"
            : "border-b border-transparent bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="container-lux flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3" aria-label="The Perfume Lab — home">
            <Monogram className="h-10 w-10 transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="leading-none">
              <span className="block font-display text-[21px] font-semibold tracking-wide text-ink">
                The Perfume Lab
              </span>
              <span className="mt-1 block text-[8.5px] font-semibold uppercase tracking-luxe text-gold-600">
                Maison de Parfum
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition hover:text-gold-600"
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
            <Link href="/shop" className="btn-gold !px-6 !py-2.5">
              Shop Now
            </Link>
          </nav>

          <button
            className="rounded-lg border border-line p-2 text-ink transition hover:border-gold-400 hover:text-gold-600 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* mobile drawer */}
        <div
          className={`overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-300 md:hidden ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="container-lux flex flex-col gap-1 py-4" aria-label="Mobile">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition hover:bg-gold-50 hover:text-gold-700"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/shop" className="btn-gold mt-2 self-start">
              Shop Now
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
