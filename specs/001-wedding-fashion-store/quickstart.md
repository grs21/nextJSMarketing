# Quickstart: Gelinlik ve Kıyafet E-Ticaret Sitesi

**Branch**: 001-wedding-fashion-store

## Ön Koşullar

- Node.js 20+
- npm veya pnpm

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Prisma ve ek paketleri yükle (plan uygulandıktan sonra)
npm install prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs

# Veritabanını hazırla
npx prisma generate
npx prisma db push   # SQLite için
# veya: npx prisma migrate dev   # PostgreSQL için

# Seed (opsiyonel — örnek veriler)
npx prisma db seed
```

## Ortam Değişkenleri

`.env` oluştur:

```env
DATABASE_URL="file:./dev.db"
# veya PostgreSQL: DATABASE_URL="postgresql://user:pass@localhost:5432/gelinlik"

# Admin giriş (seed veya ilk kurulumda kullanılır)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

## Çalıştırma

```bash
npm run dev
```

Tarayıcı: http://localhost:3000

## Test Senaryoları

1. **Ana sayfa**: `/` — ürün önizlemeleri ve tanıtım
2. **İletişim**: `/iletisim` — form doldur, gönder, onay mesajı
3. **Ürünler**: `/urunler` — liste; `/urunler/1` — detay
4. **Randevu**: `/randevu` — slot seç, form doldur (önce admin'den slot eklenmeli)
5. **Admin**: `/admin/giris` — giriş yap, ürün ekle, randevu/mesaj listele
