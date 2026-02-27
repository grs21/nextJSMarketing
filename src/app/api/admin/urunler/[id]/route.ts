import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock, imageUrl, isActive } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(typeof price === "number" && { price }),
        ...(typeof stock === "number" && { stock: Math.max(0, stock) }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
        ...(typeof isActive === "boolean" && { isActive }),
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("admin urunler patch error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const { id } = await params;
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ message: "Ürün pasife alındı." });
  } catch (error) {
    console.error("admin urunler delete error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
