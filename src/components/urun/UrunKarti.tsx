import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
};

export function UrunKarti({ product }: { product: Product }) {
  return (
    <Link
      href={`/urunler/${product.id}`}
      className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/5] bg-stone-200">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-medium text-stone-600">
            Görsel yok
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-lg font-medium text-amber-600">
          {product.price.toLocaleString("tr-TR")} ₺
        </p>
        {product.stock === 0 && (
          <span className="mt-2 inline-block text-sm text-red-600">
            Stokta yok
          </span>
        )}
      </div>
    </Link>
  );
}
