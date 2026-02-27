import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const start = startDate || new Date().toISOString().slice(0, 10);
    const end =
      endDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

    const slots = await prisma.appointmentSlot.findMany({
      where: {
        date: { gte: start, lte: end },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: {
        _count: { select: { appointments: true } },
      },
    });

    const available = slots.map((s) => ({
      id: s.id,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      price: s.price,
      available: s._count.appointments < s.capacity,
    }));

    return NextResponse.json({ slots: available });
  } catch (error) {
    console.error("randevu slotlar api error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
