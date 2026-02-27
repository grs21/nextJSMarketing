import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const { id: productId } = await params;
    const body = await request.json();
    const { url, type } = body;

    if (!url || !type || !["image", "video"].includes(type)) {
      return NextResponse.json(
        { message: "url ve type (image|video) zorunludur." },
        { status: 400 }
      );
    }

    const count = await prisma.productMedia.count({
      where: { productId },
    });

    await prisma.productMedia.create({
      data: {
        productId,
        url: String(url).trim(),
        type,
        order: count,
      },
    });

    return NextResponse.json({ message: "Medya eklendi." }, { status: 201 });
  } catch (error) {
    console.error("media post error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
