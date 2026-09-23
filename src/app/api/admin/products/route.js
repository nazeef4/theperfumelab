import { getStore } from "@/lib/store/factory";
import { guard, bad, ok } from "@/lib/api-guards";
import { productPublic } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = guard();
  if (denied) return denied;
  const store = await getStore();
  const products = await store.listProducts({ includeInactive: true });
  return ok({ products: products.map(productPublic) });
}

export async function POST(req) {
  const denied = guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Invalid request body.");
  if (!String(body.name || "").trim()) return bad("Product name is required.");
  if (!(Number(body.price) >= 0) || body.price === "" || body.price === undefined) {
    return bad("A valid price is required.");
  }

  const store = await getStore();
  const created = await store.createProduct(body);
  return ok({ product: productPublic(created) }, { status: 201 });
}
