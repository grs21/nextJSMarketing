import { prisma } from "@/lib/db";
import { SlotFormu } from "@/components/admin/SlotFormu";

export default async function AdminSlotlarPage() {
  const slots = await prisma.appointmentSlot.findMany({
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    include: { _count: { select: { appointments: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Randevu Slotları</h1>
      <div className="mt-6">
        <h2 className="mb-4 font-medium">Yeni Slot Ekle</h2>
        <SlotFormu />
      </div>
      <div className="mt-12 overflow-x-auto">
        <h2 className="mb-4 font-medium">Mevcut Slotlar</h2>
        <table className="w-full border-collapse border border-zinc-200">
          <thead>
            <tr className="bg-zinc-50">
              <th className="border border-zinc-200 px-4 py-2 text-left">Tarih</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Saat</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Ücret</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Dolu/Kapasite</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.id}>
                <td className="border border-zinc-200 px-4 py-2">{s.date}</td>
                <td className="border border-zinc-200 px-4 py-2">
                  {s.startTime}-{s.endTime}
                </td>
                <td className="border border-zinc-200 px-4 py-2">
                  {s.price.toLocaleString("tr-TR")} ₺
                </td>
                <td className="border border-zinc-200 px-4 py-2">
                  {s._count.appointments}/{s.capacity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {slots.length === 0 && (
        <p className="mt-4 text-zinc-600">Henüz slot yok. Yukarıdan ekleyin.</p>
      )}
    </div>
  );
}
