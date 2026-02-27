import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { UrunFormu } from "@/components/admin/UrunFormu";
import { UrunMedyaYonetimi } from "@/components/admin/UrunMedyaYonetimi";

export default async function AdminUrunEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { media: { orderBy: { order: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Ürün Düzenle</h1>
      <UrunFormu product={product} />
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-stone-900">
          Ürün Galerisi (Görsel / Video)
        </h2>
        <UrunMedyaYonetimi
          productId={product.id}
          media={product.media.map((m) => ({
            id: m.id,
            url: m.url,
            type: m.type,
            order: m.order,
          }))}
        />
      </div>
    </div>
  );
}
