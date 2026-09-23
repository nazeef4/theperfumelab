"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadFiles } from "@/lib/client-image";
import { toast } from "@/lib/toast";

/**
 * Reusable multi-image uploader.
 * kind: "product" | "poster"
 */
export default function ImageUploader({ value = [], onChange, kind = "product", max = 10, single = false, label }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (single) files.splice(1);
    if (value.length + files.length > max) {
      toast(`You can attach up to ${max} image${max > 1 ? "s" : ""}.`, "error");
      return;
    }
    setBusy(true);
    try {
      const uploaded = await uploadFiles(files, kind);
      onChange(single ? uploaded.slice(0, 1) : [...value, ...uploaded].slice(0, max));
      toast(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded.`);
    } catch (err) {
      toast(err.message || "Upload failed.", "error");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <p className="label">{label}</p>}

      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div
            key={img.url || img}
            className="group relative h-28 w-24 overflow-hidden rounded-xl border border-line bg-sand/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(img.url || img) + (kind === "poster" ? "" : "")}
              alt={`Upload ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== img))}
              aria-label="Remove image"
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {(!single || value.length === 0) && value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`grid h-28 w-24 place-items-center rounded-xl border-2 border-dashed transition ${
              drag ? "border-gold-500 bg-gold-50" : "border-line bg-white hover:border-gold-400 hover:bg-gold-50/50"
            }`}
          >
            {busy ? (
              <Loader2 size={22} className="animate-spin text-gold-500" />
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-ink-muted">
                <ImagePlus size={22} className="text-gold-500" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Add</span>
              </span>
            )}
          </button>
        )}
      </div>

      {single && value.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 transition ${
            drag ? "border-gold-500 bg-gold-50" : "border-line bg-white hover:border-gold-400 hover:bg-gold-50/50"
          }`}
        >
          {busy ? (
            <Loader2 size={22} className="animate-spin text-gold-500" />
          ) : (
            <>
              <ImagePlus size={22} className="text-gold-500" />
              <span className="text-sm text-ink-muted">
                Drop a poster here, or <span className="font-semibold text-gold-700">browse</span>
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={!single}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="mt-2 text-[11px] text-ink-muted">
        JPG, PNG, WebP or GIF · up to 8 MB each{!single && ` · first image is the cover`} · large photos are
        optimised automatically.
      </p>
    </div>
  );
}
