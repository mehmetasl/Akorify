# 🗄️ Database Kurulum Rehberi

## Adım 1: PostgreSQL Database Oluştur

### Seçenek 1: Vercel Postgres (Önerilen - En Kolay)

1. **Vercel Dashboard'a git:**
   - https://vercel.com → Projeni seç
   - "Storage" tab'ına tıkla
   - "Create Database" → "Postgres" seç
   - "Create" tıkla

2. **Otomatik olarak eklenen environment variables:**
   - `POSTGRES_URL` (pooling için)
   - `POSTGRES_PRISMA_URL` (Prisma için - BUNU KULLAN)
   - `POSTGRES_URL_NON_POOLING` (migration için)

3. **Vercel'de Environment Variable ekle:**
   - Settings → Environment Variables
   - `DATABASE_URL` adında yeni variable ekle
   - Value olarak `POSTGRES_PRISMA_URL` değerini kopyala
   - Veya direkt `POSTGRES_PRISMA_URL` kullan (Prisma otomatik algılar)

### Seçenek 2: Railway (Ücretsiz)

1. https://railway.app → "Start a New Project"
2. "Provision PostgreSQL" seç
3. PostgreSQL → "Variables" tab
4. `DATABASE_URL` değerini kopyala
5. Vercel → Settings → Environment Variables → `DATABASE_URL` ekle

### Seçenek 3: Render (Ücretsiz)

1. https://render.com → "New" → "PostgreSQL"
2. Database oluştur
3. "Internal Database URL" değerini kopyala
4. Vercel → Settings → Environment Variables → `DATABASE_URL` ekle

## Adım 2: Prisma Schema'yı Güncelle

Schema zaten güncellendi (`provider = "postgresql"`). Eğer local'de test etmek istersen:

```bash
# Local .env dosyasına DATABASE_URL ekle
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

## Adım 3: Migration Oluştur ve Deploy Et

### Local'den (Test için):

```bash
# Migration oluştur
npm run db:migrate

# Veya direkt push (development için)
npm run db:push
```

### Production (Vercel):

**Yöntem 1: Vercel CLI ile (Önerilen)**

```bash
# Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# Vercel'e login ol
vercel login

# Projeye bağlan
vercel link

# Migration deploy et
npx prisma migrate deploy
```

**Yöntem 2: Vercel Build Command ile**

`vercel.json` dosyasına build command ekle (zaten var):
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && npm run build"
}
```

**Yöntem 3: Manual (Vercel Dashboard)**

1. Vercel Dashboard → Project → Settings → Build & Development Settings
2. Build Command'ı güncelle:
   ```
   prisma generate && prisma migrate deploy && npm run build
   ```
3. "Redeploy" yap

## Adım 4: Database'i Kontrol Et

```bash
# Prisma Studio ile (local'den)
npm run db:studio

# Veya Vercel CLI ile
vercel env pull .env.local
npx prisma studio
```

## Adım 5: Şarkıları Import Et

Database kurulduktan sonra şarkıları import et:

```bash
# Local'den database'e bağlanıp import et
npm run import:all
```

## ⚠️ Önemli Notlar

1. **Vercel Postgres kullanıyorsan:**
   - `POSTGRES_PRISMA_URL` otomatik olarak `DATABASE_URL` olarak kullanılabilir
   - Veya `DATABASE_URL` = `POSTGRES_PRISMA_URL` olarak manuel ekle

2. **Migration vs Push:**
   - Production: `prisma migrate deploy` kullan
   - Development: `prisma db push` kullan

3. **Environment Variables:**
   - Vercel'de tüm environment'lar için ekle (Production, Preview, Development)
   - `DATABASE_URL` mutlaka eklenmeli

## 🔧 Troubleshooting

### "Prisma Client not generated" hatası:
```bash
npx prisma generate
```

### "Database connection failed" hatası:
- `DATABASE_URL` doğru mu kontrol et
- Database erişilebilir mi kontrol et
- Firewall ayarlarını kontrol et

### Migration hatası:
```bash
# Migration'ları sıfırla (dikkatli!)
npx prisma migrate reset

# Veya yeni migration oluştur
npx prisma migrate dev --name init
```

