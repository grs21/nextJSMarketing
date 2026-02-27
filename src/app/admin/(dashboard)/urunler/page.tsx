import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminUrunlerPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Ürünler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-md bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700"
        >
          Yeni Ürün
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border border-zinc-200">
          <thead>
            <tr className="bg-zinc-50">
              <th className="border border-zinc-200 px-4 py-2 text-left">Ad</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Fiyat</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Stok</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Durum</th>
              <th className="border border-zinc-200 px-4 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="border border-zinc-200 px-4 py-2">{p.name}</td>
                <td className="border border-zinc-200 px-4 py-2">
                  {p.price.toLocaleString("tr-TR")} ₺
                </td>
                <td className="border border-zinc-200 px-4 py-2">{p.stock}</td>
                <td className="border border-zinc-200 px-4 py-2">
                  {p.isActive ? "Aktif" : "Pasif"}
                </td>
                <td className="border border-zinc-200 px-4 py-2 text-center">
                  <Link
                    href={`/admin/urunler/${p.id}`}
                    className="text-amber-600 hover:underline"
                  >
                    Düzenle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
