import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateCode } from "@/lib/user-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "E-posta zorunludur." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Bu e-posta ile kayıtlı kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const code = generateCode();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: code,
        verificationExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`[Doğrulama kodu] ${user.email}: ${code}`);
    }

    return NextResponse.json({
      message: "Doğrulama kodu gönderildi. (Geliştirme: Konsolu kontrol edin)",
    });
  } catch (error) {
    console.error("kod-gonder error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
