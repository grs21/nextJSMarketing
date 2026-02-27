import { prisma } from "@/lib/db";

export default async function AdminMesajlarPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">İletişim Mesajları</h1>
      <div className="mt-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between text-sm text-zinc-500">
              <span>{m.name} &lt;{m.email}&gt;</span>
              <span>{new Date(m.createdAt).toLocaleString("tr-TR")}</span>
            </div>
            {m.phone && <p className="mt-1 text-sm text-zinc-600">Tel: {m.phone}</p>}
            {m.subject && <p className="mt-1 font-medium">{m.subject}</p>}
            <p className="mt-2 text-zinc-700">{m.message}</p>
          </div>
        ))}
      </div>
      {messages.length === 0 && (
        <p className="mt-4 text-zinc-600">Henüz mesaj yok.</p>
      )}
    </div>
  );
}
