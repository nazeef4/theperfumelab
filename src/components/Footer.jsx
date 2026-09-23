import Link from "next/link";
import { Instagram, Facebook, Mail, MapPin, ShieldCheck, Truck, Gem, MessageCircle } from "lucide-react";
import Monogram from "./Monogram";
import { BRAND } from "@/lib/config";

const ASSURANCES = [
  { icon: Gem, title: "Hand-Blended", sub: "Small-batch craftsmanship" },
  { icon: Truck, title: "Nationwide Delivery", sub: "Carefully sealed & shipped" },
  { icon: MessageCircle, title: "Instant Ordering", sub: "Checkout via WhatsApp" },
  { icon: ShieldCheck, title: "Authenticity Sealed", sub: "Quality-tested formulas" },
];

export default function Footer() {
  return (
    <footer className="mt-24">
      {/* assurances */}
      <div className="border-y border-line bg-ivory">
        <div className="container-lux grid grid-cols-2 gap-x-6 gap-y-8 py-12 lg:grid-cols-4">
          {ASSURANCES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-300/70 bg-white text-gold-600 shadow-gold-sm">
                <Icon size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-display text-lg font-semibold leading-tight text-ink">{title}</p>
                <p className="mt-1 text-xs text-ink-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gold-glow">
        <div className="container-lux grid gap-12 py-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Monogram className="h-12 w-12" />
              <div>
                <p className="font-display text-2xl font-semibold text-ink">The Perfume Lab</p>
                <p className="text-[9px] font-semibold uppercase tracking-luxe text-gold-600">
                  {BRAND.tagline}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted">
              A boutique maison crafting luxury fragrances from rare ouds, noble florals and golden
              ambers. Every bottle is blended, rested and sealed by hand — an olfactory signature
              you will not find anywhere else.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft transition hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-600"
              >
                <Instagram size={17} />
              </a>
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft transition hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-600"
              >
                <Facebook size={17} />
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft transition hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-600"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              <li><Link className="transition hover:text-gold-600" href="/shop">The Collection</Link></li>
              <li><Link className="transition hover:text-gold-600" href="/#atelier">Our Atelier</Link></li>
              <li><Link className="transition hover:text-gold-600" href="/#contact">Contact</Link></li>
              <li><Link className="transition hover:text-gold-600" href="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div id="contact">
            <p className="eyebrow">Concierge</p>
            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-gold-600" /> {BRAND.email}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-gold-600" /> {BRAND.city}
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} className="text-gold-600" /> WhatsApp concierge, 7 days a week
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line/70">
          <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-[11px] uppercase tracking-[0.18em] text-ink-muted sm:flex-row">
            <p>© {new Date().getFullYear()} The Perfume Lab. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Crafted with <span className="text-gold-500">✦</span> precision &amp; passion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
