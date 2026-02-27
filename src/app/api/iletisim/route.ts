import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { message: "Ad alanı zorunludur." },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "E-posta alanı zorunludur." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { message: "Mesaj alanı zorunludur." },
        { status: 400 }
      );
    }
    if (message.length > 2000) {
      return NextResponse.json(
        { message: "Mesaj en fazla 2000 karakter olabilir." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json(
      { message: "Mesajınız alındı." },
      { status: 201 }
    );
  } catch (error) {
    console.error("iletisim api error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
