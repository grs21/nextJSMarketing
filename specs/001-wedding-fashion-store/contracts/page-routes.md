# Page Routes Contract

**Branch**: 001-wedding-fashion-store

## Public Pages

| Route | Açıklama |
|-------|----------|
| `/` | Ana sayfa — ürün önizlemeleri, tanıtım |
| `/hizmetler` | Hizmetler listesi |
| `/iletisim` | İletişim formu |
| `/urunler` | Ürün listesi |
| `/urunler/[id]` | Ürün detay (stok durumu dahil) |
| `/randevu` | Randevu alma sayfası (slot seçimi + form) |

## Admin Pages (Auth gerekir)

| Route | Açıklama |
|-------|----------|
| `/admin/giris` | Admin giriş |
| `/admin` | Dashboard (özet) |
| `/admin/urunler` | Ürün listesi |
| `/admin/urunler/yeni` | Yeni ürün |
| `/admin/urunler/[id]` | Ürün düzenle |
| `/admin/randevular` | Randevu listesi |
| `/admin/mesajlar` | İletişim mesajları |
| `/admin/slotlar` | Randevu slotları yönetimi |

## Layout
- Public: Header (logo, nav: Ana Sayfa, Hizmetler, Ürünler, Randevu, İletişim) + Footer
- Admin: Sidebar nav + main content; yetkisiz erişimde `/admin/giris` yönlendirmesi
