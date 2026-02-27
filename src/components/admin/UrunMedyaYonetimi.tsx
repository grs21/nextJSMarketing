"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Media = { id: string; url: string; type: string; order: number };

export function UrunMedyaYonetimi({
  productId,
  media,
}: {
  productId: string;
  media: Media[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(media);
  useEffect(() => setItems(media), [media]);
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<"image" | "video">("image");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/urunler/${productId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl.trim(), type: newType }),
      });
      if (res.ok) {
        setNewUrl("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(mediaId: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/urunler/${productId}/media/${mediaId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setItems((prev) => prev.filter((m) => m.id !== mediaId));
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleAdd} className="flex flex-wrap gap-4">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Görsel veya video URL"
          className="flex-1 min-w-[200px] rounded-md border-2 border-stone-300 px-3 py-2"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as "image" | "video")}
          className="rounded-md border-2 border-stone-300 px-3 py-2"
        >
          <option value="image">Görsel</option>
          <option value="video">Video</option>
        </select>
        <button
          type="submit"
          disabled={loading || !newUrl.trim()}
          className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>
      <div className="flex flex-wrap gap-4">
        {items.map((m) => (
          <div
            key={m.id}
            className="relative rounded-lg border border-stone-200 p-2"
          >
            {m.type === "video" ? (
              <video
                src={m.url}
                className="h-24 w-24 object-cover rounded"
                muted
                playsInline
              />
            ) : (
              <img
                src={m.url}
                alt=""
                className="h-24 w-24 object-cover rounded"
              />
            )}
            <span className="block mt-1 text-xs text-stone-600">
              {m.type === "video" ? "Video" : "Görsel"}
            </span>
            {m.id && (
            <button
              type="button"
              onClick={() => handleRemove(m.id)}
              disabled={loading}
              className="absolute top-1 right-1 h-6 w-6 rounded bg-red-500 text-white text-xs"
            >
              ×
            </button>
          )}
          </div>
        ))}
      </div>
    </div>
  );
}
