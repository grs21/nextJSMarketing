# Implementation Plan: Gelinlik ve Kıyafet E-Ticaret Sitesi

**Branch**: `001-wedding-fashion-store` | **Date**: 2025-02-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-wedding-fashion-store/spec.md`

## Summary

Gelinlik ve kıyafet satışı yapan e-ticaret sitesi: ana sayfa, hizmetler, iletişim formu, ürün kataloğu, ücretli randevu sistemi ve admin paneli. Next.js App Router, Tailwind CSS, Prisma ORM ve SQLite/PostgreSQL ile geliştirilecek. UI UX Pro Max skill ile gelinlik/beauty/luxury e-ticaret tasarım rehberliği uygulanacak.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Next.js 16, React 19, Tailwind CSS 4, Prisma ORM  
**Storage**: SQLite (geliştirme) / PostgreSQL (üretim) — Prisma ile  
**Testing**: Vitest veya Jest (opsiyonel), ESLint  
**Target Platform**: Web (responsive: 375px, 768px, 1024px, 1440px)  
**Project Type**: Full-stack web application (Next.js App Router)  
**Performance Goals**: Sayfa yükleme < 3s, LCP < 2.5s  
**Constraints**: Türkçe dil, WCAG AA erişilebilirlik hedefi  
**Scale/Scope**: Küçük/orta ölçek mağaza, ~100 ürün, günlük ~50 randevu kapasitesi

## Constitution Check

*Constitution şablon halinde; proje-specific prensipler tanımlanmamış. Bu aşamada gate atlanır.*

## Project Structure

### Documentation (this feature)

```text
specs/001-wedding-fashion-store/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-routes.md
│   └── page-routes.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Ana sayfa
│   ├── globals.css
│   ├── hizmetler/
│   │   └── page.tsx
│   ├── iletisim/
│   │   └── page.tsx
│   ├── urunler/
│   │   ├── page.tsx                # Ürün listesi
│   │   └── [id]/
│   │       └── page.tsx            # Ürün detay
│   ├── randevu/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout + auth guard
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── giris/
│   │   │   └── page.tsx
│   │   ├── urunler/
│   │   │   ├── page.tsx
│   │   │   ├── yeni/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── randevular/
│   │   │   └── page.tsx
│   │   ├── mesajlar/
│   │   │   └── page.tsx
│   │   └── slotlar/
│   │       └── page.tsx
│   └── api/
│       ├── iletisim/
│       │   └── route.ts
│       ├── randevu/
│       │   └── route.ts
│       ├── admin/
│       │   ├── auth/
│       │   │   └── route.ts
│       │   ├── urunler/
│       │   │   └── route.ts
│       │   ├── randevular/
│       │   │   └── route.ts
│       │   ├── mesajlar/
│       │   │   └── route.ts
│       │   └── slotlar/
│       │       └── route.ts
│       └── urunler/
│           └── route.ts
├── components/
│   ├── ui/                         # Button, Input, Card vb.
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── NavLink.tsx
│   ├── forms/
│   │   ├── IletisimFormu.tsx
│   │   └── RandevuFormu.tsx
│   └── urun/
│       ├── UrunKarti.tsx
│       └── UrunListesi.tsx
└── lib/
    ├── db.ts                       # Prisma client
    ├── auth.ts                     # Admin auth (basit session/cookie)
    └── validations.ts

prisma/
├── schema.prisma
└── seed.ts

public/
└── uploads/                        # Ürün görselleri (opsiyonel)
```

**Structure Decision**: Next.js App Router tek proje yapısı. API routes `app/api/` altında. Admin paneli `app/admin/` altında route group. Prisma `prisma/` kök dizininde.
