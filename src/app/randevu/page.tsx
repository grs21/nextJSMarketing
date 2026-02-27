import { RandevuFormu } from "@/components/forms/RandevuFormu";
import { Suspense } from "react";

function RandevuFormWrapper() {
  return (
    <Suspense fallback={<p className="text-zinc-600">Yükleniyor...</p>}>
      <RandevuFormu />
    </Suspense>
  );
}

export default function RandevuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display mb-2 text-3xl font-bold text-stone-900">Randevu Al</h1>
      <p className="mb-12 font-medium text-stone-700">
        Kıyafetleri denemek için ücretli randevu alın. Uygun slotu seçin ve
        formu doldurun.
      </p>
      <RandevuFormWrapper />
    </div>
  );
}
