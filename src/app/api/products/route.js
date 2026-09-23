import { NextResponse } from "next/server";
import { getStore } from "@/lib/store/factory";
import { productPublic } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const includeInactive = searchParams.get("all") === "1";
  const store = await getStore();
  const products = await store.listProducts({ includeInactive });
  return NextResponse.json({ products: products.map(productPublic) });
}
