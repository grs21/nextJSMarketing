import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createUserSession } from "@/lib/user-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: "E-posta ve doğrulama kodu zorunludur." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    if (!user.verificationCode || !user.verificationExpires) {
      return NextResponse.json(
        { message: "Doğrulama kodu süresi dolmuş. Yeni kod isteyin." },
        { status: 400 }
      );
    }

    if (new Date() > user.verificationExpires) {
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationCode: null, verificationExpires: null },
      });
      return NextResponse.json(
        { message: "Doğrulama kodu süresi dolmuş. Yeni kod isteyin." },
        { status: 400 }
      );
    }

    if (user.verificationCode !== String(code).trim()) {
      return NextResponse.json(
        { message: "Geçersiz doğrulama kodu." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    await createUserSession(user.id);

    return NextResponse.json({
      message: "E-posta doğrulandı. Giriş yapıldı.",
    });
  } catch (error) {
    console.error("dogrulama error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
