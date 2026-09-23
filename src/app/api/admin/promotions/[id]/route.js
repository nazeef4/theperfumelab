import { getStore } from "@/lib/store/factory";
import { guard, bad, ok } from "@/lib/api-guards";
import { promotionPublic } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const denied = guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Invalid request body.");

  const store = await getStore();
  const updated = await store.updatePromotion(params.id, body);
  if (!updated) return bad("Promotion not found.", 404);
  return ok({ promotion: promotionPublic(updated) });
}

export async function DELETE(req, { params }) {
  const denied = guard();
  if (denied) return denied;
  const store = await getStore();
  const removed = await store.deletePromotion(params.id);
  if (!removed) return bad("Promotion not found.", 404);
  return ok({ deleted: params.id });
}
