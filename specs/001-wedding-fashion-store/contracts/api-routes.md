# API Routes Contract

**Branch**: 001-wedding-fashion-store

## Public API (Auth gerekmez)

### GET /api/urunler
Ürün listesi (aktif olanlar).

**Response**: `200`
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string | null",
      "price": "number",
      "stock": "number",
      "imageUrl": "string | null",
      "isActive": true
    }
  ]
}
```

### GET /api/urunler/[id]
Tek ürün detayı.

**Response**: `200` | `404`

### POST /api/iletisim
İletişim formu gönderimi.

**Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string?",
  "subject": "string?",
  "message": "string"
}
```
**Response**: `201` | `400` (validation hata)

### GET /api/randevu/slotlar
Müsait randevu slotları (tarih aralığına göre).

**Query**: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Response**: `200`
```json
{
  "slots": [
    {
      "id": "string",
      "date": "YYYY-MM-DD",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "price": "number",
      "available": true
    }
  ]
}
```

### POST /api/randevu
Yeni randevu oluşturma.

**Body**:
```json
{
  "slotId": "string",
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "productIds": ["string"],
  "paymentMethod": "kapida" | "havale" | "kredi_karti"
}
```
**Response**: `201` | `400` (validation / slot dolu)

---

## Admin API (Auth gerekir — Cookie session)

Tüm admin route'ları `Authorization` veya session cookie ile korunur.

### POST /api/admin/auth
Giriş: `{ "username": "string", "password": "string" }`  
**Response**: `200` (session set) | `401`

### POST /api/admin/auth/cikis
Çıkış: Session silinir.

### CRUD /api/admin/urunler
- GET: Liste
- POST: Yeni ürün
- GET /api/admin/urunler/[id]: Detay
- PATCH /api/admin/urunler/[id]: Güncelle
- DELETE /api/admin/urunler/[id]: Sil (soft: isActive=false)

### GET /api/admin/randevular
Randevu listesi (filtre: tarih, durum).

### GET /api/admin/mesajlar
İletişim mesajları listesi.

### CRUD /api/admin/slotlar
Randevu slotları yönetimi (oluştur, güncelle, sil).
