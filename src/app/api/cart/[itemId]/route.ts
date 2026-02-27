import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });
  }

  const { itemId } = await params;
  const body = await request.json();
  const { quantity } = body;

  if (typeof quantity !== "number" || quantity < 1) {
    return NextResponse.json(
      { message: "Geçersiz miktar." },
      { status: 400 }
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart) {
    return NextResponse.json({ message: "Sepet bulunamadı." }, { status: 404 });
  }

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) {
    return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
  }

  if (item.product.stock < quantity) {
    return NextResponse.json(
      { message: `Yeterli stok yok. Mevcut: ${item.product.stock}` },
      { status: 400 }
    );
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return NextResponse.json({ message: "Güncellendi." });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });
  }

  const { itemId } = await params;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart || !cart.items.some((i) => i.id === itemId)) {
    return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return NextResponse.json({ message: "Ürün sepetten kaldırıldı." });
}
