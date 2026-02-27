import { NextResponse } from "next/server";
import { verifyAdmin, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Kullanıcı adı ve şifre gerekli." },
        { status: 400 }
      );
    }

    const valid = await verifyAdmin(String(username), String(password));
    if (!valid) {
      return NextResponse.json(
        { message: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 }
      );
    }

    await createSession();
    return NextResponse.json({ message: "Giriş başarılı." });
  } catch (error) {
    console.error("admin auth error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
