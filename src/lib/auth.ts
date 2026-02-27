import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 saat

export async function verifyAdmin(
  username: string,
  password: string
): Promise<boolean> {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (adminUser && adminPasswordHash) {
    const match = username === adminUser && (await bcrypt.compare(password, adminPasswordHash));
    return match;
  }

  const { prisma } = await import("./db");
  const user = await prisma.adminUser.findUnique({
    where: { username },
  });
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return !!session?.value;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
