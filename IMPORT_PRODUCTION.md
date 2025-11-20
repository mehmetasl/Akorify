# 📥 Production Database'e Veri Import Rehberi

## Adım 1: Vercel CLI Kurulumu

```bash
# Vercel CLI yükle (eğer yoksa)
npm i -g vercel
```

## Adım 2: Vercel'e Bağlan

```bash
# Vercel'e login ol
vercel login

# Projeye bağlan (eğer daha önce bağlanmadıysan)
vercel link
```

## Adım 3: Production Environment Variables'ları Çek

```bash
# Production environment variables'ları .env.production dosyasına çek
vercel env pull .env.production
```

Bu komut `.env.production` dosyası oluşturacak.

## Adım 4: DATABASE_URL'i Kullan

İki seçenek var:

### Seçenek A: .env.production'ı kullan (geçici)

```bash
# Windows PowerShell
$env:DATABASE_URL = (Get-Content .env.production | Select-String "DATABASE_URL").ToString().Split("=")[1].Trim('"')

# Sonra import script'ini çalıştır
node scripts/import-chordpro.js ./formatted-data
```

### Seçenek B: .env.production'dan DATABASE_URL'i kopyala

1. `.env.production` dosyasını aç
2. `DATABASE_URL` satırını bul
3. Değerini kopyala
4. `.env` dosyasına ekle (veya mevcut `DATABASE_URL`'i güncelle)
5. Import script'ini çalıştır:

```bash
node scripts/import-chordpro.js ./formatted-data
```

## Adım 5: Import Sonucunu Kontrol

Script çalıştıktan sonra:
- Kaç şarkı import edildi?
- Hata var mı?

## Adım 6: Production Site'ı Kontrol Et

1. Vercel Dashboard → Visit butonuna tıkla
2. Anasayfada şarkılar görünüyor mu?
3. Bir şarkıya tıklayıp detay sayfasını kontrol et

