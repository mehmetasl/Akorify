# 🗄️ Supabase + Prisma Kurulum Rehberi

## Prisma vs Database

**Prisma = ORM (Object-Relational Mapping)**
- Database değil, database ile çalışma aracı
- Type-safe sorgular yazmanı sağlar
- Schema yönetimi ve migration'lar
- TypeScript tipleri otomatik oluşturur

**Supabase = PostgreSQL Database**
- Gerçek database
- Prisma ile kullanılabilir

## Adım 1: Supabase'den Connection String Al

1. **Supabase Dashboard'a git:**
   - https://supabase.com → Projeni seç
   - "Settings" → "Database"
   - "Connection string" bölümüne git
   - "URI" formatını seç

2. **Connection String formatı:**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

3. **Pooler Connection (Önerilen - Prisma için):**
   - "Connection pooling" → "Session mode" veya "Transaction mode"
   - Port: `6543` (pooler port)
   - Format:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

## Adım 2: Vercel'e Environment Variable Ekle

1. **Vercel Dashboard:**
   - Project → Settings → Environment Variables
   - `DATABASE_URL` ekle
   - Value: Supabase'den aldığın connection string
   - Tüm environment'lar için ekle (Production, Preview, Development)

2. **Local .env dosyası (opsiyonel):**
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

## Adım 3: Prisma Schema Kontrol

Schema zaten PostgreSQL için ayarlı:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Adım 4: Migration Oluştur ve Deploy

### Local'den (ilk kez):

```bash
# Migration oluştur
npm run db:migrate

# Veya direkt push (development için)
npm run db:push
```

### Production (Vercel):

Vercel otomatik olarak build sırasında migration çalıştıracak (`vercel.json`'da ayarlı).

Veya manuel:
```bash
# Vercel CLI ile
npx prisma migrate deploy
```

## Adım 5: Test Et

```bash
# Local'den Supabase'e bağlan
npm run db:studio

# Veya
npx prisma studio
```

## ⚠️ Önemli Notlar

1. **Connection Pooling:**
   - Supabase pooler kullan (port 6543)
   - Daha iyi performans
   - Connection limit sorunlarını önler

2. **Password:**
   - Supabase dashboard → Settings → Database → "Database password"
   - Eğer unuttuysan, reset edebilirsin

3. **SSL:**
   - Supabase SSL gerektirir
   - Prisma otomatik olarak SSL kullanır
   - Connection string'e `?sslmode=require` ekleyebilirsin (genelde gerekmez)

4. **Environment Variables:**
   - `DATABASE_URL` mutlaka eklenmeli
   - Vercel'de Production, Preview, Development için ayrı ayrı ekle

## 🔧 Troubleshooting

### "Connection refused" hatası:
- Connection string doğru mu?
- Password doğru mu?
- IP whitelist kontrolü (Supabase → Settings → Database → Connection pooling)

### "Too many connections" hatası:
- Pooler connection kullan (port 6543)
- Connection string'de `?pgbouncer=true` ekle

### Migration hatası:
```bash
# Migration'ları kontrol et
npx prisma migrate status

# Yeni migration oluştur
npx prisma migrate dev --name init
```

