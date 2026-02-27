import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createUserSession, generateCode } from "@/lib/user-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { message: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
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
        message: "E-posta doğrulanmamış. Size bir kod gönderildi.",
        requiresVerification: true,
        email: user.email,
      });
    }

    await createUserSession(user.id);

    return NextResponse.json({
      message: "Giriş başarılı.",
    });
  } catch (error) {
    console.error("giris error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
