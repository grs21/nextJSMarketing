import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/randevular", label: "Randevular" },
  { href: "/admin/mesajlar", label: "Mesajlar" },
  { href: "/admin/slotlar", label: "Randevu Slotları" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/giris");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-zinc-200 bg-zinc-50 p-4">
        <h2 className="mb-6 font-bold text-zinc-900">Admin</h2>
        <nav className="space-y-2">
          {adminNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block rounded px-3 py-2 text-zinc-700 hover:bg-zinc-200"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
