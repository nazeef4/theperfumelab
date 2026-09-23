"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Loader2,
  Search,
  PackageX,
} from "lucide-react";
import ProductForm from "./ProductForm";
import { toast } from "@/lib/toast";
import { formatPrice } from "@/lib/format";

export default function ProductsManager({ currency, onChange }) {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | {} | product
  const [deleting, setDeleting] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) return location.reload();
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      toast("Failed to load products.", "error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleField(p, field) {
    setBusyId(p._id);
    try {
      const res = await fetch(`/api/admin/products/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !p[field] }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      setProducts((prev) => prev.map((x) => (x._id === p._id ? data.product : x)));
      onChange?.();
      toast(field === "featured" ? "Signature flag updated." : "Visibility updated.");
    } catch (err) {
      toast(err.message || "Update failed.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting._id);
    try {
      const res = await fetch(`/api/admin/products/${deleting._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      setProducts((prev) => prev.filter((x) => x._id !== deleting._id));
      onChange?.();
      toast(`"${deleting.name}" deleted.`);
    } catch (err) {
      toast(err.message || "Delete failed.", "error");
    } finally {
      setBusyId(null);
      setDeleting(null);
    }
  }

  const filtered = (products || []).filter((p) =>
    (p.name + " " + p.category).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink">Products</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {products ? `${products.length} fragrance${products.length === 1 ? "" : "s"} in the catalogue` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="field !w-56 !py-2.5 !pl-10"
            />
          </div>
          <button onClick={() => setEditing({})} className="btn-gold !px-5 !py-2.5">
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {!products ? (
        <div className="grid place-items-center rounded-2xl border border-line bg-white py-24">
          <Loader2 size={26} className="animate-spin text-gold-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold-300 bg-white py-20 text-center">
          <PackageX size={36} className="mx-auto text-gold-400" strokeWidth={1.4} />
          <p className="mt-4 font-display text-xl text-ink">
            {query ? "No products match your search" : "No products yet"}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {query ? "Try a different keyword." : "Add your first fragrance to the collection."}
          </p>
          {!query && (
            <button onClick={() => setEditing({})} className="btn-gold mt-6">
              <Plus size={15} /> Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-gold-300 hover:shadow-gold-sm sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-sand/50">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-ink-muted">
                    <Star size={18} />
                  </div>
                )}
                {p.images?.length > 1 && (
                  <span className="absolute bottom-1 right-1 rounded-full bg-ink/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    +{p.images.length - 1}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
                  {p.featured && (
                    <span className="badge bg-gold-100 text-gold-700">
                      <Star size={9} /> Signature
                    </span>
                  )}
                  <span className={`badge ${p.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    {p.active ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-gold-600">{p.category}</p>
                <p className="mt-1 line-clamp-1 text-sm text-ink-muted">{p.shortDescription}</p>
              </div>

              <div className="text-left sm:text-right">
                <p className="font-semibold text-ink">{formatPrice(p.price, currency)}</p>
                {p.compareAtPrice > 0 && (
                  <p className="text-xs text-ink-muted line-through">{formatPrice(p.compareAtPrice, currency)}</p>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:justify-end">
                {busyId === p._id ? (
                  <span className="grid h-9 w-9 place-items-center">
                    <Loader2 size={17} className="animate-spin text-gold-500" />
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => toggleField(p, "featured")}
                      title={p.featured ? "Unmark signature" : "Mark as signature"}
                      className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
                        p.featured
                          ? "border-gold-400 bg-gold-50 text-gold-600"
                          : "border-line text-ink-muted hover:border-gold-400 hover:text-gold-600"
                      }`}
                    >
                      <Star size={15} />
                    </button>
                    <button
                      onClick={() => toggleField(p, "active")}
                      title={p.active ? "Hide from store" : "Show in store"}
                      className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
                        p.active
                          ? "border-line text-ink-muted hover:border-gold-400 hover:text-gold-600"
                          : "border-red-200 bg-red-50 text-red-500"
                      }`}
                    >
                      {p.active ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={() => setEditing(p)}
                      title="Edit product"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-muted transition hover:border-gold-400 hover:text-gold-600"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting(p)}
                      title="Delete product"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <ProductForm
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
            onChange?.();
          }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-lux">
            <h3 className="font-display text-2xl font-semibold text-ink">Delete product?</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              This will permanently remove <strong className="text-ink">“{deleting.name}”</strong> and its
              uploaded images. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleting(null)} className="btn !px-5 !py-2.5 border border-line text-ink-soft hover:bg-sand/60">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busyId === deleting?._id}
                className="btn !px-5 !py-2.5 bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {busyId === deleting?._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
