import { prisma } from "@/lib/db";
import { UrunKarti } from "@/components/urun/UrunKarti";

export default async function UrunlerPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display mb-8 text-3xl font-bold text-stone-900">Ürünler</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <UrunKarti key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center font-medium text-stone-700">Henüz ürün bulunmuyor.</p>
      )}
    </div>
  );
}
