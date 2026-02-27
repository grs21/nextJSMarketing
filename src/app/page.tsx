import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="bg-stone-100 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-stone-900 md:text-5xl">
            Hayalinizdeki Gelinlik Burada
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg font-medium text-stone-700">
            Özenle seçilmiş gelinlik ve kıyafetlerimizle düğününüzü unutulmaz kılın.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/urunler"
              className="rounded-md bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
            >
              Ürünleri İncele
            </Link>
            <Link
              href="/randevu"
              className="rounded-md border-2 border-stone-800 px-6 py-3 font-semibold text-stone-800 transition-colors hover:bg-stone-800 hover:text-white"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display mb-8 text-2xl font-bold text-stone-900">
            Öne Çıkan Ürünler
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/urunler/${product.id}`}
                className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[4/5] bg-stone-200">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-600 font-medium">
                      Görsel yok
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-amber-600">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </p>
                  {product.stock === 0 && (
                    <span className="mt-2 inline-block text-sm text-red-600">
                      Stokta yok
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/urunler"
              className="font-medium text-amber-600 hover:underline"
            >
              Tüm ürünleri görüntüle →
            </Link>
          </div>
        </section>
      )}

      <section className="border-t border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Sorularınız mı var?
          </h2>
          <p className="mt-2 font-medium text-stone-700">
            Bize ulaşın, size yardımcı olalım.
          </p>
          <Link
            href="/iletisim"
            className="mt-4 inline-block rounded-md bg-stone-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-stone-800"
          >
            İletişim Formu
          </Link>
        </div>
      </section>
    </div>
  );
}
