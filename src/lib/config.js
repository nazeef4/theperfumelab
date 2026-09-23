export const BRAND = {
  name: "The Perfume Lab",
  short: "Perfume Lab",
  tagline: "Where fragrance becomes art",
  email: "hello@theperfumelab.pk",
  city: "Lahore, Pakistan",
  instagram: "https://instagram.com/theperfumelab",
  facebook: "https://facebook.com/theperfumelab",
};

export const DEFAULT_SETTINGS = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "PKR",
};

export const IMAGE_URL_RE = /^\/api\/images\/([\w-]+)$/;
