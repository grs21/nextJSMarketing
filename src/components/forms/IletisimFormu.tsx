"use client";

import { useState } from "react";

export function IletisimFormu() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      subject: (formData.get("subject") as string) || undefined,
      message: formData.get("message") as string,
    };

    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      setErrorMsg("Ad, e-posta ve mesaj alanları zorunludur.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.message || "Bir hata oluştu.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-stone-800">
          Ad Soyad *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-800">
          E-posta *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-stone-800">
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-stone-800">
          Konu
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-800">
          Mesajınız *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          maxLength={2000}
          className="mt-1 w-full rounded-md border-2 border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-600 focus:outline-none"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-600">
          Mesajınız alındı. En kısa sürede size dönüş yapacağız.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
      >
        {status === "loading" ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
