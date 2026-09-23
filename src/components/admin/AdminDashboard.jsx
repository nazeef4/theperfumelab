"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Megaphone,
  Settings as SettingsIcon,
  LogOut,
  RefreshCw,
  Store,
} from "lucide-react";
import Monogram from "@/components/Monogram";
import { toast } from "@/lib/toast";
import ProductsManager from "./ProductsManager";
import PromotionsManager from "./PromotionsManager";
import SettingsPanel from "./SettingsPanel";

const TABS = [
  { id: "products", label: "Products", icon: Package },
  { id: "promotions", label: "Promotions & Events", icon: Megaphone },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminDashboard({ username }) {
  const router = useRouter();
  const [tab, setTab] = useState("products");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.status === 401) {
          router.refresh();
          return;
        }
        const data = await res.json();
        if (live) setSettings(data.settings);
      } catch {
        toast("Could not load settings.", "error");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [router, reloadKey]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast("Signed out. See you soon.", "info");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Monogram className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold text-ink">The Perfume Lab</p>
              <p className="text-[8.5px] font-semibold uppercase tracking-luxe text-gold-600">
                Admin Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-soft transition hover:border-gold-400 hover:text-gold-700 sm:flex"
            >
              <Store size={14} /> View Store
            </a>
            <span className="hidden rounded-full bg-gold-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-gold-700 md:block">
              {username}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-soft transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
        {/* tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 sm:px-8" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-[12px] font-semibold uppercase tracking-wider transition ${
                tab === id ? "text-gold-700" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon size={15} />
              {label}
              {tab === id && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {loading || !settings ? (
          <div className="grid place-items-center py-32 text-ink-muted">
            <RefreshCw size={26} className="animate-spin text-gold-500" />
          </div>
        ) : (
          <>
            {tab === "products" && <ProductsManager currency={settings.currency} onChange={reload} />}
            {tab === "promotions" && <PromotionsManager onChange={reload} />}
            {tab === "settings" && <SettingsPanel settings={settings} onSaved={reload} />}
          </>
        )}
      </main>
    </div>
  );
}
