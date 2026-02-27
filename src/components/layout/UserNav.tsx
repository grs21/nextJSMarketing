"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const AUTH_REFRESH_EVENT = "auth-refresh";
export const CART_REFRESH_EVENT = "cart-refresh";

type User = { id: string; email: string; name: string | null } | null;
type CartItem = { id: string; quantity: number };

export function UserNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User>(null);
  const [cartCount, setCartCount] = useState(0);

  const load = useCallback(async () => {
    const [userRes, cartRes] = await Promise.all([
      fetch("/api/auth/me", { credentials: "include" }),
      fetch("/api/cart", { credentials: "include" }),
    ]);
    const userData = await userRes.json();
    const cartData = await cartRes.json();
    setUser(userData.user);
    setCartCount(
      (cartData.items as CartItem[]).reduce((s, i) => s + i.quantity, 0)
    );
  }, []);

  useEffect(() => {
    load();
  }, [load, pathname]);

  useEffect(() => {
    const onAuth = () => load();
    const onCart = () => load();
    window.addEventListener(AUTH_REFRESH_EVENT, onAuth);
    window.addEventListener(CART_REFRESH_EVENT, onCart);
    return () => {
      window.removeEventListener(AUTH_REFRESH_EVENT, onAuth);
      window.removeEventListener(CART_REFRESH_EVENT, onCart);
    };
  }, [load]);

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/sepetim"
        className="relative flex items-center gap-1 text-stone-700 font-medium hover:text-amber-700 transition-colors"
      >
        Sepetim
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </Link>
      {user ? (
        <>
          <Link
            href="/profil"
            className="text-stone-700 font-medium hover:text-amber-700 transition-colors"
          >
            {user.name || user.email}
          </Link>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/cikis", { method: "POST", credentials: "include" });
              window.dispatchEvent(new CustomEvent(AUTH_REFRESH_EVENT));
              window.dispatchEvent(new CustomEvent(CART_REFRESH_EVENT));
              window.location.href = "/";
            }}
            className="text-stone-600 text-sm hover:text-red-600 transition-colors"
          >
            Çıkış
          </button>
        </>
      ) : (
        <>
          <Link
            href="/giris"
            className="text-stone-700 font-medium hover:text-amber-700 transition-colors"
          >
            Giriş
          </Link>
          <Link
            href="/kayit"
            className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
          >
            Kayıt Ol
          </Link>
        </>
      )}
    </div>
  );
}
