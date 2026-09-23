/**
 * Client-side image preparation before upload.
 * Downscales large photos to keep uploads light (stored in the database),
 * while preserving small transparent PNGs as-is.
 */
export async function prepareUpload(file, { maxDim = 1600, quality = 0.86 } = {}) {
  if (!file.type?.startsWith("image/")) throw new Error(`${file.name || "File"} is not an image`);
  const KEEP_PNG = 1_200_000;
  if (file.type === "image/png" && file.size < KEEP_PNG) return file;
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!blob || blob.size >= file.size) return file;
  const base = (file.name || "image").replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export async function uploadFiles(files, kind = "product") {
  const results = [];
  for (const file of files) {
    const prepared = await prepareUpload(file, kind === "poster" ? { maxDim: 2000, quality: 0.87 } : {});
    const fd = new FormData();
    fd.append("files", prepared);
    fd.append("kind", kind);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Image upload failed");
    if (Array.isArray(data.images)) results.push(...data.images);
  }
  return results;
}
