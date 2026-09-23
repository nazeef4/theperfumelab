import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { normalizeProduct } from "./models";
import { DEFAULT_SETTINGS } from "./config";

const SEED_DIR = path.join(process.cwd(), "public", "seed");

const SEED_PRODUCTS = [
  {
    name: "Amber Oud",
    category: "Oriental",
    price: 8500,
    compareAtPrice: 10000,
    shortDescription: "Smoky oud wrapped in warm amber, vanilla and golden resins.",
    description:
      "Amber Oud is our homage to the great oriental classics — a smouldering, golden fragrance that opens bright and settles into pure warmth.\n\nTop Notes — Saffron, Bergamot, Pink Pepper\nHeart Notes — Smoked Oud, Rose Absolute, Amber\nBase Notes — Vanilla Bean, Sandalwood, White Musk\n\nHand-blended in small batches and rested for 21 days, it unfolds slowly on the skin and lingers for 8–10 hours. Best worn on cool evenings and occasions that matter.",
    imageFile: "amber-oud.jpg",
    featured: true,
  },
  {
    name: "Rose Élixir",
    category: "Floral",
    price: 7200,
    compareAtPrice: null,
    shortDescription: "Damask rose and peony over a creamy cashmeran bed.",
    description:
      "A modern romance in a bottle. Rose Élixir captures Damask rose at first bloom, lifted with juicy lychee and cradled by soft, creamy woods.\n\nTop Notes — Lychee, Bergamot, Blackcurrant\nHeart Notes — Damask Rose, Peony, Magnolia\nBase Notes — Cashmeran, Creamy Musk, Amber\n\nEffortlessly feminine and endlessly compliment-worthy — a signature for daytime romance and golden-hour evenings alike.",
    imageFile: "rose-elixir.jpg",
    featured: true,
  },
  {
    name: "Musk Royale",
    category: "Musky",
    price: 6500,
    compareAtPrice: null,
    shortDescription: "Pure white musk layered with orris and soft powder.",
    description:
      "Clean, luminous and quietly luxurious. Musk Royale is the scent of fresh linen, warm skin and understated elegance.\n\nTop Notes — Iris, Aldehydes, Bergamot\nHeart Notes — White Musk, Orris Butter, Cotton Flower\nBase Notes — Sandalwood, Tonka Bean, Vanilla Husk\n\nA gentle projector that stays close and comfortingly present — your everyday veil of refinement.",
    imageFile: "musk-royale.jpg",
    featured: false,
  },
  {
    name: "Noir Intense",
    category: "Woody",
    price: 9500,
    compareAtPrice: 11000,
    shortDescription: "Black leather, spice and vetiver for the bold.",
    description:
      "Noir Intense is confidence distilled — dark, magnetic and unapologetically bold.\n\nTop Notes — Black Pepper, Cardamom, Bergamot Noir\nHeart Notes — Black Leather, Tobacco Flower, Vetiver\nBase Notes — Smoked Woods, Amberwood, Dark Chocolate\n\nA commanding evening fragrance with exceptional depth and a trail that arrives before you do.",
    imageFile: "noir-intense.jpg",
    featured: true,
  },
  {
    name: "Citrus d'Or",
    category: "Fresh",
    price: 5800,
    compareAtPrice: null,
    shortDescription: "Sparkling bergamot, neroli and golden amber.",
    description:
      "Sunlight in a flacon. Citrus d'Or sparkles with Mediterranean bergamot and neroli, then melts into a warm golden drydown.\n\nTop Notes — Sicilian Bergamot, Lemon Zest, Neroli\nHeart Notes — Green Tea, Jasmine Petals, Petitgrain\nBase Notes — Golden Amber, Pale Woods, White Musk\n\nBright, polished and universally loved — the perfect daily signature for work and weekend.",
    imageFile: "citrus-dor.jpg",
    featured: false,
  },
  {
    name: "Sultan's Oud",
    category: "Oriental",
    price: 12000,
    compareAtPrice: null,
    shortDescription: "Royal oud, Turkish rose and saffron in an ornate flacon.",
    description:
      "Our crown jewel. Sultan's Oud is a regal composition of primal oud and Turkish rose, fit for the most discerning connoisseurs.\n\nTop Notes — Saffron, Cinnamon, Nutmeg\nHeart Notes — Turkish Rose, Primal Oud, Patchouli\nBase Notes — Amber, Leather, Frankincense\n\nPresented in an ornate hand-finished flacon, it makes an extraordinary gift and an unforgettable personal signature. Extremely limited quantities.",
    imageFile: "sultans-oud.jpg",
    featured: true,
  },
];

async function seedImage(store, file) {
  const buffer = await fs.readFile(path.join(SEED_DIR, file));
  const { url, id } = await store.putImage({ buffer, mime: "image/jpeg", name: file });
  return { url, id };
}

export async function ensureAdmin(store) {
  const existing = await store.getAdmin();
  if (existing) return;
  const username = (process.env.ADMIN_USERNAME || "admin").trim();
  const password = process.env.ADMIN_PASSWORD || "PerfumeLab@2026";
  await store.setAdmin({ username, passwordHash: bcrypt.hashSync(password, 10) });
  console.log(`[seed] Administrator account created → username: "${username}"`);
}

export async function ensureSeeded(store) {
  await ensureAdmin(store);
  try {
    if ((await store.countProducts()) > 0) return;

    console.log("[seed] Empty store detected — seeding demo catalogue…");
    for (const p of SEED_PRODUCTS) {
      const { url } = await seedImage(store, p.imageFile);
      await store.createProduct(
        normalizeProduct({
          name: p.name,
          category: p.category,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          shortDescription: p.shortDescription,
          description: p.description,
          images: [url],
          featured: p.featured,
          active: true,
        })
      );
    }

    const { url: posterUrl } = await seedImage(store, "promo-poster.jpg");
    const promo = await store.createPromotion({
      title: "The Festive Edit — Up to 25% Off",
      subtitle: "Celebrate the season with our limited-edition festive fragrances.",
      linkUrl: "/shop",
      image: posterUrl,
      imageId: posterUrl.split("/").pop(),
      active: true,
    });
    // posters are created inactive by design — activate the demo one
    await store.updatePromotion(promo._id, { active: true });

    await store.saveSettings({ ...DEFAULT_SETTINGS });
    console.log(`[seed] Seeded ${SEED_PRODUCTS.length} products, 1 promotion and default settings.`);
  } catch (err) {
    console.error("[seed] Seeding failed:", err);
  }
}
