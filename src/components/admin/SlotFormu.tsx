"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SlotFormu() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      price: parseFloat(formData.get("price") as string),
    };

    try {
      const res = await fetch("/api/admin/slotlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Tarih</label>
        <input
          name="date"
          type="date"
          required
          min={today}
          className="mt-1 rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Başlangıç</label>
        <input
          name="startTime"
          type="time"
          required
          className="mt-1 rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Bitiş</label>
        <input
          name="endTime"
          type="time"
          required
          className="mt-1 rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Ücret (₺)</label>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue="100"
          className="mt-1 rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Ekleniyor..." : "Ekle"}
        </button>
      </div>
    </form>
  );
}
