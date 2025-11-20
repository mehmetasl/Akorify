# 🔧 Production Import Sorun Giderme

## Sorun
- Import script "zaten mevcut" diyor
- Ama Vercel'de şarkılar görünmüyor

## Olası Nedenler

1. **Prisma Client Cache Sorunu**
   - Prisma Client bir kez oluşturulduğunda cache'lenir
   - `.env` dosyası değişse bile eski bağlantıyı kullanabilir

2. **Yanlış Database'e Bağlanma**
   - Script hala local database'e bağlanıyor olabilir

## Çözüm Adımları

### Adım 1: Hangi Database'e Bağlandığını Kontrol Et

```bash
npm run check:db
```

Bu script şunları gösterecek:
- Hangi DATABASE_URL kullanılıyor
- Database tipi (Production/Local)
- Kaç şarkı var
- Son eklenen şarkılar

### Adım 2: Prisma Client'ı Yeniden Oluştur

```bash
# Prisma Client'ı yeniden generate et
npx prisma generate

# Node modules'ı temizle (opsiyonel)
rm -rf node_modules/.prisma
npm install
```

### Adım 3: Import Script'ini Tekrar Çalıştır

```bash
# Önce database kontrolü yap
npm run check:db

# Sonra import et
node scripts/import-chordpro.js ./formatted-data
```

### Adım 4: Vercel'de Cache Temizle

1. **Vercel Dashboard → Deployments**
2. **Son deployment'ı "Redeploy" yap**
3. Veya **Settings → Clear Build Cache**

### Adım 5: Vercel'de Database Kontrolü

Vercel'deki database'e direkt bağlanıp kontrol et:

```bash
# Vercel CLI ile production database'e bağlan
vercel env pull .env.production

# .env.production'dan DATABASE_URL'i kopyala
# .env dosyasına yapıştır

# Prisma Studio ile kontrol et
npx prisma studio
```

## Hızlı Çözüm

Eğer hala çalışmıyorsa:

1. **Terminal'i kapat ve yeniden aç** (Prisma Client cache'i temizlemek için)

2. **.env dosyasını kontrol et:**
   ```env
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
   ```
   (Vercel'deki DATABASE_URL ile aynı olmalı)

3. **Prisma Client'ı yeniden generate et:**
   ```bash
   npx prisma generate
   ```

4. **Import script'ini çalıştır:**
   ```bash
   node scripts/import-chordpro.js ./formatted-data
   ```

5. **Vercel'de redeploy yap:**
   - Vercel Dashboard → Deployments → Redeploy

