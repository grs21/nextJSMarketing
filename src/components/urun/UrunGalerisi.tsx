"use client";

import { useState } from "react";

type Media = { id: string; url: string; type: string; order: number };

export function UrunGalerisi({
  media,
  fallbackImage,
}: {
  media: Media[];
  fallbackImage?: string | null;
}) {
  const items = [...media].sort((a, b) => a.order - b.order);
  const hasMedia = items.length > 0 || fallbackImage;
  const [selected, setSelected] = useState(0);

  const displayItems =
    items.length > 0
      ? items
      : fallbackImage
      ? [{ id: "main", url: fallbackImage, type: "image", order: 0 }]
      : [];

  if (!hasMedia) {
    return (
      <div className="aspect-[4/5] flex items-center justify-center bg-stone-200 rounded-lg">
        <span className="text-stone-600 font-medium">Görsel yok</span>
      </div>
    );
  }

  const current = displayItems[selected];

  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-stone-200">
        {current?.type === "video" ? (
          <video
            src={current.url}
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={current?.url}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {displayItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayItems.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-colors ${
                selected === i
                  ? "border-amber-600"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-stone-300">
                  <span className="text-2xl">▶</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
