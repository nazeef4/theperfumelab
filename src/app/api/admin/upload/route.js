import { getStore } from "@/lib/store/factory";
import { guard, bad, ok } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per image

export async function POST(req) {
  const denied = guard();
  if (denied) return denied;

  let form;
  try {
    form = await req.formData();
  } catch {
    return bad("Expected multipart form data.");
  }

  const files = form.getAll("files").filter((f) => typeof f === "object" && f?.arrayBuffer);
  if (!files.length) return bad("No image files received.");

  const store = await getStore();
  const images = [];
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return bad(`"${file.name}" has an unsupported type (${file.type || "unknown"}).`);
    }
    if (file.size > MAX_BYTES) {
      return bad(`"${file.name}" is larger than 8 MB.`);
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const { id, url } = await store.putImage({
      buffer,
      mime: file.type,
      name: file.name || "",
    });
    images.push({ id, url });
  }

  return ok({ images });
}
