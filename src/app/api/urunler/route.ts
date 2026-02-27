import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("urunler api error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
