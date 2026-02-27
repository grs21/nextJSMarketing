import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  const slots = await prisma.appointmentSlot.findMany({
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json(slots);
}

export async function POST(request: Request) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const body = await request.json();
    const { date, startTime, endTime, price } = body;

    if (!date || !startTime || !endTime || typeof price !== "number") {
      return NextResponse.json(
        { message: "Tarih, saat ve ücret zorunludur." },
        { status: 400 }
      );
    }

    await prisma.appointmentSlot.create({
      data: {
        date: String(date).slice(0, 10),
        startTime: String(startTime),
        endTime: String(endTime),
        price: Number(price),
        capacity: 1,
      },
    });
    return NextResponse.json({ message: "Slot eklendi." }, { status: 201 });
  } catch (error) {
    console.error("admin slotlar post error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
