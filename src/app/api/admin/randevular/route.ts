import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  const appointments = await prisma.appointment.findMany({
    include: { slot: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(appointments);
}
