"use client";

import { useState } from "react";
import Link from "next/link";
import { CART_REFRESH_EVENT } from "@/components/layout/UserNav";

export function SepeteEkleButton({
  productId,
  productName,
  isLoggedIn,
}: {
  productId: string;
  productName: string;
  isLoggedIn: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <Link
        href={`/giris?redirect=/urunler/${productId}`}
        className="rounded-md bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 transition-colors"
      >
        Sepete Eklemek İçin Giriş Yapın
      </Link>
    );
  }

  async function handleAdd() {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/cart/ekle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        window.dispatchEvent(new CustomEvent(CART_REFRESH_EVENT));
      } else {
        alert(data.message || "Sepete eklenemedi.");
      }
    } catch {
      alert("Bağlantı hatası.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border-2 border-stone-300 rounded-md">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-12 w-12 text-stone-700 hover:bg-stone-100"
        >
          −
        </button>
        <span className="w-12 text-center font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="h-12 w-12 text-stone-700 hover:bg-stone-100"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        className="rounded-md bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Ekleniyor..." : "Sepete Ekle"}
      </button>
      {success && (
        <span className="flex items-center gap-2 text-green-600 font-medium">
          Sepete eklendi!
          <Link href="/sepetim" className="underline hover:text-green-700">
            Sepete git
          </Link>
        </span>
      )}
    </div>
  );
}
