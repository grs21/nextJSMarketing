import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("admin urunler get error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const body = await request.json();
    const { name, description, price, stock, imageUrl, isActive } = body;

    if (!name || typeof price !== "number" || typeof stock !== "number") {
      return NextResponse.json(
        { message: "Ad, fiyat ve stok zorunludur." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        description: description?.trim() || null,
        price: Number(price),
        stock: Math.max(0, Number(stock)),
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive !== false,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("admin urunler post error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
