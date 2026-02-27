import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [productCount, appointmentCount, messageCount] = await Promise.all([
    prisma.product.count(),
    prisma.appointment.count(),
    prisma.contactMessage.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/urunler"
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <p className="text-3xl font-bold text-zinc-900">{productCount}</p>
          <p className="mt-1 text-zinc-600">Ürün</p>
        </Link>
        <Link
          href="/admin/randevular"
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <p className="text-3xl font-bold text-zinc-900">{appointmentCount}</p>
          <p className="mt-1 text-zinc-600">Randevu</p>
        </Link>
        <Link
          href="/admin/mesajlar"
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <p className="text-3xl font-bold text-zinc-900">{messageCount}</p>
          <p className="mt-1 text-zinc-600">İletişim Mesajı</p>
        </Link>
      </div>
    </div>
  );
}
