import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import { BRAND } from "@/lib/config";

export const metadata = {
  title: {
    default: `${BRAND.name} — Luxury Fragrances`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "The Perfume Lab — handcrafted luxury fragrances. Explore our signature collection of oriental, floral, woody and fresh blends and order instantly on WhatsApp.",
  keywords: ["perfume", "fragrance", "luxury", "oud", "attar", "The Perfume Lab"],
};

export const viewport = {
  themeColor: "#FAF6EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
