import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slotId,
      customerName,
      customerEmail,
      customerPhone,
      productIds = [],
      paymentMethod,
    } = body;

    if (!slotId || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { message: "Ad, e-posta ve telefon zorunludur." },
        { status: 400 }
      );
    }

    const slot = await prisma.appointmentSlot.findUnique({
      where: { id: slotId },
      include: { _count: { select: { appointments: true } } },
    });

    if (!slot) {
      return NextResponse.json(
        { message: "Randevu slotu bulunamadı." },
        { status: 404 }
      );
    }

    if (slot._count.appointments >= slot.capacity) {
      return NextResponse.json(
        { message: "Bu slot için yer kalmadı." },
        { status: 400 }
      );
    }

    const productIdsStr =
      Array.isArray(productIds) ? JSON.stringify(productIds) : "[]";

    await prisma.$transaction(async (tx) => {
      const count = await tx.appointment.count({
        where: { slotId, status: { not: "cancelled" } },
      });
      if (count >= slot.capacity) {
        throw new Error("Slot dolu");
      }
      await tx.appointment.create({
        data: {
          slotId,
          customerName: String(customerName).trim(),
          customerEmail: String(customerEmail).trim(),
          customerPhone: String(customerPhone).trim(),
          productIds: productIdsStr,
          paymentMethod: paymentMethod || null,
          status: "pending",
        },
      });
    });

    return NextResponse.json(
      { message: "Randevunuz alındı. En kısa sürede onay için size dönüş yapacağız." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Slot dolu") {
      return NextResponse.json(
        { message: "Bu slot için yer kalmadı." },
        { status: 400 }
      );
    }
    console.error("randevu api error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
