"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_REFRESH_EVENT } from "@/components/layout/UserNav";

function GirisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"login" | "verify">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/giris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Giriş başarısız.");
        setLoading(false);
        return;
      }
      if (data.requiresVerification) {
        setStep("verify");
      } else {
        window.dispatchEvent(new CustomEvent(AUTH_REFRESH_EVENT));
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError("Bağlantı hatası.");
    }
    setLoading(false);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/dogrulama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Doğrulama başarısız.");
        setLoading(false);
        return;
      }
      window.dispatchEvent(new CustomEvent(AUTH_REFRESH_EVENT));
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    }
    setLoading(false);
  }

  if (step === "verify") {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-2xl font-bold text-stone-900">
          E-posta Doğrulama
        </h1>
        <p className="mt-2 text-stone-700">
          {email} adresine gönderilen 6 haneli kodu girin.
        </p>
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-800">
              Doğrulama Kodu
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
              className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            Doğrula
          </button>
        </form>
        <p className="mt-4 text-sm text-stone-600">
          Kod gelmedi mi?{" "}
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/kod-gonder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
            }}
            className="text-amber-600 hover:underline"
          >
            Tekrar gönder
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-stone-900">Giriş</h1>
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone-800">
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-800">
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          Giriş Yap
        </button>
      </form>
      <p className="mt-4 text-center text-stone-700">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="text-amber-600 hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 animate-pulse text-stone-500">Yükleniyor...</div>}>
      <GirisForm />
    </Suspense>
  );
}
