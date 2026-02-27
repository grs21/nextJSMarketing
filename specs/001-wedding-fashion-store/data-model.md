# Data Model: Gelinlik ve Kıyafet E-Ticaret Sitesi

**Branch**: 001-wedding-fashion-store

## Entity Relationship Overview

```
Product (Ürün)          Service (Hizmet)
     |                        |
     |                        |
ContactMessage (İletişim)    AppointmentSlot (Randevu Slotu)
     |                        |
     |                        +----> Appointment (Randevu)
     |                        |
AdminUser (Admin)  ------> Auth sessions
```

## Entities

### Product (Ürün)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | String (cuid) | Evet | PK |
| name | String | Evet | Ürün adı |
| description | String? | Hayır | Açıklama |
| price | Decimal | Evet | Fiyat (TRY) |
| stock | Int | Evet | Stok miktarı, default 0 |
| imageUrl | String? | Hayır | Görsel URL |
| isActive | Boolean | Evet | Yayında mı, default true |
| createdAt | DateTime | Evet | |
| updatedAt | DateTime | Evet | |

**Validations**: name min 1, price >= 0, stock >= 0

---

### Service (Hizmet)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | String (cuid) | Evet | PK |
| name | String | Evet | Hizmet adı |
| description | String? | Hayır | Açıklama |
| order | Int | Evet | Sıralama |
| createdAt | DateTime | Evet | |
| updatedAt | DateTime | Evet | |

---

### ContactMessage (İletişim Mesajı)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | String (cuid) | Evet | PK |
| name | String | Evet | Gönderen adı |
| email | String | Evet | E-posta |
| phone | String? | Hayır | Telefon |
| subject | String? | Hayır | Konu |
| message | String | Evet | Mesaj içeriği (max 2000) |
| createdAt | DateTime | Evet | |
| readAt | DateTime? | Hayır | Okundu zamanı |

**Validations**: email format, message max 2000 karakter

---

### AppointmentSlot (Randevu Slotu)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | String (cuid) | Evet | PK |
| date | Date | Evet | Tarih |
| startTime | String | Evet | Başlangıç (HH:mm) |
| endTime | String | Evet | Bitiş (HH:mm) |
| capacity | Int | Evet | Kapasite, default 1 |
| price | Decimal | Evet | Randevu ücreti |
| createdAt | DateTime | Evet | |
| updatedAt | DateTime | Evet | |

**Unique**: (date, startTime) — aynı gün aynı saatte tek slot

---

### Appointment (Randevu)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | String (cuid) | Evet | PK |
| slotId | String | Evet | FK AppointmentSlot |
| customerName | String | Evet | Müşteri adı |
| customerEmail | String | Evet | E-posta |
| customerPhone | String | Evet | Telefon |
| productIds | String[] | Hayır | Denenecek ürün ID'leri (JSON) |
| paymentMethod | String? | Hayır | "kapida" | "havale" | "kredi_karti" |
| status | String | Evet | "pending" | "confirmed" | "cancelled" |
| createdAt | DateTime | Evet | |
| updatedAt | DateTime | Evet | |

**Validations**: slot kapasitesi aşılmamalı (transaction ile garanti)

---

### AdminUser (Admin)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | String (cuid) | Evet | PK |
| username | String | Evet | Unique |
| passwordHash | String | Evet | bcrypt |
| createdAt | DateTime | Evet | |
| updatedAt | DateTime | Evet | |

**Not**: Seed ile tek admin oluşturulur; credential env'den okunabilir.
