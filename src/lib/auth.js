import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "tpl_session";
const DAY = 60 * 60 * 24;
const MAX_AGE = 7 * DAY;

function secret() {
  return process.env.SESSION_SECRET || "the-perfume-lab-dev-secret-do-not-use-in-prod";
}

export function signSession(payload, maxAgeSec = MAX_AGE) {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeSec })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSession() {
  try {
    const jar = cookies();
    return verifySession(jar.get(SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

export function requireAdmin() {
  const s = getSession();
  return s ? { username: s.u } : null;
}

export function sessionCookieOptions(maxAgeSec = MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  };
}
