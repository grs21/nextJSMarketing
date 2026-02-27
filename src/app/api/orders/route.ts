import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user-auth";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json(
      { message: "Sipariş vermek için giriş yapmalısınız." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { address, phone } = body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Sepetiniz boş." },
        { status: 400 }
      );
    }

    let total = 0;
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { message: `${item.product.name} için yeterli stok yok.` },
          { status: 400 }
        );
      }
      total += item.product.price * item.quantity;
    }

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId,
          total,
          address: address || null,
          phone: phone || null,
          status: "pending",
        },
      });

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: o.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return o;
    });

    return NextResponse.json({
      message: "Siparişiniz alındı.",
      orderId: order.id,
    });
  } catch (error) {
    console.error("orders post error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
