import { getStore } from "@/lib/store/factory";
import { guard, ok } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

/** Clears the active poster → frontend falls back to the default brand hero. */
export async function POST() {
  const denied = guard();
  if (denied) return denied;
  const store = await getStore();
  await store.clearActivePromotion();
  return ok({ cleared: true });
}
