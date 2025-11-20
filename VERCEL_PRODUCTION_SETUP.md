# 🚀 Vercel Production Kurulum ve Veri Import Rehberi

## ✅ Kontrol Listesi

### 1. Vercel Dashboard - Environment Variables Kontrol

**Vercel Dashboard → Project → Settings → Environment Variables**

Kontrol et:
- [ ] `DATABASE_URL` var mı?
  - Value: `prisma+postgres://accelerate.prisma-data.net/?api_key=...` (Prisma Accelerate URL)
  - Environment: Production, Preview, Development (tümü seçili olmalı)

Eğer yoksa:
1. "Add New" butonuna tıkla
2. Name: `DATABASE_URL`
3. Value: `DATABASE_PRISMA_DATABASE_URL` değerini yapıştır
4. Environment: Tümünü seç
5. "Save" tıkla

### 2. Migration Kontrol

Migration'lar `vercel.json`'da otomatik çalışacak:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && npm run build"
}
```

**Kontrol:**
- [ ] Vercel Dashboard → Deployments → Son deployment loglarını kontrol et
- [ ] "prisma migrate deploy" başarılı mı?

Eğer hata varsa:
```bash
# Vercel CLI ile manuel migration
vercel env pull .env.local
npx prisma migrate deploy
```

### 3. Production Database'e Veri Import

**Yöntem 1: Vercel CLI ile (Önerilen)**

```bash
# 1. Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# 2. Vercel'e login ol
vercel login

# 3. Projeye bağlan
vercel link

# 4. Production environment variables'ları local'e çek
vercel env pull .env.production

# 5. Production DATABASE_URL'i .env dosyasına ekle
# .env.production dosyasından DATABASE_URL'i kopyala ve .env'e ekle

# 6. Import script'ini çalıştır
node scripts/import-chordpro.js ./formatted-data
```

**Yöntem 2: Admin Panel API Route (Alternatif)**

Eğer Vercel CLI çalışmazsa, bir API route oluşturup admin panelden import edebiliriz.

## 🔧 Adım Adım Uygulama

### Adım 1: Vercel Environment Variables Kontrol

1. Vercel Dashboard'a git
2. Project → Settings → Environment Variables
3. `DATABASE_URL` var mı kontrol et
4. Yoksa ekle (yukarıdaki adımları takip et)

### Adım 2: GitHub'a Push ve Deploy

```bash
git add .
git commit -m "Update: Production database setup"
git push
```

Vercel otomatik deploy edecek ve migration çalıştıracak.

### Adım 3: Deploy Loglarını Kontrol

1. Vercel Dashboard → Deployments
2. Son deployment'ı aç
3. Build loglarını kontrol et:
   - ✅ `prisma generate` başarılı mı?
   - ✅ `prisma migrate deploy` başarılı mı?
   - ✅ `npm run build` başarılı mı?

### Adım 4: Production Database'e Veri Import

**Vercel CLI ile:**

```bash
# Production environment variables'ları çek
vercel env pull .env.production

# .env.production'dan DATABASE_URL'i kopyala
# .env dosyasına ekle (veya direkt .env.production'ı kullan)

# Import script'ini çalıştır
node scripts/import-chordpro.js ./formatted-data
```

**Not:** Import script'i production database'e bağlanacak ve tüm şarkıları import edecek.

## ✅ Son Kontrol

1. **Vercel Dashboard → Deployments:**
   - Son deployment başarılı mı?

2. **Production Site:**
   - Site açılıyor mu?
   - Şarkılar görünüyor mu?

3. **Database Kontrol:**
   ```bash
   # Prisma Studio ile kontrol et
   vercel env pull .env.production
   # .env dosyasına DATABASE_URL ekle
   npx prisma studio
   ```

## 🐛 Sorun Giderme

### "DATABASE_URL not found" hatası:
- Vercel Dashboard'da `DATABASE_URL` eklendi mi?
- Environment: Production seçili mi?

### Migration hatası:
- `vercel.json`'da build command doğru mu?
- Migration dosyaları GitHub'a push edildi mi?

### Import hatası:
- `.env` dosyasında `DATABASE_URL` var mı?
- Production database erişilebilir mi?

