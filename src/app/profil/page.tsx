import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user-auth";

export default async function ProfilPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) redirect("/giris");

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-stone-900">
        Hesap Bilgilerim
      </h1>
      <div className="mt-8 space-y-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-stone-600">Ad Soyad</p>
          <p className="font-semibold text-stone-900">
            {user.name || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-600">E-posta</p>
          <p className="font-semibold text-stone-900">{user.email}</p>
          {user.emailVerified && (
            <span className="ml-2 text-xs text-green-600">✓ Doğrulandı</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-stone-600">Telefon</p>
          <p className="font-semibold text-stone-900">
            {user.phone || "—"}
          </p>
          {user.phoneVerified && user.phone && (
            <span className="ml-2 text-xs text-green-600">✓ Doğrulandı</span>
          )}
        </div>
      </div>

      <h2 className="font-display mt-12 text-xl font-bold text-stone-900">
        Siparişlerim
      </h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-stone-600">Henüz siparişiniz yok.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <span className="font-medium text-stone-900">
                  Sipariş #{order.id.slice(-8)}
                </span>
                <span
                  className={`text-sm ${
                    order.status === "pending"
                      ? "text-amber-600"
                      : "text-green-600"
                  }`}
                >
                  {order.status === "pending"
                    ? "Beklemede"
                    : order.status === "confirmed"
                    ? "Onaylandı"
                    : order.status}
                </span>
              </div>
              <p className="mt-1 text-stone-600">
                {order.items.length} ürün ·{" "}
                {order.total.toLocaleString("tr-TR")} ₺
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/urunler"
          className="text-amber-600 hover:underline"
        >
          ← Alışverişe devam et
        </Link>
      </div>
    </div>
  );
}
