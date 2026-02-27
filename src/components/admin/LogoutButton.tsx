"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/cikis", { method: "POST" });
    router.push("/admin/giris");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
    >
      Çıkış Yap
    </button>
  );
}
