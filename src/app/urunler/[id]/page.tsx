import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user-auth";
import { UrunGalerisi } from "@/components/urun/UrunGalerisi";
import { SepeteEkleButton } from "@/components/urun/SepeteEkleButton";

export default async function UrunDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    include: {
      media: { orderBy: { order: "asc" } },
    },
  });

  if (!product) notFound();

  const userId = await getCurrentUserId();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <UrunGalerisi
          media={product.media.map((m) => ({
            id: m.id,
            url: m.url,
            type: m.type,
            order: m.order,
          }))}
          fallbackImage={product.imageUrl}
        />

        <div>
          <Link
            href="/urunler"
            className="text-sm text-stone-600 hover:text-amber-600"
          >
            ← Ürünlere Dön
          </Link>
          <h1 className="font-display mt-2 text-3xl font-bold text-stone-900">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-amber-600">
            {product.price.toLocaleString("tr-TR")} ₺
          </p>
          {product.stock === 0 ? (
            <p className="mt-4 font-medium text-red-600">Stokta yok</p>
          ) : (
            <p className="mt-4 text-stone-600">
              Stok: <span className="font-medium text-stone-800">{product.stock} adet</span>
            </p>
          )}

          {product.description && (
            <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-semibold text-stone-900">Ürün Açıklaması</h3>
              <p className="mt-2 leading-relaxed text-stone-700">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            {product.stock > 0 && (
              <SepeteEkleButton
                productId={product.id}
                productName={product.name}
                isLoggedIn={!!userId}
              />
            )}
            <Link
              href={`/randevu?urun=${product.id}`}
              className="rounded-md border-2 border-stone-800 px-6 py-3 font-semibold text-stone-800 transition-colors hover:bg-stone-800 hover:text-white"
            >
              Denemek İçin Randevu Al
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
