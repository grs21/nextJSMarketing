"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
};

export function UrunFormu({ product }: { product?: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin (JPG, PNG, GIF, WebP).");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Yükleme başarısız.");
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string, 10),
      imageUrl: imageUrl || (formData.get("imageUrl") as string) || null,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const url = product
        ? `/api/admin/urunler/${product.id}`
        : "/api/admin/urunler";
      const method = product ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || "Hata oluştu.");
        setLoading(false);
        return;
      }

      router.push("/admin/urunler");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-800">Ad *</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800">Açıklama</label>
        <textarea
          name="description"
          defaultValue={product?.description || ""}
          rows={3}
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800">Fiyat (₺) *</label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.price}
          required
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800">Stok *</label>
        <input
          name="stock"
          type="number"
          min="0"
          defaultValue={product?.stock}
          required
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-800">Ürün Görseli</label>
        <div className="mt-2 space-y-4 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-6">
          <div className="flex flex-wrap gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="cursor-pointer rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {uploading ? "Yükleniyor..." : "Görsel Yükle"}
            </button>
            <span className="text-sm text-stone-600">veya URL girin:</span>
            <input
              name="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 min-w-[200px] rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
            />
          </div>
          {imageUrl && (
            <div className="mt-2">
              <p className="mb-2 text-sm font-medium text-stone-700">Önizleme:</p>
              <img
                src={imageUrl}
                alt="Önizleme"
                className="h-32 w-32 rounded-lg object-cover border border-stone-200"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Görseli Kaldır
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={product?.isActive ?? true}
          />
          <span className="text-sm font-medium text-stone-800">Aktif (yayında)</span>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <Link
          href="/admin/urunler"
          className="rounded-md border border-zinc-300 px-4 py-2 font-medium text-stone-800 hover:bg-zinc-50"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
