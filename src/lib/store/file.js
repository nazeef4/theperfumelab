import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { normalizeProduct } from "../models";
import { DEFAULT_SETTINGS } from "../config";
import { IMAGE_URL_RE } from "../config";

/**
 * Zero-setup persistent store: JSON database + image files under a data dir.
 * All writes are serialized through a promise queue and persisted atomically.
 */
export class FileStore {
  constructor() {
    this.dir = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), ".data"));
    this.dbFile = path.join(this.dir, "db.json");
    this.imagesDir = path.join(this.dir, "images");
    this.db = { products: [], promotions: [], settings: {}, admin: null, images: {} };
    this._queue = Promise.resolve();
  }

  get mode() {
    return "file";
  }

  async init() {
    await fs.mkdir(this.imagesDir, { recursive: true });
    try {
      const parsed = JSON.parse(await fs.readFile(this.dbFile, "utf8"));
      this.db = {
        products: Array.isArray(parsed.products) ? parsed.products : [],
        promotions: Array.isArray(parsed.promotions) ? parsed.promotions : [],
        settings: parsed.settings || {},
        admin: parsed.admin || null,
        images: parsed.images || {},
      };
    } catch {
      /* first run */
    }
  }

  _mutate(fn) {
    const run = this._queue.then(async () => {
      const result = await fn();
      const tmp = `${this.dbFile}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(this.db));
      await fs.rename(tmp, this.dbFile);
      return result;
    });
    this._queue = run.catch(() => {});
    return run;
  }

  /* ── products ─────────────────────────────────────────────────────────── */

  async countProducts() {
    return this.db.products.length;
  }

  async listProducts({ includeInactive = false } = {}) {
    return [...this.db.products]
      .filter((p) => includeInactive || p.active)
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }

  async getProductById(id) {
    return this.db.products.find((p) => p._id === id) || null;
  }

  async getProductBySlug(slug) {
    return this.db.products.find((p) => p.slug === slug) || null;
  }

  async createProduct(data) {
    return this._mutate(() => {
      const doc = normalizeProduct(data);
      doc._id = crypto.randomUUID();
      doc.slug = this._uniqueSlug(doc.slug);
      const now = new Date().toISOString();
      doc.createdAt = now;
      doc.updatedAt = now;
      this.db.products.push(doc);
      return { ...doc };
    });
  }

  async updateProduct(id, patch) {
    return this._mutate(() => {
      const idx = this.db.products.findIndex((p) => p._id === id);
      if (idx === -1) return null;
      const prev = this.db.products[idx];
      const merged = normalizeProduct({ ...prev, ...patch });
      merged._id = id;
      merged.createdAt = prev.createdAt;
      if (merged.slug !== prev.slug) merged.slug = this._uniqueSlug(merged.slug, id);
      merged.updatedAt = new Date().toISOString();
      this.db.products[idx] = merged;
      return { ...merged };
    });
  }

  async deleteProduct(id) {
    return this._mutate(() => {
      const idx = this.db.products.findIndex((p) => p._id === id);
      if (idx === -1) return false;
      const [removed] = this.db.products.splice(idx, 1);
      for (const url of removed.images || []) this._removeImageByUrl(url);
      return true;
    });
  }

  _uniqueSlug(slug, exceptId = null) {
    const base = slug || "product";
    const taken = (s) => this.db.products.some((p) => p.slug === s && p._id !== exceptId);
    let s = base;
    let i = 2;
    while (taken(s)) s = `${base}-${i++}`;
    return s;
  }

  _removeImageByUrl(url) {
    const m = IMAGE_URL_RE.exec(url || "");
    if (!m) return;
    const id = m[1];
    if (this.db.images[id]) {
      delete this.db.images[id];
      fs.unlink(path.join(this.imagesDir, id)).catch(() => {});
    }
  }

  /* ── promotions ───────────────────────────────────────────────────────── */

  async countPromotions() {
    return this.db.promotions.length;
  }

  async listPromotions() {
    return [...this.db.promotions].sort(
      (a, b) => Number(b.active) - Number(a.active) ||
        String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
    );
  }

  async getActivePromotion() {
    return this.db.promotions.find((p) => p.active) || null;
  }

  async createPromotion({ title, subtitle, linkUrl, image, imageId }) {
    return this._mutate(() => {
      const promo = {
        _id: crypto.randomUUID(),
        title: String(title || "").trim(),
        subtitle: String(subtitle || "").trim(),
        linkUrl: String(linkUrl || "").trim(),
        image: image || "",
        imageId: imageId || "",
        active: false,
        createdAt: new Date().toISOString(),
      };
      this.db.promotions.push(promo);
      return { ...promo };
    });
  }

  async updatePromotion(id, patch) {
    return this._mutate(() => {
      const promo = this.db.promotions.find((p) => p._id === id);
      if (!promo) return null;
      if (patch.active === true) this.db.promotions.forEach((p) => (p.active = false));
      if ("title" in patch) promo.title = String(patch.title || "").trim();
      if ("subtitle" in patch) promo.subtitle = String(patch.subtitle || "").trim();
      if ("linkUrl" in patch) promo.linkUrl = String(patch.linkUrl || "").trim();
      if ("active" in patch) promo.active = Boolean(patch.active);
      promo.updatedAt = new Date().toISOString();
      return { ...promo };
    });
  }

  async deletePromotion(id) {
    return this._mutate(() => {
      const idx = this.db.promotions.findIndex((p) => p._id === id);
      if (idx === -1) return false;
      const [removed] = this.db.promotions.splice(idx, 1);
      this._removeImageByUrl(removed.image);
      return true;
    });
  }

  async clearActivePromotion() {
    return this._mutate(() => {
      this.db.promotions.forEach((p) => (p.active = false));
      return true;
    });
  }

  /* ── settings ─────────────────────────────────────────────────────────── */

  async getSettings() {
    return { ...DEFAULT_SETTINGS, ...this.db.settings };
  }

  async saveSettings(patch) {
    return this._mutate(() => {
      this.db.settings = { ...this.db.settings, ...patch };
      return { ...this.db.settings };
    });
  }

  /* ── admin user ───────────────────────────────────────────────────────── */

  async getAdmin() {
    return this.db.admin;
  }

  async setAdmin({ username, passwordHash }) {
    return this._mutate(() => {
      this.db.admin = { username, passwordHash };
      return { username };
    });
  }

  /* ── images ───────────────────────────────────────────────────────────── */

  async putImage({ buffer, mime, name }) {
    const id = crypto.randomUUID();
    await fs.writeFile(path.join(this.imagesDir, id), buffer);
    return this._mutate(() => {
      this.db.images[id] = {
        mime: mime || "image/jpeg",
        size: buffer.length,
        name: name || "",
        createdAt: new Date().toISOString(),
      };
      return { id, url: `/api/images/${id}` };
    });
  }

  async getImage(id) {
    const meta = this.db.images[id];
    if (!meta) return null;
    try {
      const buffer = await fs.readFile(path.join(this.imagesDir, id));
      return { buffer, mime: meta.mime || "image/jpeg" };
    } catch {
      return null;
    }
  }
}
