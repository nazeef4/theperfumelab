"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { toast } from "@/lib/toast";
import { GENDERS } from "@/lib/models";

const EMPTY = {
  name: "",
  category: "",
  gender: "Unisex",
  price: "",
  compareAtPrice: "",
  shortDescription: "",
  description: "",
  images: [],
  featured: false,
  active: true,
};

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = Boolean(product?._id);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product?._id) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        gender: product.gender || "Unisex",
        price: product.price ?? "",
        compareAtPrice: product.compareAtPrice ?? "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        images: product.images || [],
        featured: Boolean(product.featured),
        active: product.active !== false,
      });
    }
  }, [product]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Product name is required.");
    if (form.price === "" || isNaN(Number(form.price))) return setError("Please enter a valid price.");
    if (form.compareAtPrice !== "" && isNaN(Number(form.compareAtPrice)))
      return setError("Compare-at price must be a number.");
    if (!form.images.length) return setError("Please upload at least one product image.");

    setBusy(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice === "" ? null : Number(form.compareAtPrice),
      };
      const res = await fetch(isEdit ? `/api/admin/products/${product._id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast(isEdit ? "Product updated." : "Product added to the collection.");
      onSaved?.();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto my-6 w-full max-w-3xl rounded-3xl border border-line bg-white shadow-lux">
        <div className="flex items-center justify-between border-b border-line px-7 py-5">
          <div>
            <h3 className="font-display text-2xl font-semibold text-ink">
              {isEdit ? "Edit Product" : "New Product"}
            </h3>
            <p className="mt-0.5 text-xs text-ink-muted">
              {isEdit ? `Refining “${product.name}”` : "Introduce a new fragrance to the collection"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-muted transition hover:border-gold-400 hover:text-gold-600"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={submit} className="px-7 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="pf-name">Product Name *</label>
              <input
                id="pf-name"
                className="field"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Amber Oud"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="pf-cat">Category</label>
              <input
                id="pf-cat"
                className="field"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Oriental, Floral, Woody…"
                list="pf-cats"
              />
              <datalist id="pf-cats">
                {["Signature", "Oriental", "Floral", "Woody", "Fresh", "Musky"].map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="label" htmlFor="pf-gender">
                Gender Section * <span className="normal-case text-ink-muted">(homepage &amp; shop section)</span>
              </label>
              <div className="grid grid-cols-3 gap-2" id="pf-gender" role="radiogroup" aria-label="Gender section">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={form.gender === g}
                    onClick={() => set("gender", g)}
                    className={`rounded-xl border px-2 py-3 text-[11px] font-semibold uppercase tracking-wider transition ${
                      form.gender === g
                        ? "border-gold-500 bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-gold-sm"
                        : "border-line bg-white text-ink-muted hover:border-gold-400 hover:text-gold-700"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="pf-price">Price *</label>
              <input
                id="pf-price"
                type="number"
                min="0"
                step="0.01"
                className="field"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="8500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="pf-compare">
                Compare-at Price <span className="normal-case text-ink-muted">(optional, shows a strike-through)</span>
              </label>
              <input
                id="pf-compare"
                type="number"
                min="0"
                step="0.01"
                className="field"
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice", e.target.value)}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="label" htmlFor="pf-short">
              Short Description * <span className="normal-case text-ink-muted">(used on cards & in the WhatsApp message)</span>
            </label>
            <input
              id="pf-short"
              className="field"
              maxLength={140}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="Smoky oud wrapped in warm amber and golden resins."
              required
            />
            <p className="mt-1 text-right text-[11px] text-ink-muted">{form.shortDescription.length}/140</p>
          </div>

          <div className="mt-5">
            <label className="label" htmlFor="pf-desc">
              Full Description * <span className="normal-case text-ink-muted">(blank line = new paragraph, great for note pyramids)</span>
            </label>
            <textarea
              id="pf-desc"
              rows={7}
              className="field resize-y"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder={"Top Notes — Saffron, Bergamot\nHeart Notes — Smoked Oud, Rose\nBase Notes — Vanilla, Sandalwood\n\nTell the story of the fragrance…"}
              required
            />
          </div>

          <div className="mt-6">
            <ImageUploader
              label="Product Images *"
              kind="product"
              max={10}
              value={form.images}
              onChange={(imgs) => set("images", imgs)}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4.5 w-4.5 accent-gold-600"
              />
              <span className="text-sm text-ink-soft">
                <strong className="font-semibold">Signature piece</strong> — highlight on the homepage
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
                className="h-4.5 w-4.5 accent-gold-600"
              />
              <span className="text-sm text-ink-soft">
                <strong className="font-semibold">Visible</strong> — show in the storefront
              </span>
            </label>
          </div>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-7 flex justify-end gap-3 border-t border-line pt-6">
            <button type="button" onClick={onClose} className="btn border border-line !px-6 !py-3 text-ink-soft hover:bg-sand/60">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn-gold !px-7 disabled:opacity-60">
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
