import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getStore } from "@/lib/store/factory";
import { signSession, SESSION_COOKIE, sessionCookieOptions, verifySession } from "@/lib/auth";
import { clientIp, bad } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const ip = clientIp(req);
    if (!globalThis.__tplLoginWindow || globalThis.__tplLoginWindow < Date.now()) {
      globalThis.__tplLoginWindow = Date.now() + 5 * 60 * 1000;
      globalThis.__tplLoginCount = {};
    }
    globalThis.__tplLoginCount[ip] = (globalThis.__tplLoginCount[ip] || 0) + 1;
    if (globalThis.__tplLoginCount[ip] > 10) {
      return bad("Too many attempts. Please wait five minutes and try again.", 429);
    }

    const { username, password } = await req.json().catch(() => ({}));
    if (!username || !password) return bad("Username and password are required.");

    const store = await getStore();
    const admin = await store.getAdmin();
    if (!admin) return bad("Administrator account is not initialised.", 500);

    const userOk =
      String(username).trim().toLowerCase() === String(admin.username).toLowerCase();
    const passOk = bcrypt.compareSync(String(password), admin.passwordHash || "");
    if (!userOk || !passOk) {
      await new Promise((r) => setTimeout(r, 600)); // slow brute force
      return bad("Invalid username or password.", 401);
    }

    const token = signSession({ u: admin.username });
    const res = NextResponse.json({ ok: true, username: admin.username });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[login]", err);
    return bad("Sign-in failed. Please try again.", 500);
  }
}
