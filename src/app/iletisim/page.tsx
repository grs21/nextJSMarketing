import { IletisimFormu } from "@/components/forms/IletisimFormu";

export default function IletisimPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display mb-2 text-3xl font-bold text-stone-900">İletişim</h1>
      <p className="mb-12 font-medium text-stone-700">
        Sorularınız için bize ulaşın. En kısa sürede size dönüş yapacağız.
      </p>
      <IletisimFormu />
    </div>
  );
}
