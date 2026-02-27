import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user-auth";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json(
      { message: "Sepete eklemek için giriş yapmalısınız." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Ürün ID zorunludur." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Ürün bulunamadı." },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { message: `Yeterli stok yok. Mevcut: ${product.stock}` },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    const existing = cart.items.find((i) => i.productId === productId);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        return NextResponse.json(
          { message: `Yeterli stok yok. Mevcut: ${product.stock}` },
          { status: 400 }
        );
      }
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: "Ürün sepete eklendi." });
  } catch (error) {
    console.error("cart ekle error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
