import Link from "next/link";
import { UserNav } from "./UserNav";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/randevu", label: "Randevu" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 flex-wrap">
        <Link href="/" className="text-xl font-bold text-stone-900 font-display">
          Gelinlik Mağazası
        </Link>
        <div className="flex items-center gap-6">
          <ul className="flex gap-4 sm:gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-stone-700 font-medium transition-colors hover:text-amber-700 hover:underline underline-offset-4"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
