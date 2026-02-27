import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateCode } from "@/lib/user-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    const code = generateCode();
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        passwordHash,
        name: name?.trim() || null,
        verificationCode: code,
        verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 dk
      },
    });

    // Geliştirme: Kodu konsola yaz (gerçek uygulamada email/SMS gönderilir)
    if (process.env.NODE_ENV === "development") {
      console.log(`[Doğrulama kodu] ${email}: ${code}`);
    }

    return NextResponse.json({
      message: "Kayıt başarılı. E-posta adresinize doğrulama kodu gönderildi.",
      userId: user.id,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("kayit error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
