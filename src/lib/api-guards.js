import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

/** Guard helper for API routes: returns a 401 response when not signed in, else null. */
export function guard() {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in as an administrator." },
      { status: 401 }
    );
  }
  return null;
}

export function bad(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function ok(data = {}, { status = 200 } = {}) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : "") || req.headers.get("x-real-ip") || "local";
}
