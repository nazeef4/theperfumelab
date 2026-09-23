export function formatPrice(price, currency = "PKR") {
  const n = Number(price || 0);
  return `${currency} ${n.toLocaleString("en-US")}`;
}

export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
