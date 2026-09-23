import { getStore } from "@/lib/store/factory";
import { guard, bad, ok } from "@/lib/api-guards";
import { productPublic } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const denied = guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Invalid request body.");
  if ("name" in body && !String(body.name || "").trim()) return bad("Product name cannot be empty.");

  const store = await getStore();
  const updated = await store.updateProduct(params.id, body);
  if (!updated) return bad("Product not found.", 404);
  return ok({ product: productPublic(updated) });
}

export async function DELETE(req, { params }) {
  const denied = guard();
  if (denied) return denied;
  const store = await getStore();
  const removed = await store.deleteProduct(params.id);
  if (!removed) return bad("Product not found.", 404);
  return ok({ deleted: params.id });
}
