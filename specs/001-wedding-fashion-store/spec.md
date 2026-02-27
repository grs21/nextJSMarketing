# Feature Specification: Gelinlik ve Kıyafet E-Ticaret Sitesi

**Feature Branch**: `001-wedding-fashion-store`  
**Created**: 2025-02-27  
**Status**: Draft  
**Input**: User description: "Bir kıyafetlerin gelinliklerin satıldığı bir web sitesi oluştur: ana sayfa, hizmetler, iletişim formu admin paneli gerekiyor satılacak ürünlerin eklenmesi fiyatların açıklamaların ayarlanması ve stok işlemleri için. Ayrıca kullanıcıların kıyafetleri denemek için ücretli randevu almasını sağlayacak bir sayfaya da ihtiyacım var."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Müşteri Ürün Keşfi ve İletişim (Priority: P1)

Müşteri olarak ana sayfada sunulan gelinlik ve kıyafetleri görmek, hizmetleri incelemek ve iletişim formu ile mağaza ile iletişime geçmek istiyorum.

**Why this priority**: Mağazanın temel tanıtımı ve müşteri iletişim kanalı; site varlığının temel değeri.

**Independent Test**: Ana sayfa, hizmetler sayfası ve iletişim formunun çalıştığı doğrulanabilir. Form gönderimi ile mesaj alındığı test edilebilir.

**Acceptance Scenarios**:

1. **Given** site ziyaretçisi, **When** ana sayfaya girer, **Then** ürün önizlemeleri ve tanıtım içeriği görür
2. **Given** site ziyaretçisi, **When** hizmetler sayfasına gider, **Then** sunulan hizmetler listelenir
3. **Given** site ziyaretçisi, **When** iletişim formunu doldurur ve gönderir, **Then** mesaj kaydedilir ve gönderen onay mesajı alır
4. **Given** site ziyaretçisi, **When** formda zorunlu alanları boş bırakıp gönderir, **Then** hata mesajı gösterilir ve form gönderilmez

---

### User Story 2 - Ürün Kataloğu ve Randevu Alma (Priority: P2)

Müşteri olarak satılık gelinlik ve kıyafetleri listeleyip incelemek, denemek istediğim ürünler için ücretli randevu almak istiyorum.

**Why this priority**: Ürün satışı ve deneme randevusu gelir modelinin temelini oluşturur.

**Independent Test**: Ürün listesi görüntülenebilir; randevu sayfasından tarih/saat seçilip ücretli randevu oluşturulabilir ve onay mesajı alınabilir.

**Acceptance Scenarios**:

1. **Given** müşteri, **When** ürün listesini görüntüler, **Then** ürünler fiyat, açıklama ve görsel ile listelenir
2. **Given** müşteri, **When** bir ürün detayına girer, **Then** detaylı bilgi ve stok durumu görünür
3. **Given** müşteri, **When** randevu sayfasına gider ve uygun tarih/saat seçer, **Then** müsait slotlar gösterilir
4. **Given** müşteri, **When** randevu formunu doldurup ödeme bilgisi ile onaylar, **Then** randevu oluşturulur ve onay/ödeme bilgisi gösterilir
5. **Given** stokta olmayan ürün, **When** müşteri detay sayfasına girer, **Then** "Stokta yok" veya benzeri bilgi gösterilir

---

### User Story 3 - Admin Ürün Yönetimi (Priority: P3)

Admin olarak satışa sunulacak ürünleri eklemek, fiyat ve açıklamalarını ayarlamak, stok durumunu güncellemek istiyorum.

**Why this priority**: İçerik yönetimi olmadan site güncel ürünlerle çalışamaz.

**Independent Test**: Admin panele giriş yapılıp ürün CRUD işlemleri, fiyat/açıklama güncellemesi ve stok değişikliği yapılabildiği doğrulanabilir.

**Acceptance Scenarios**:

1. **Given** admin, **When** panele giriş yapar, **Then** yönetim ana sayfasına erişir
2. **Given** admin, **When** yeni ürün ekler, **Then** ürün kataloğa eklenir (ad, fiyat, açıklama, stok, görsel)
3. **Given** admin, **When** mevcut ürünün fiyat veya açıklamasını günceller, **Then** değişiklikler kaydedilir
4. **Given** admin, **When** stok miktarını artırır/azaltır, **Then** güncel stok kaydedilir ve ön yüzde yansır
5. **Given** admin, **When** ürünü siler veya pasife alır, **Then** ürün müşteri tarafında görünmez olur

---

### User Story 4 - Admin Randevu ve İletişim Yönetimi (Priority: P4)

Admin olarak gelen randevuları ve iletişim formu mesajlarını görmek, randevu slotlarını yönetmek istiyorum.

**Why this priority**: Operasyonel takip ve randevu kapasitesi yönetimi için gerekli.

**Independent Test**: Randevular ve iletişim mesajları admin panelde listelenebilir; randevu slotları eklenebilir/düzenlenebilir.

**Acceptance Scenarios**:

1. **Given** admin, **When** randevu listesini açar, **Then** tüm randevular tarih, müşteri ve durum ile listelenir
2. **Given** admin, **When** iletişim mesajlarına bakar, **Then** gönderilen mesajlar tarih ve içerik ile listelenir
3. **Given** admin, **When** randevu slotlarına müsaitlik ekler veya düzenler, **Then** müşteriler yalnızca müsait slotlardan seçim yapabilir

---

### Edge Cases

- Müsait randevu slotu kalmadığında müşteriye net bilgi verilmeli
- Form gönderiminde geçersiz e-posta veya telefon formatında hata mesajı gösterilmeli
- Stok 0 olduğunda "Sepete ekle" veya benzeri satın alma aksiyonu devre dışı olmalı
- Admin panel yetkisiz erişime kapalı olmalı
- Aynı randevu slotuna eşzamanlı iki talepte çakışma önlenmeli
- Çok uzun ürün açıklaması veya form mesajında uygun karakter sınırı uygulanmalı

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistem, ana sayfada ürün önizlemeleri ve tanıtım içeriği sunmalıdır
- **FR-002**: Sistem, hizmetler sayfasında sunulan hizmetlerin listesini göstermelidir
- **FR-003**: Sistem, iletişim formu ile alınan mesajları kaydetmeli ve gönderen onay bilgisi göstermelidir
- **FR-004**: Sistem, iletişim formunda zorunlu alanların dolu olmasını doğrulamalıdır
- **FR-005**: Sistem, ürün listesini fiyat, açıklama ve görsel ile listelemelidir
- **FR-006**: Sistem, ürün detay sayfasında stok durumunu göstermelidir
- **FR-007**: Sistem, randevu sayfasında müsait tarih/saat slotlarını göstermelidir
- **FR-008**: Sistem, ücretli randevu için ödeme bilgisi alıp randevuyu onaylamalıdır
- **FR-009**: Sistem, stokta olmayan ürünlerde satın alma aksiyonunu devre dışı bırakmalıdır
- **FR-010**: Sistem, admin panelinde yalnızca yetkili kullanıcıların erişimine izin vermelidir
- **FR-011**: Sistem, admin panelinde ürün ekleme, düzenleme ve silme işlemlerine izin vermelidir
- **FR-012**: Sistem, admin panelinde ürün fiyat ve açıklaması güncellemesine izin vermelidir
- **FR-013**: Sistem, admin panelinde stok miktarı güncellemesine izin vermelidir
- **FR-014**: Sistem, admin panelinde randevu listesini göstermelidir
- **FR-015**: Sistem, admin panelinde iletişim formu mesajlarını göstermelidir
- **FR-016**: Sistem, admin panelinde randevu müsaitlik slotlarının yönetimine izin vermelidir
- **FR-017**: Sistem, aynı randevu slotuna eşzamanlı birden fazla atama yapılmasını engellemelidir

### Key Entities

- **Ürün**: Satılan kıyafet/gelinlik; ad, fiyat, açıklama, stok miktarı, görsel(ler)
- **Hizmet**: Mağazanın sunduğu hizmet; ad, açıklama
- **İletişim Mesajı**: Form ile gönderilen mesaj; gönderen bilgileri, konu, içerik, tarih
- **Randevu**: Deneme randevusu; müşteri bilgileri, tarih/saat, ürün(ler), ücret, durum
- **Randevu Slotu**: Müsait deneme zamanı; tarih, saat aralığı, kapasite
- **Admin Kullanıcı**: Panele erişebilen yetkili kullanıcı; kimlik doğrulama bilgileri

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Müşteri ana sayfadan iletişim formuna ulaşıp mesaj gönderebilmeli (ilk denemede tamamlanabilir akış)
- **SC-002**: Müşteri bir ürünü inceleyip randevu alabilmeli; randevu onayı 2 dakika içinde tamamlanabilmeli
- **SC-003**: Admin yeni ürün ekleyip fiyat/stok güncelleyebilmeli; değişiklikler anında ön yüzde görünmeli
- **SC-004**: Site tipik cihaz boyutlarında (mobil, tablet, masaüstü) düzgün görüntülenmeli
- **SC-005**: Form ve randevu işlemlerinde hata durumlarında anlaşılır geri bildirim verilmeli
- **SC-006**: Admin panel yetkisiz erişime kapalı olmalı; yetkisiz denemeler engellenmeli

## Assumptions

- Veritabanı mevcut; ilişkisel veya NoSQL veri modeli uygun şekilde kullanılacak
- Teknik tercih: Next.js ve Tailwind CSS (kullanıcı talebi)
- UI/UX rehberliği için UI UX Pro Max skill kullanılacak (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- Randevu ücreti ön yüzde gösterilecek; ödeme entegrasyonu (ödeme geçidi) ayrı bir kapsamda ele alınabilir
- Admin kimlik doğrulama basit kullanıcı adı/şifre veya benzeri standart yöntemle yapılacak
- Başlangıçta tek dil (Türkçe) desteklenecek
