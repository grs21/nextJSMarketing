import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  const { mediaId } = await params;

  await prisma.productMedia.delete({
    where: { id: mediaId },
  });

  return NextResponse.json({ message: "Medya silindi." });
}
