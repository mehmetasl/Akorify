# 🚀 Production Database'e Veri Import

## Sorun
Local database'e import yapılıyor ama production database'e import yapılmıyor.

## Çözüm

### Yöntem 1: .env Dosyasını Geçici Olarak Değiştir (Önerilen)

1. **Vercel Dashboard'dan Production DATABASE_URL'i al:**
   - Vercel Dashboard → Settings → Environment Variables
   - `DATABASE_URL`'i bul
   - Value'yu kopyala

2. **Local .env dosyasını yedekle:**
   ```bash
   # .env dosyasını yedekle
   copy .env .env.local.backup
   ```

3. **.env dosyasındaki DATABASE_URL'i production URL ile değiştir:**
   - `.env` dosyasını aç
   - `DATABASE_URL` satırını bul
   - Production URL'i yapıştır:
     ```env
     DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
     ```

4. **Import script'ini çalıştır:**
   ```bash
   node scripts/import-chordpro.js ./formatted-data
   ```

5. **.env dosyasını geri yükle (opsiyonel):**
   ```bash
   # Local database'e geri dönmek istersen
   copy .env.local.backup .env
   ```

### Yöntem 2: Yeni Production Import Script Kullan

Yeni script oluşturuldu: `scripts/import-production.js`

```bash
# Production import script'ini çalıştır
npm run import:production
```

**Not:** Bu script `.env` dosyasındaki `DATABASE_URL`'i kullanır, bu yüzden önce `.env` dosyasını production URL ile güncelle.

### Yöntem 3: Environment Variable ile Direkt Kullan

PowerShell'de:

```powershell
# Production DATABASE_URL'i environment variable olarak ayarla
$env:DATABASE_URL = "prisma+postgres://accelerate.prisma-data.net/?api_key=..."

# Import script'ini çalıştır
node scripts/import-chordpro.js ./formatted-data
```

## Kontrol

Import sonrası:

1. **Vercel Dashboard → Visit butonuna tıkla**
2. **Anasayfada şarkılar görünüyor mu?**
3. **Bir şarkıya tıklayıp detay sayfasını kontrol et**

## Önemli Notlar

- Production database'e import yaparken `.env` dosyasındaki `DATABASE_URL` production URL olmalı
- Import sonrası local'de çalışmaya devam edeceksen `.env` dosyasını local URL ile geri yükle
- Production database'e import yapmak için Vercel CLI gerekmez, sadece production `DATABASE_URL` yeterli

