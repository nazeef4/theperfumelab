import { getStore } from "@/lib/store/factory";
import { guard, bad, ok } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = guard();
  if (denied) return denied;
  const store = await getStore();
  const settings = await store.getSettings();
  return ok({ settings });
}

export async function PUT(req) {
  const denied = guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid request body.");

  const patch = {};
  if ("whatsappNumber" in body) {
    const digits = String(body.whatsappNumber || "").replace(/\D/g, "");
    if (digits.length < 8) return bad("WhatsApp number must include the country code (8+ digits).");
    patch.whatsappNumber = digits;
  }
  if ("currency" in body) {
    const cur = String(body.currency || "").trim().toUpperCase().slice(0, 6);
    if (!cur) return bad("Currency code is required.");
    patch.currency = cur;
  }

  const store = await getStore();
  const settings = await store.saveSettings(patch);
  return ok({ settings });
}
