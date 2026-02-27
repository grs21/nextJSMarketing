import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id, isActive: true },
    });
    if (!product) {
      return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("urun detay api error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
