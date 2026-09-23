import bcrypt from "bcryptjs";
import { getStore } from "@/lib/store/factory";
import { guard, bad, ok } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const denied = guard();
  if (denied) return denied;

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (!currentPassword || !newPassword) return bad("Both fields are required.");
  if (String(newPassword).length < 8) return bad("New password must be at least 8 characters.");

  const store = await getStore();
  const admin = await store.getAdmin();
  if (!admin) return bad("Administrator account missing.", 500);
  if (!bcrypt.compareSync(String(currentPassword), admin.passwordHash || "")) {
    return bad("Current password is incorrect.", 401);
  }
  await store.setAdmin({ username: admin.username, passwordHash: bcrypt.hashSync(String(newPassword), 10) });
  return ok({ message: "Password updated successfully." });
}
