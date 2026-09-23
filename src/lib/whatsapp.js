export function waDigits(num) {
  return String(num || "").replace(/\D/g, "");
}

export function waLink(number, text) {
  const d = waDigits(number);
  return `https://wa.me/${d}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const GENERAL_ENQUIRY = "Hello, I would like to know more about The Perfume Lab's collection.";

/**
 * Builds the pre-filled WhatsApp order message.
 * Format: "Hello, I would like to order this product: [Name] - [Short Description] ([Price])."
 */
export function orderMessage(product, currency = "PKR") {
  const name = product?.name ? String(product.name).trim() : "a fragrance";
  const short = product?.shortDescription ? String(product.shortDescription).trim() : "";
  const n = Number(product?.price);
  const price = Number.isFinite(n) && n > 0 ? `${currency} ${n.toLocaleString("en-US")}` : "";
  const detail = [short, price].filter(Boolean).join(" — ");
  return detail
    ? `Hello, I would like to order this product: ${name} - ${detail}.`
    : `Hello, I would like to order this product: ${name}.`;
}
