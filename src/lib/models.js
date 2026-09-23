import { slugify } from "./format";
import { IMAGE_URL_RE } from "./config";

export function normalizeProduct(data = {}) {
  const out = {};
  out.name = String(data.name ?? "").trim();
  out.slug = slugify(data.slug || data.name || "");
  out.category = String(data.category ?? "Signature").trim() || "Signature";
  out.price = Math.max(0, Number(data.price) || 0);
  out.compareAtPrice =
    data.compareAtPrice === null || data.compareAtPrice === undefined || data.compareAtPrice === ""
      ? null
      : Math.max(0, Number(data.compareAtPrice) || 0);
  out.shortDescription = String(data.shortDescription ?? "").trim();
  out.description = String(data.description ?? "").trim();
  out.images = (Array.isArray(data.images) ? data.images : [])
    .filter((u) => typeof u === "string" && (IMAGE_URL_RE.test(u) || /^\/(images|seed|brand)\//.test(u)))
    .slice(0, 10);
  out.featured = Boolean(data.featured);
  out.active = data.active === undefined ? true : Boolean(data.active);
  return out;
}

export function productPublic(p) {
  if (!p) return null;
  return {
    _id: String(p._id),
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    shortDescription: p.shortDescription,
    description: p.description,
    images: p.images || [],
    featured: Boolean(p.featured),
    active: Boolean(p.active),
    createdAt: p.createdAt || null,
  };
}

export function promotionPublic(p) {
  if (!p) return null;
  return {
    _id: String(p._id),
    title: p.title || "",
    subtitle: p.subtitle || "",
    linkUrl: p.linkUrl || "",
    image: p.image || "",
    imageId: p.imageId || "",
    active: Boolean(p.active),
    createdAt: p.createdAt || null,
  };
}
