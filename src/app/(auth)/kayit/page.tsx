"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_REFRESH_EVENT } from "@/components/layout/UserNav";

export default function KayitPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Kayıt başarısız.");
        setLoading(false);
        return;
      }
      setStep("verify");
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
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Doğrulama başarısız.");
        setLoading(false);
        return;
      }
      window.dispatchEvent(new CustomEvent(AUTH_REFRESH_EVENT));
      router.push("/");
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
          {email} adresine gönderilen 6 haneli kodu girin. (Geliştirme modunda
          konsolu kontrol edin)
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
            Doğrula ve Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-stone-900">
        Kayıt Ol
      </h1>
      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone-800">
            Ad Soyad
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-800">
            E-posta *
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
            Şifre *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900"
          />
          <p className="mt-1 text-xs text-stone-600">
            En az 6 karakter
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          Kayıt Ol
        </button>
      </form>
      <p className="mt-4 text-center text-stone-700">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="text-amber-600 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
