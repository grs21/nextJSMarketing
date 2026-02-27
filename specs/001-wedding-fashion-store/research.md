# Research: Gelinlik ve Kıyafet E-Ticaret Sitesi

**Branch**: 001-wedding-fashion-store | **Date**: 2025-02-27

## 1. Veritabanı Seçimi

**Decision**: Prisma ORM + SQLite (geliştirme) / PostgreSQL (üretim)

**Rationale**:
- Kullanıcı "bilgisayarda veritabanı yüklü" dedi; Prisma hem SQLite hem PostgreSQL destekler
- SQLite: Sıfır kurulum, `prisma.db` dosyası ile hızlı geliştirme
- PostgreSQL: Üretimde ölçeklenebilirlik ve eşzamanlı yazma için
- Prisma: Tip güvenliği, migration, seeding

**Alternatives considered**:
- MongoDB: İlişkisel veri (randevu–slot, ürün–kategori) için uygun değil
- Drizzle: Prisma kadar olgun ekosistem yok
- Doğrudan SQL: ORM ile hız ve güvenlik kazanımı

---

## 2. Admin Kimlik Doğrulama

**Decision**: Basit session-based auth (cookie + server action)

**Rationale**:
- Spec "basit kullanıcı adı/şifre" varsayıyor
- NextAuth.js veya benzeri ek kütüphane maliyeti
- Tek admin için environment variable (ADMIN_USER, ADMIN_PASSWORD_HASH) + bcrypt yeterli
- Session: httpOnly cookie, 24 saat

**Alternatives considered**:
- NextAuth.js: Daha fazla özellik; tek admin için aşırı
- JWT: Stateless ama refresh token yönetimi gerektirir

---

## 3. Randevu Slot ve Çakışma

**Decision**: Slot tablosu + kapasite (capacity=1) + transaction

**Rationale**:
- `AppointmentSlot`: tarih, başlangıçSaati, bitisSaati, kapasite
- Randevu oluşturulurken: `SELECT ... FOR UPDATE` veya Prisma transaction ile aynı slot'a ikinci randevu engellenir
- Slot oluşturma: Admin panelden manuel veya toplu

**Alternatives considered**:
- Sadece tarih/saat string: Çakışma kontrolü zor
- Harici takvim API: Başlangıç için gereksiz karmaşıklık

---

## 4. Ödeme (Randevu Ücreti)

**Decision**: İlk fazda ödeme bilgisi toplama (kart son 4 hane, ödeme yöntemi) — gerçek ödeme geçidi YOK

**Rationale**:
- Spec: "Randevu ücreti ön yüzde gösterilecek; ödeme entegrasyonu ayrı kapsam"
- Form: Ücret gösterimi + "Kapıda öde" / "Havale" / "Kredi kartı (sonra entegre)" seçenekleri
- Gerçek ödeme: Stripe/Iyzico sonraki fazda

---

## 5. UI/UX Tasarım Sistemi

**Decision**: UI UX Pro Max skill — "wedding dress e-commerce beauty luxury" sorgusu ile design system

**Rationale**:
- Gelinlik/beauty/luxury kategorisi UI UX Pro Max'te mevcut
- Soft UI Evolution veya Liquid Glass stil önerileri
- Renk: Yumuşak pembe, altın aksan, sıcak beyaz
- Tipografi: Cormorant Garamond, Montserrat vb.
- SVG ikon: Heroicons veya Lucide (emoji yok)

**Command**:
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "wedding dress e-commerce beauty luxury" --design-system -p "Gelinlik Mağazası" --persist
```

---

## 6. Görsel Yönetimi (Ürün Fotoğrafları)

**Decision**: Başlangıçta URL veya `/public/uploads` klasörü

**Rationale**:
- Cloudinary/S3 sonraki faz
- Şimdilik: Admin ürün eklerken görsel URL girişi veya `public/uploads` altına yükleme
- Next.js `next/image` ile optimizasyon
