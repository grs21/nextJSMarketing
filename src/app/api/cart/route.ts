import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user-auth";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ cart: null, items: [] });
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  return NextResponse.json({
    cart: { id: cart.id },
    items: cart.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      quantity: i.quantity,
      product: i.product,
    })),
  });
}
