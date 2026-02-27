"use client";

import { useState } from "react";
import Link from "next/link";
import { CART_REFRESH_EVENT } from "@/components/layout/UserNav";

type Item = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
};

export function SepetIcerigi({
  items,
  total,
}: {
  items: Item[];
  total: number;
}) {
  const [localItems, setLocalItems] = useState(items);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  async function updateQty(itemId: string, quantity: number) {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });
      if (res.ok) {
        setLocalItems((prev) =>
          prev.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          )
        );
        window.dispatchEvent(new CustomEvent(CART_REFRESH_EVENT));
      }
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(itemId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setLocalItems((prev) => prev.filter((i) => i.id !== itemId));
        window.dispatchEvent(new CustomEvent(CART_REFRESH_EVENT));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSiparis(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, phone }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setOrderSuccess(true);
        setLocalItems([]);
        window.dispatchEvent(new CustomEvent(CART_REFRESH_EVENT));
      } else {
        alert(data.message || "Sipariş alınamadı.");
      }
    } catch {
      alert("Bağlantı hatası.");
    }
    setLoading(false);
  }

  if (orderSuccess) {
    return (
      <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <p className="font-semibold text-green-800">Siparişiniz alındı!</p>
        <Link
          href="/urunler"
          className="mt-4 inline-block text-amber-600 hover:underline"
        >
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  const newTotal = localItems.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );

  return (
    <div className="mt-8">
      <div className="space-y-6">
        {localItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-stone-200 bg-white p-4"
          >
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-stone-200">
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-stone-500 text-xs">
                  Görsel yok
                </div>
              )}
            </div>
            <div className="flex-1">
              <Link
                href={`/urunler/${item.productId}`}
                className="font-semibold text-stone-900 hover:text-amber-600"
              >
                {item.product.name}
              </Link>
              <p className="text-amber-600 font-medium">
                {item.product.price.toLocaleString("tr-TR")} ₺
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  disabled={loading || item.quantity <= 1}
                  className="h-8 w-8 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  disabled={loading || item.quantity >= item.product.stock}
                  className="h-8 w-8 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={loading}
                  className="ml-4 text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  Kaldır
                </button>
              </div>
            </div>
            <div className="text-right font-semibold">
              {(item.product.price * item.quantity).toLocaleString("tr-TR")} ₺
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSiparis} className="mt-8 rounded-lg border border-stone-200 bg-stone-50 p-6">
        <h3 className="font-semibold text-stone-900">Teslimat Bilgileri</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Adres
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Telefon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xl font-bold text-stone-900">
            Toplam: {newTotal.toLocaleString("tr-TR")} ₺
          </p>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-amber-600 px-6 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            Siparişi Tamamla
          </button>
        </div>
      </form>
    </div>
  );
}
