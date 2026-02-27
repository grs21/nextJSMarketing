import { prisma } from "@/lib/db";

export default async function AdminRandevularPage() {
  const appointments = await prisma.appointment.findMany({
    include: { slot: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Randevular</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border border-zinc-200">
          <thead>
            <tr className="bg-zinc-50">
              <th className="border border-zinc-200 px-4 py-2 text-left">Tarih</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Müşteri</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">İletişim</th>
              <th className="border border-zinc-200 px-4 py-2 text-left">Durum</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td className="border border-zinc-200 px-4 py-2">
                  {a.slot.date} {a.slot.startTime}-{a.slot.endTime}
                </td>
                <td className="border border-zinc-200 px-4 py-2">{a.customerName}</td>
                <td className="border border-zinc-200 px-4 py-2">
                  {a.customerEmail} / {a.customerPhone}
                </td>
                <td className="border border-zinc-200 px-4 py-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {appointments.length === 0 && (
        <p className="mt-4 text-zinc-600">Henüz randevu yok.</p>
      )}
    </div>
  );
}
