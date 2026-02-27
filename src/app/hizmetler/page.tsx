import { prisma } from "@/lib/db";

export default async function HizmetlerPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display mb-12 text-3xl font-bold text-stone-900">Hizmetlerimiz</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <div
            key={service.id}
            className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-sm font-medium text-amber-600">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-2 text-xl font-bold text-stone-900">
              {service.name}
            </h2>
            {service.description && (
              <p className="mt-2 font-medium text-stone-700">{service.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
