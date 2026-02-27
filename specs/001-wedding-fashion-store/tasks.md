# Tasks: Gelinlik ve Kıyafet E-Ticaret Sitesi

**Input**: Design documents from `/specs/001-wedding-fashion-store/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Spec'te açıkça talep edilmedi — test task'ları yok.

**Organization**: User story bazlı, her story bağımsız implement ve test edilebilir.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralel çalıştırılabilir
- **[Story]**: US1, US2, US3, US4

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Proje yapısı ve bağımlılıklar

- [x] T001 Install Prisma, bcryptjs, @prisma/client and create prisma/schema.prisma in project root
- [x] T002 Create .env.example with DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD placeholders
- [x] T003 [P] Add src/lib/db.ts with Prisma client singleton export

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tüm user story'lerin önkoşulu

- [x] T004 Create Prisma schema with Product, Service, ContactMessage, AppointmentSlot, Appointment, AdminUser per data-model.md
- [x] T005 Run npx prisma generate and npx prisma db push (SQLite dev.db)
- [x] T006 [P] Implement src/lib/auth.ts with session-based admin auth (bcrypt, cookie)
- [x] T007 [P] Create src/components/layout/Header.tsx with nav links (Ana Sayfa, Hizmetler, Ürünler, Randevu, İletişim)
- [x] T008 [P] Create src/components/layout/Footer.tsx
- [x] T009 Update src/app/layout.tsx to include Header and Footer
- [x] T010 Create prisma/seed.ts with sample Service records and optional admin user
- [x] T011 Create design-system/MASTER.md using UI UX Pro Max: `python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "wedding dress e-commerce beauty luxury" --design-system -p "Gelinlik Mağazası" --persist`

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 - Müşteri Ürün Keşfi ve İletişim (P1) 🎯 MVP

**Goal**: Ana sayfa, hizmetler sayfası, iletişim formu

**Independent Test**: Ana sayfa açılır, hizmetler listelenir, iletişim formu gönderilir ve onay mesajı alınır

### Implementation for User Story 1

- [ ] T012 [US1] Create src/app/hizmetler/page.tsx — fetch Service from DB, list services
- [ ] T013 [US1] Create src/app/iletisim/page.tsx with IletisimFormu component
- [ ] T014 [US1] Create src/components/forms/IletisimFormu.tsx — name, email, phone, subject, message, validation
- [ ] T015 [US1] Create src/app/api/iletisim/route.ts — POST handler, save ContactMessage, return 201
- [ ] T016 [US1] Update src/app/page.tsx — ana sayfa: ürün önizlemeleri (ilk 6 Product), tanıtım, CTA

**Checkpoint**: US1 tamamlandı — ana sayfa, hizmetler, iletişim formu çalışır

---

## Phase 4: User Story 2 - Ürün Kataloğu ve Randevu Alma (P2)

**Goal**: Ürün listesi, ürün detay, randevu alma sayfası

**Independent Test**: Ürünler listelenir, detay açılır, randevu sayfasından slot seçilip form doldurulur

### Implementation for User Story 2

- [ ] T017 [US2] Create src/app/urunler/page.tsx — fetch products, grid layout
- [ ] T018 [US2] Create src/components/urun/UrunKarti.tsx — name, price, imageUrl, link to detail
- [ ] T019 [US2] Create src/app/urunler/[id]/page.tsx — product detail, stock status, stokta yok UI
- [ ] T020 [US2] Create src/app/api/urunler/route.ts — GET list (active only)
- [ ] T021 [US2] Create src/app/api/urunler/[id]/route.ts — GET single product
- [ ] T022 [US2] Create src/app/api/randevu/slotlar/route.ts — GET müsait slotlar (query: startDate, endDate)
- [ ] T023 [US2] Create src/app/api/randevu/route.ts — POST randevu (slotId, customer*, productIds, paymentMethod), transaction for slot capacity
- [ ] T024 [US2] Create src/app/randevu/page.tsx with RandevuFormu — slot seçimi, form, ödeme yöntemi
- [ ] T025 [US2] Create src/components/forms/RandevuFormu.tsx — customer fields, productIds multi-select, paymentMethod

**Checkpoint**: US2 tamamlandı — ürünler ve randevu akışı çalışır

---

## Phase 5: User Story 3 - Admin Ürün Yönetimi (P3)

**Goal**: Admin giriş, ürün CRUD

**Independent Test**: Admin panele giriş, ürün ekle/düzenle/sil, stok güncelle

### Implementation for User Story 3

- [ ] T026 [US3] Create src/app/admin/giris/page.tsx — login form
- [ ] T027 [US3] Create src/app/admin/layout.tsx — auth guard, sidebar nav, redirect to /admin/giris if not logged in
- [ ] T028 [US3] Create src/app/api/admin/auth/route.ts — POST login (username, password), set session cookie
- [ ] T029 [US3] Create src/app/api/admin/auth/cikis/route.ts — POST logout
- [ ] T030 [US3] Create src/app/admin/page.tsx — dashboard özet
- [ ] T031 [US3] Create src/app/admin/urunler/page.tsx — ürün listesi
- [ ] T032 [US3] Create src/app/admin/urunler/yeni/page.tsx — yeni ürün formu
- [ ] T033 [US3] Create src/app/admin/urunler/[id]/page.tsx — ürün düzenleme formu
- [ ] T034 [US3] Create src/app/api/admin/urunler/route.ts — GET list, POST create
- [ ] T035 [US3] Create src/app/api/admin/urunler/[id]/route.ts — GET, PATCH, DELETE (soft: isActive=false)

**Checkpoint**: US3 tamamlandı — admin ürün yönetimi çalışır

---

## Phase 6: User Story 4 - Admin Randevu ve İletişim Yönetimi (P4)

**Goal**: Randevu listesi, iletişim mesajları, slot yönetimi

**Independent Test**: Admin randevuları ve mesajları görür, slot ekler/düzenler

### Implementation for User Story 4

- [ ] T036 [US4] Create src/app/admin/randevular/page.tsx — randevu listesi (tarih, müşteri, durum)
- [ ] T037 [US4] Create src/app/admin/mesajlar/page.tsx — iletişim mesajları listesi
- [ ] T038 [US4] Create src/app/admin/slotlar/page.tsx — slot listesi, yeni slot formu, düzenle/sil
- [ ] T039 [US4] Create src/app/api/admin/randevular/route.ts — GET list
- [ ] T040 [US4] Create src/app/api/admin/mesajlar/route.ts — GET list
- [ ] T041 [US4] Create src/app/api/admin/slotlar/route.ts — GET list, POST create
- [ ] T042 [US4] Create src/app/api/admin/slotlar/[id]/route.ts — PATCH, DELETE

**Checkpoint**: US4 tamamlandı — admin operasyonel yönetim çalışır

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive, erişilebilirlik, hata yönetimi

- [ ] T043 [P] Add responsive breakpoints (375px, 768px, 1024px) and cursor-pointer, hover states per design-system
- [ ] T044 [P] Add form validation error messages and success feedback (TR)
- [ ] T045 Add prefers-reduced-motion and focus-visible styles
- [ ] T046 Verify .gitignore includes .env, node_modules, .next, prisma/dev.db
- [ ] T047 Run quickstart.md steps and validate app runs

---

## Dependencies & Execution Order

- **Phase 1**: Başlangıç
- **Phase 2**: Phase 1'den sonra — tüm story'leri bloklar
- **Phase 3–6**: Phase 2 tamamlandıktan sonra sırayla (P1→P2→P3→P4)
- **Phase 7**: Tüm story'ler tamamlandıktan sonra

## Parallel Opportunities

- T003, T006, T007, T008 [P]
- T012–T016 US1 içinde bazıları [P]
- T017–T021 US2 içinde [P]
- T043, T044 [P]

## Implementation Strategy

**MVP First**: Phase 1 + 2 + 3 → Ana sayfa, hizmetler, iletişim çalışır
