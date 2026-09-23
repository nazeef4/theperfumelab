import mongoose, { Schema } from "mongoose";
import { normalizeProduct } from "../models";
import { DEFAULT_SETTINGS } from "../config";
import { IMAGE_URL_RE } from "../config";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: "Signature", trim: true },
    gender: { type: String, enum: ["Men", "Women", "Unisex"], default: "Unisex", index: true },
    price: { type: Number, default: 0, min: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const promotionSchema = new Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    imageId: { type: String, default: "" },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const settingsSchema = new Schema(
  {
    key: { type: String, unique: true, index: true },
    value: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const imageSchema = new Schema(
  {
    mime: { type: String, default: "image/jpeg" },
    size: { type: Number, default: 0 },
    name: { type: String, default: "" },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

const adminSchema = new Schema(
  {
    username: { type: String, unique: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const toPlain = (doc) => (doc ? JSON.parse(JSON.stringify(doc)) : null);

export class MongoStore {
  constructor(uri) {
    this.uri = uri;
    this.mode = "mongodb";
  }

  async init() {
    mongoose.set("strictQuery", true);
    await mongoose.connect(this.uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });
    this.Product = mongoose.models.Product || mongoose.model("Product", productSchema);
    this.Promotion = mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);
    this.Setting = mongoose.models.Setting || mongoose.model("Setting", settingsSchema);
    this.Image = mongoose.models.PLImage || mongoose.model("PLImage", imageSchema);
    this.Admin = mongoose.models.AdminUser || mongoose.model("AdminUser", adminSchema);
  }

  _ids(urls) {
    return (urls || [])
      .map((u) => IMAGE_URL_RE.exec(u || "")?.[1])
      .filter((id) => id && mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id));
  }

  /* ── products ─────────────────────────────────────────────────────────── */

  async countProducts() {
    return this.Product.countDocuments();
  }

  async listProducts({ includeInactive = false } = {}) {
    const q = includeInactive ? {} : { active: true };
    const docs = await this.Product.find(q).sort({ createdAt: -1 }).lean();
    return docs.map(toPlain);
  }

  async getProductById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    return toPlain(await this.Product.findById(id).lean());
  }

  async getProductBySlug(slug) {
    return toPlain(await this.Product.findOne({ slug }).lean());
  }

  async _uniqueSlug(base, exceptId = null) {
    const b = base || "product";
    const q = { slug: b };
    if (exceptId) q._id = { $ne: exceptId };
    let s = b;
    let i = 2;
    while (await this.Product.exists(q)) {
      s = `${b}-${i++}`;
      q.slug = s;
    }
    return s;
  }

  async createProduct(data) {
    const doc = normalizeProduct(data);
    doc.slug = await this._uniqueSlug(doc.slug);
    const created = await this.Product.create(doc);
    return toPlain(created);
  }

  async updateProduct(id, patch) {
    if (!mongoose.isValidObjectId(id)) return null;
    const prev = await this.Product.findById(id).lean();
    if (!prev) return null;
    const merged = normalizeProduct({ ...toPlain(prev), ...patch });
    if (merged.slug !== prev.slug) merged.slug = await this._uniqueSlug(merged.slug, prev._id);
    merged.updatedAt = new Date();
    const updated = await this.Product.findByIdAndUpdate(id, { $set: merged }, { new: true }).lean();
    return toPlain(updated);
  }

  async deleteProduct(id) {
    if (!mongoose.isValidObjectId(id)) return false;
    const doc = await this.Product.findById(id).lean();
    if (!doc) return false;
    const ids = this._ids(doc.images);
    if (ids.length) await this.Image.deleteMany({ _id: { $in: ids } });
    await this.Product.findByIdAndDelete(id);
    return true;
  }

  /* ── promotions ───────────────────────────────────────────────────────── */

  async countPromotions() {
    return this.Promotion.countDocuments();
  }

  async listPromotions() {
    const docs = await this.Promotion.find().sort({ createdAt: -1 }).lean();
    return docs
      .map(toPlain)
      .sort((a, b) => Number(b.active) - Number(a.active));
  }

  async getActivePromotion() {
    return toPlain(await this.Promotion.findOne({ active: true }).lean());
  }

  async createPromotion({ title, subtitle, linkUrl, image, imageId }) {
    const created = await this.Promotion.create({
      title: String(title || "").trim(),
      subtitle: String(subtitle || "").trim(),
      linkUrl: String(linkUrl || "").trim(),
      image: image || "",
      imageId: imageId || "",
      active: false,
    });
    return toPlain(created);
  }

  async updatePromotion(id, patch) {
    if (!mongoose.isValidObjectId(id)) return null;
    const $set = {};
    if (patch.active === true) await this.Promotion.updateMany({}, { $set: { active: false } });
    for (const k of ["title", "subtitle", "linkUrl"]) if (k in patch) $set[k] = String(patch[k] || "").trim();
    if ("active" in patch) $set.active = Boolean(patch.active);
    return toPlain(await this.Promotion.findByIdAndUpdate(id, { $set }, { new: true }).lean());
  }

  async deletePromotion(id) {
    if (!mongoose.isValidObjectId(id)) return false;
    const doc = await this.Promotion.findById(id).lean();
    if (!doc) return false;
    const imgId = IMAGE_URL_RE.exec(doc.image || "")?.[1];
    if (imgId && mongoose.isValidObjectId(imgId)) await this.Image.deleteOne({ _id: imgId });
    await this.Promotion.findByIdAndDelete(id);
    return true;
  }

  async clearActivePromotion() {
    await this.Promotion.updateMany({}, { $set: { active: false } });
    return true;
  }

  /* ── settings ─────────────────────────────────────────────────────────── */

  async getSettings() {
    const doc = await this.Setting.findOne({ key: "site" }).lean();
    return { ...DEFAULT_SETTINGS, ...((doc && doc.value) || {}) };
  }

  async saveSettings(patch) {
    const value = { ...(await this.getSettings()), ...patch };
    await this.Setting.findOneAndUpdate({ key: "site" }, { $set: { value } }, { upsert: true });
    return value;
  }

  /* ── admin user ───────────────────────────────────────────────────────── */

  async getAdmin() {
    return toPlain(await this.Admin.findOne().lean());
  }

  async setAdmin({ username, passwordHash }) {
    await this.Admin.findOneAndUpdate({}, { $set: { username, passwordHash } }, { upsert: true });
    return { username };
  }

  /* ── images ───────────────────────────────────────────────────────────── */

  async putImage({ buffer, mime, name }) {
    const doc = await this.Image.create({ buffer, mime: mime || "image/jpeg", size: buffer.length, name: name || "" });
    const id = String(doc._id);
    return { id, url: `/api/images/${id}` };
  }

  async getImage(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await this.Image.findById(id).lean();
    if (!doc) return null;
    return { buffer: Buffer.from(doc.data), mime: doc.mime || "image/jpeg" };
  }
}
