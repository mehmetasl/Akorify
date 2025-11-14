# 🔧 Vercel Environment Variables Kurulumu

## ✅ Aldığın Environment Variables:

- `DATABASE_PRISMA_DATABASE_URL` - Prisma Accelerate URL (prisma+postgres://...)
- `DATABASE_POSTGRES_URL` - Normal PostgreSQL URL

## ⚠️ Önemli: Prisma `DATABASE_URL` Bekliyor!

Prisma schema'da `env("DATABASE_URL")` yazıyor, bu yüzden `DATABASE_URL` environment variable'ı olmalı.

## Adım 1: Vercel Dashboard'da `DATABASE_URL` Ekle

1. **Vercel Dashboard:**
   - Project → Settings → Environment Variables

2. **Yeni Variable Ekle:**
   - "Add New" butonuna tıkla
   - **Name:** `DATABASE_URL`
   - **Value:** `DATABASE_PRISMA_DATABASE_URL` değerini kopyala
     ```
     prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19sNTdLYmthdXhGZldSZVVQNWphSUsiLCJhcGlfa2V5IjoiMDFLQTE4WlNKS0RaS1RTNzdCVk5FS0dYNUciLCJ0ZW5hbnRfaWQiOiI4YWZmNjA0ZDQwNzcyZjMzYWM0OGI5NWQ4ZDI1ZTE3YWFjYjkyNmEzMzA3YTIwYzViMjNkMDY3YzBiNzY4Mjg2IiwiaW50ZXJuYWxfc2VjcmV0IjoiMzc5Nzc5MjctMTVlZS00MmNjLWI2Y2MtNjVlZDc1MjE4ZDE0In0.UOlIdPTqsMlJplX8egW59-FFbdUPuyxJAxDV6U4Sb0Y
     ```
   - **Environment:** Tümünü seç (Production, Preview, Development)
   - "Save" tıkla

## Adım 2: Local .env Dosyası (Opsiyonel - Test İçin)

Local'de test etmek istersen `.env` dosyasına ekle:

```env
# Prisma Accelerate URL (önerilen - daha hızlı)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19sNTdLYmthdXhGZldSZVVQNWphSUsiLCJhcGlfa2V5IjoiMDFLQTE4WlNKS0RaS1RTNzdCVk5FS0dYNUciLCJ0ZW5hbnRfaWQiOiI4YWZmNjA0ZDQwNzcyZjMzYWM0OGI5NWQ4ZDI1ZTE3YWFjYjkyNmEzMzA3YTIwYzViMjNkMDY3YzBiNzY4Mjg2IiwiaW50ZXJuYWxfc2VjcmV0IjoiMzc5Nzc5MjctMTVlZS00MmNjLWI2Y2MtNjVlZDc1MjE4ZDE0In0.UOlIdPTqsMlJplX8egW59-FFbdUPuyxJAxDV6U4Sb0Y"

# Veya normal PostgreSQL URL (migration için)
# DATABASE_URL="postgres://8aff604d40772f33ac48b95d8d25e17aacb926a3307a20c5b23d067c0b768286:sk_l57KbkauxFfWReUP5jaIK@db.prisma.io:5432/postgres?sslmode=require"
```

## Adım 3: Migration Oluştur (İlk Kez)

### Local'den:

```bash
# .env dosyasına DATABASE_URL ekledikten sonra
npm run db:migrate

# Veya direkt push (development için)
npm run db:push
```

### Vercel'de:

Vercel otomatik olarak build sırasında migration çalıştıracak (`vercel.json`'da ayarlı).

## Adım 4: GitHub'a Push ve Deploy

```bash
git add .
git commit -m "Add: Database migration files"
git push
```

Vercel otomatik deploy edecek.

## ✅ Kontrol Listesi

- [ ] Vercel'de `DATABASE_URL` environment variable eklendi
- [ ] Value: `DATABASE_PRISMA_DATABASE_URL` değeri
- [ ] Tüm environment'lar için eklendi (Production, Preview, Development)
- [ ] Local .env dosyasına eklendi (opsiyonel)
- [ ] Migration dosyaları oluşturuldu
- [ ] GitHub'a push edildi
- [ ] Vercel deploy başarılı

## 🔧 Notlar

1. **Prisma Accelerate:**
   - `prisma+postgres://...` formatı Prisma Accelerate kullanıyor
   - Daha hızlı connection pooling
   - Ücretsiz tier mevcut

2. **Migration için:**
   - Migration çalıştırırken normal PostgreSQL URL gerekebilir
   - `DATABASE_POSTGRES_URL` kullanılabilir (migration için)

3. **Vercel Build:**
   - `vercel.json`'da `prisma migrate deploy` var
   - İlk build'de otomatik migration çalışacak

