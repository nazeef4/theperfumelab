import { NextResponse } from "next/server";
import { getStore } from "@/lib/store/factory";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { id } = params;
  // basic id shape check
  if (!/^[\w-]{6,80}$/.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const store = await getStore();
  const img = await store.getImage(id);
  if (!img) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(img.buffer, {
    status: 200,
    headers: {
      "Content-Type": img.mime,
      "Content-Length": String(img.buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
