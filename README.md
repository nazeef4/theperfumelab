# The Perfume Lab — Luxury Fragrance E-Commerce & Promotional Platform

A fully professional, responsive web application for the premium fragrance brand **The Perfume Lab** — a sleek white & gold customer storefront with **WhatsApp-based checkout**, paired with a secure **admin dashboard** for products, promotional banners and settings.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248)

---

## ✨ Features

### Customer Storefront
- **Zero-friction browsing** — no login or account required to browse or order.
- **Dynamic promotional banner** — the hero displays the poster the admin sets live (sale / event). If nothing is active, a high-quality **default brand hero** renders automatically, so the layout never looks empty. Posters without an image get an elegant typographic gold banner.
- **Product showcase** — cards with hover galleries (arrows + swipe on mobile), discount badges, category, price with compare-at strike-through, and beautifully formatted long-form descriptions (note pyramids etc.) on a dedicated product page with thumbnail gallery.
- **WhatsApp checkout** — every **Buy Now / Order on WhatsApp** button opens `wa.me` with a pre-filled message:
  > `Hello, I would like to order this product: [Product Name] - [Short Description] — [Price].`
- Luxury **white & gold** design system (Cormorant Garamond display serif + Inter), marquee announcements, atelier/story sections, mobile drawer navigation, custom 404.

### Admin Dashboard (`/admin`)
- **Secure login** — bcrypt-hashed credentials, HMAC-signed httpOnly session cookie (7 days), timing-safe verification, login rate-limiting, `noindex`.
- **Products CRUD** — add/edit/delete products with **multi-image upload** (drag & drop, client-side optimisation, first image = cover), price + compare-at price, category, short & long description, **Signature** highlight flag and **Visible/Hidden** visibility toggle.
- **Promotions & Events manager** — upload posters, add headline/subheadline/CTA link, **set one live** with a single toggle (previous is auto-demoted), delete, or **clear the selection** to restore the default brand hero.
- **Settings** — change the WhatsApp order number and currency; **change administrator password** in-place.

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

First boot auto-seeds: the admin account, 6 demo fragrances (with imagery), one live demo banner and default settings.

| What | Value |
|---|---|
| Storefront | `/` · `/shop` · `/product/[slug]` |
| Admin login | `/admin` |
| Default username | `admin` |
| Default password | `PerfumeLab@2026` *(from `ADMIN_PASSWORD` — change it in **Admin → Settings**)* |

> Change the admin password immediately in a real deployment.

## ⚙️ Environment

Copy `.env.example` → `.env.local` (all variables optional for local demo):

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string. **When set, everything (including uploaded images) is stored in MongoDB.** When omitted, a zero-setup file store at `./.data` is used. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | First-run admin credentials (seeded once). |
| `SESSION_SECRET` | Secret for signing admin session cookies — **must be set in production**. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Initial WhatsApp number (digits with country code). |
| `NEXT_PUBLIC_CURRENCY` | Initial currency code (e.g. `PKR`). |
| `DATA_DIR` | Where the file store keeps its data (default `./.data`). |

## 🗄️ Data & Image Storage

The app ships with two interchangeable stores behind one interface (`src/lib/store/factory.js`):

- **MongoDB (recommended for production)** — Mongoose models for products, promotions, settings, admin user, and images (GridFS-style binary collection, served via `/api/images/[id]` with immutable caching).
- **Built-in file store (zero setup)** — atomic JSON database + image files under `./.data` (git-ignored). Perfect for local development and demos.

Uploaded images are validated (type + 8 MB limit) and optimised in the browser before upload.

## 📁 Structure

```
src/
├─ app/
│  ├─ (storefront)/          # public pages: home, shop, product/[slug]
│  ├─ admin/                 # protected dashboard (login + management)
│  ├─ api/
│  │  ├─ images/[id]/        # image delivery
│  │  ├─ products/           # public catalogue
│  │  ├─ promotions/active/  # public live banner
│  │  └─ admin/              # guarded: login/logout/session/password,
│  │                         # products CRUD, promotions CRUD + clear,
│  │                         # upload, settings
│  ├─ layout.jsx  globals.css  icon.svg  not-found.jsx
├─ components/               # Navbar, Footer, HeroBanner, ProductCard,
│  │                         # ProductDetail, Toaster, Monogram
│  └─ admin/                 # AdminLogin, AdminDashboard, ProductsManager,
│                            # ProductForm, PromotionsManager, SettingsPanel
└─ lib/                      # auth (sessions), store (file+mongo), seed,
                             # whatsapp helpers, models, formatting
```

## 🚢 Production Deployment

1. Provision **MongoDB Atlas** (free tier is fine) and set `MONGODB_URI`.
2. Set `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
3. `npm run build && npm start` (or deploy to Vercel/Render/any Node host).
4. Sign in at `/admin` → change the password → set the real WhatsApp number.

## 🧪 Verified End-to-End

Auth guards (401s), bad/good login, session, rate limiting, product create/read/update/delete with slug de-duplication and hidden-product filtering, multi-image upload with type validation, image round-trip serving, promotion activate/auto-demote/clear + default-hero fallback, orphan-image cleanup on delete, settings validation, password change, and all customer pages — all passing.
