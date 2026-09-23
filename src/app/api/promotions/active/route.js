import { NextResponse } from "next/server";
import { getStore } from "@/lib/store/factory";
import { promotionPublic } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  const promo = await store.getActivePromotion();
  return NextResponse.json({ promotion: promotionPublic(promo) });
}
