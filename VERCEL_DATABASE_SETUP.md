# 🗄️ Vercel Postgres Kurulum Rehberi

## Adım 1: Vercel Dashboard'da Database Oluştur

1. **Vercel Dashboard'a git:**
   - https://vercel.com → Login
   - Projeni seç (akorify)

2. **Storage Tab'ına git:**
   - Proje sayfasında üst menüden "Storage" tab'ına tıkla
   - Veya Settings → Storage

3. **Postgres Database Oluştur:**
   - "Create Database" butonuna tıkla
   - "Postgres" seçeneğini seç
   - Database adı: `akorify-db` (veya istediğin isim)
   - Region: En yakın bölgeyi seç (örn: `iad1` - US East)
   - "Create" butonuna tıkla

4. **Otomatik Environment Variables:**
   - Vercel otomatik olarak şu değişkenleri ekler:
     - `POSTGRES_URL` (pooling için)
     - `POSTGRES_PRISMA_URL` (Prisma için - BUNU KULLAN)
     - `POSTGRES_URL_NON_POOLING` (migration için)

## Adım 2: Environment Variable Ayarla

1. **Settings → Environment Variables:**
   - Proje → Settings → Environment Variables

2. **DATABASE_URL Ekle:**
   - "Add New" butonuna tıkla
   - Name: `DATABASE_URL`
   - Value: `POSTGRES_PRISMA_URL` değerini kopyala
     - Veya direkt `POSTGRES_PRISMA_URL` kullan (Prisma otomatik algılar)
   - Environment: Tümünü seç (Production, Preview, Development)
   - "Save" tıkla

   **Not:** Eğer `POSTGRES_PRISMA_URL` görünmüyorsa:
   - Storage → Database → "Connect" butonuna tıkla
   - "Prisma" tab'ından connection string'i kopyala

## Adım 3: GitHub'a Push Et

Değişiklikleri GitHub'a push et:

```bash
git add .
git commit -m "Update: PostgreSQL schema and Vercel config"
git push
```

## Adım 4: Vercel Otomatik Deploy

1. **Vercel otomatik olarak:**
   - GitHub'dan yeni commit'i çeker
   - `prisma generate` çalıştırır
   - `prisma migrate deploy` çalıştırır (vercel.json'da ayarlı)
   - `npm run build` çalıştırır
   - Deploy eder

2. **Deploy Loglarını Kontrol Et:**
   - Vercel Dashboard → Deployments
   - En son deployment'ı seç
   - "Build Logs" tab'ına bak
   - "Prisma migrate deploy" başarılı olmalı

## Adım 5: Database'i Kontrol Et

### Vercel CLI ile (Opsiyonel):

```bash
# Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# Vercel'e login ol
vercel login

# Projeye bağlan
vercel link

# Environment variables'ları local'e çek
vercel env pull .env.local

# Prisma Studio ile database'i görüntüle
npx prisma studio
```

### Veya Vercel Dashboard'dan:

1. Storage → Database → "Data" tab
2. Tabloları görüntüle
3. SQL Editor ile sorgu çalıştır

## Adım 6: İlk Migration (Eğer Gerekirse)

Eğer migration henüz oluşturulmadıysa:

### Local'den:

```bash
# .env.local dosyasına DATABASE_URL ekle (Vercel'den aldığın)
# Sonra:
npm run db:migrate
```

### Veya Vercel Build Sırasında:

`vercel.json` dosyasında zaten ayarlı:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && npm run build"
}
```

İlk build'de otomatik migration çalışacak.

## ✅ Kontrol Listesi

- [ ] Vercel Dashboard'da Postgres database oluşturuldu
- [ ] `POSTGRES_PRISMA_URL` environment variable eklendi
- [ ] `DATABASE_URL` environment variable eklendi (veya `POSTGRES_PRISMA_URL` kullan)
- [ ] GitHub'a push edildi
- [ ] Vercel deploy başarılı
- [ ] Build loglarında "Prisma migrate deploy" başarılı
- [ ] Database'de tablolar oluştu (songs, users)

## 🔧 Troubleshooting

### "Prisma migrate deploy" hatası:
- İlk migration yoksa, local'den oluştur:
  ```bash
  npm run db:migrate
  git add prisma/migrations
  git commit -m "Add initial migration"
  git push
  ```

### "Database connection failed":
- `DATABASE_URL` doğru mu kontrol et
- `POSTGRES_PRISMA_URL` kullanıyor musun?
- Environment variable tüm environment'lar için ekli mi?

### Migration dosyaları yok:
```bash
# Local'den migration oluştur
npm run db:migrate

# Migration dosyalarını GitHub'a push et
git add prisma/migrations
git commit -m "Add database migrations"
git push
```

