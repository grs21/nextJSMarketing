import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user-auth";
import { SepetIcerigi } from "@/components/cart/SepetIcerigi";

export const dynamic = "force-dynamic";

export default async function SepetimPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/giris");

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const items = cart?.items || [];
  const total = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-stone-900">
        Sepetim
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-stone-200 bg-stone-50 p-12 text-center">
          <p className="text-stone-700">Sepetiniz boş.</p>
          <Link
            href="/urunler"
            className="mt-4 inline-block rounded-md bg-amber-600 px-6 py-2 font-semibold text-white hover:bg-amber-700"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <SepetIcerigi
          items={items.map((i) => ({
            id: i.id,
            productId: i.productId,
            quantity: i.quantity,
            product: {
              id: i.product.id,
              name: i.product.name,
              price: i.product.price,
              imageUrl: i.product.imageUrl,
              stock: i.product.stock,
            },
          }))}
          total={total}
        />
      )}
    </div>
  );
}
