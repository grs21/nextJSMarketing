# Veritabanı Yapısı — Gelinlik Mağazası

**Veritabanı**: SQLite (`prisma/dev.db`)  
**ORM**: Prisma

---

## Şema (Prisma)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Product (Ürün)                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ id          String   @id @default(cuid())                           │
│ name        String                                                  │
│ description String?                                                 │
│ price       Float                                                   │
│ stock       Int      @default(0)                                    │
│ imageUrl    String?                                                 │
│ isActive    Boolean  @default(true)                                 │
│ createdAt   DateTime                                                │
│ updatedAt   DateTime                                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Service (Hizmet)                                                    │
├─────────────────────────────────────────────────────────────────────┤
│ id          String   @id @default(cuid())                           │
│ name        String                                                  │
│ description String?                                                 │
│ order       Int      @default(0)                                    │
│ createdAt   DateTime                                                │
│ updatedAt   DateTime                                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ ContactMessage (İletişim Mesajı)                                    │
├─────────────────────────────────────────────────────────────────────┤
│ id        String    @id @default(cuid())                            │
│ name      String                                                    │
│ email     String                                                    │
│ phone     String?                                                   │
│ subject   String?                                                   │
│ message   String                                                    │
│ createdAt DateTime                                                  │
│ readAt    DateTime?                                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ AppointmentSlot (Randevu Slotu)                                     │
├─────────────────────────────────────────────────────────────────────┤
│ id        String   @id @default(cuid())                             │
│ date      String   // YYYY-MM-DD                                    │
│ startTime String   // HH:mm                                         │
│ endTime   String   // HH:mm                                         │
│ capacity  Int      @default(1)                                      │
│ price     Float                                                    │
│ createdAt DateTime                                                  │
│ updatedAt DateTime                                                  │
│ appointments → Appointment[]                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Appointment (Randevu)                                               │
├─────────────────────────────────────────────────────────────────────┤
│ id            String   @id @default(cuid())                         │
│ slotId        String   → AppointmentSlot                            │
│ customerName  String                                                │
│ customerEmail String                                                │
│ customerPhone String                                                │
│ productIds    String   @default("[]")  // JSON array                │
│ paymentMethod String?                                               │
│ status        String   @default("pending")                          │
│ createdAt     DateTime                                              │
│ updatedAt     DateTime                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ AdminUser (Admin Kullanıcı)                                         │
├─────────────────────────────────────────────────────────────────────┤
│ id           String   @id @default(cuid())                          │
│ username     String   @unique                                       │
│ passwordHash String                                                │
│ createdAt    DateTime                                               │
│ updatedAt    DateTime                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## İlişkiler

- **Appointment** → **AppointmentSlot** (N:1) — Bir randevu bir slota bağlı
- **AppointmentSlot** → **Appointment[]** (1:N) — Bir slotta birden fazla randevu (kapasiteye göre)

---

## Örnek Veriler (Seed Sonrası)

### Product
| name                   | price   | stock | imageUrl                         |
|------------------------|---------|-------|----------------------------------|
| Klasik Beyaz Gelinlik  | 15000   | 3     | Unsplash URL                     |
| Prenses Kesim Gelinlik | 22000   | 2     | Unsplash URL                     |
| Mermaid Gelinlik       | 18500   | 1     | Unsplash URL                     |

### Service
| name                 | order |
|----------------------|-------|
| Gelinlik Danışmanlığı| 1     |
| Özel Dikim           | 2     |
| Düğün Organizasyonu  | 3     |

### AdminUser
| username | (şifre hash) |
|----------|--------------|
| admin    | bcrypt       |

---

## Veritabanını Görüntüleme

**SQLite ile:**
```bash
sqlite3 prisma/dev.db
.tables
.schema Product
SELECT * FROM Product;
```

**Prisma Studio ile:**
```bash
npx prisma studio
```
Tarayıcıda http://localhost:5555 açılır.
