# 🚀 Deployment Guide - Akorify

Bu doküman, Akorify projesini production ortamına deploy etmek için gerekli adımları içerir.

## 📋 Ön Hazırlık

### 1. Production Build Test

Önce local'de production build'i test edin:

```bash
# Production build oluştur
npm run build

# Production server'ı başlat
npm start
```

### 2. Environment Variables

Production için gerekli environment variables:

```env
# Database (Production için PostgreSQL önerilir)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Google AdSense (Opsiyonel)
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-xxxxxxxxxxxxx"
```

## 🌐 Deployment Seçenekleri

### Seçenek 1: Vercel (Önerilen - Next.js için optimize)

**Avantajlar:**
- Next.js için optimize edilmiş
- Otomatik CI/CD
- Ücretsiz tier mevcut
- Kolay kurulum

**Adımlar:**

1. **Vercel hesabı oluştur:**
   - https://vercel.com adresine gidin
   - GitHub/GitLab/Bitbucket ile giriş yapın

2. **Projeyi deploy et:**
   ```bash
   # Vercel CLI ile
   npm i -g vercel
   vercel
   ```

   Veya Vercel dashboard'dan:
   - "New Project" butonuna tıklayın
   - GitHub repo'nuzu seçin
   - Environment variables'ları ekleyin
   - Deploy butonuna tıklayın

3. **Environment Variables ekle:**
   - Vercel Dashboard > Project Settings > Environment Variables
   - `DATABASE_URL` ekleyin
   - `NEXT_PUBLIC_APP_URL` ekleyin
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` ekleyin (opsiyonel)

4. **Database Migration:**
   ```bash
   # Vercel CLI ile veya local'den
   npx prisma migrate deploy
   # veya
   npx prisma db push
   ```

### Seçenek 2: Railway

**Avantajlar:**
- PostgreSQL database dahil
- Kolay kurulum
- Ücretsiz tier mevcut

**Adımlar:**

1. https://railway.app adresine gidin
2. "New Project" > "Deploy from GitHub repo"
3. Environment variables ekleyin
4. PostgreSQL database ekleyin (Railway otomatik `DATABASE_URL` oluşturur)

### Seçenek 3: Render

**Avantajlar:**
- PostgreSQL database dahil
- Ücretsiz tier mevcut
- Kolay kurulum

**Adımlar:**

1. https://render.com adresine gidin
2. "New" > "Web Service"
3. GitHub repo'nuzu bağlayın
4. Build Command: `npm run build`
5. Start Command: `npm start`
6. PostgreSQL database ekleyin

## 🗄️ Database Setup

### SQLite'den PostgreSQL'e Geçiş

Production için SQLite yerine PostgreSQL kullanılmalıdır.

1. **Schema'yı güncelle:**
   `prisma/schema.prisma` dosyasında:
   ```prisma
   datasource db {
     provider = "postgresql"  // "sqlite" yerine
     url      = env("DATABASE_URL")
   }
   ```

2. **Migration oluştur:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Production database'e push:**
   ```bash
   npx prisma db push
   # veya
   npx prisma migrate deploy
   ```

## 📝 Deployment Checklist

- [ ] Production build test edildi (`npm run build`)
- [ ] Environment variables hazırlandı
- [ ] Database (PostgreSQL) hazırlandı
- [ ] Prisma schema PostgreSQL için güncellendi
- [ ] Migration'lar çalıştırıldı
- [ ] `.env` dosyası `.gitignore`'da
- [ ] `NEXT_PUBLIC_APP_URL` doğru domain ile ayarlandı
- [ ] Google AdSense client ID eklendi (opsiyonel)

## 🔧 Post-Deployment

1. **Database'i kontrol et:**
   ```bash
   npx prisma studio
   ```

2. **Şarkıları import et:**
   ```bash
   npm run import:all
   ```

3. **Siteyi test et:**
   - Ana sayfa yükleniyor mu?
   - Şarkılar görünüyor mu?
   - Arama çalışıyor mu?
   - Admin panel çalışıyor mu?

## 🐛 Troubleshooting

### Build Hatası
- `npm run build` local'de çalıştırıp hataları kontrol edin
- TypeScript hatalarını düzeltin
- ESLint hatalarını düzeltin

### Database Bağlantı Hatası
- `DATABASE_URL` doğru mu?
- Database erişilebilir mi?
- Firewall ayarları kontrol edin

### Environment Variables
- Tüm gerekli variables eklendi mi?
- `NEXT_PUBLIC_` prefix'i doğru mu?

## 📚 Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

