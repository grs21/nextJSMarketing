import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "./auth";

export async function requireAdmin() {
  const ok = await isAdminLoggedIn();
  if (!ok) {
    return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
  }
  return null;
}
