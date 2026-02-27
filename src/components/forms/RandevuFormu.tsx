"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
};

export function RandevuFormu() {
  const searchParams = useSearchParams();
  const presetProduct = searchParams.get("urun") || "";

  const [slots, setSlots] = useState<Slot[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    presetProduct ? [presetProduct] : []
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [slotsRes, productsRes] = await Promise.all([
          fetch("/api/randevu/slotlar"),
          fetch("/api/urunler"),
        ]);
        const slotsData = await slotsRes.json();
        const productsData = await productsRes.json();
        if (slotsData.slots) setSlots(slotsData.slots.filter((s: Slot) => s.available));
        if (productsData.products)
          setProducts(
            productsData.products.map((p: { id: string; name: string }) => ({
              id: p.id,
              name: p.name,
            }))
          );
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const slotId = formData.get("slotId") as string;
    if (!slotId) {
      setErrorMsg("Lütfen bir randevu slotu seçin.");
      setStatus("error");
      return;
    }

    const data = {
      slotId,
      customerName: formData.get("customerName") as string,
      customerEmail: formData.get("customerEmail") as string,
      customerPhone: formData.get("customerPhone") as string,
      productIds: selectedProductIds,
      paymentMethod: formData.get("paymentMethod") as string,
    };

    try {
      const res = await fetch("/api/randevu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(json.message || "Bir hata oluştu.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setSelectedProductIds([]);
    } catch {
      setErrorMsg("Bağlantı hatası.");
      setStatus("error");
    }
  }

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  if (loading) return <p className="text-zinc-600">Yükleniyor...</p>;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Randevu Slotu *
        </label>
        <select
          name="slotId"
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        >
          <option value="">Seçiniz</option>
          {slots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.date} {s.startTime}-{s.endTime} — {s.price.toLocaleString("tr-TR")} ₺
            </option>
          ))}
        </select>
        {slots.length === 0 && (
          <p className="mt-2 text-sm text-amber-600">
            Şu anda müsait randevu slotu bulunmuyor.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Denemek İstediğiniz Ürünler
        </label>
        <div className="mt-2 max-h-40 space-y-2 overflow-y-auto rounded border border-zinc-200 p-2">
          {products.map((p) => (
            <label key={p.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedProductIds.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-zinc-700">
          Ad Soyad *
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium text-zinc-700">
          E-posta *
        </label>
        <input
          id="customerEmail"
          name="customerEmail"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium text-zinc-700">
          Telefon *
        </label>
        <input
          id="customerPhone"
          name="customerPhone"
          type="tel"
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-zinc-700">
          Ödeme Yöntemi
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        >
          <option value="kapida">Kapıda Öde</option>
          <option value="havale">Havale</option>
          <option value="kredi_karti">Kredi Kartı</option>
        </select>
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
      {status === "success" && (
        <p className="text-sm text-green-600">
          Randevunuz alındı. En kısa sürede size dönüş yapacağız.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || slots.length === 0}
        className="w-full rounded-md bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
      >
        {status === "loading" ? "Gönderiliyor..." : "Randevu Al"}
      </button>
    </form>
  );
}
