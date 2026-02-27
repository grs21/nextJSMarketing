import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 gün

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export const USER_SESSION_COOKIE = "user_session";
const SESSION_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60, // 30 gün
  path: "/",
};

export async function createUserSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, userId, SESSION_OPTIONS);
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE);
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(USER_SESSION_COOKIE);
  return session?.value || null;
}

export { generateCode };
