import { getStore } from "@/lib/store/factory";
import { guard, bad, ok } from "@/lib/api-guards";
import { promotionPublic } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = guard();
  if (denied) return denied;
  const store = await getStore();
  const promotions = await store.listPromotions();
  return ok({ promotions: promotions.map(promotionPublic) });
}

export async function POST(req) {
  const denied = guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Invalid request body.");
  if (!body.image) return bad("Please upload a poster image first.");

  const store = await getStore();
  const created = await store.createPromotion(body);
  return ok({ promotion: promotionPublic(created) }, { status: 201 });
}
