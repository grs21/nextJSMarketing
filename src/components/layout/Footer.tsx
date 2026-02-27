import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-medium text-stone-700">
            © {new Date().getFullYear()} Gelinlik Mağazası. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <Link
              href="/iletisim"
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
            >
              İletişim
            </Link>
            <Link
              href="/randevu"
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
