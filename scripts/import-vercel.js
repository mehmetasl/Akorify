const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Dosya yolunun doğru olduğundan emin ol
const DATA_FOLDER = path.join(__dirname, '../after-added');

// Türkçe karakter dostu Slug oluşturucu
function slugify(text) {
  if (!text) return '';
  const trMap = {
    'ğ': 'g', 'Ğ': 'g', 'ü': 'u', 'Ü': 'u', 'ş': 's', 'Ş': 's',
    'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
  };
  
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log('🚀 İşlem Başlıyor...');
  console.log(`📂 Hedef Klasör: ${DATA_FOLDER}`);

  // 1. Klasör Kontrolü
  if (!fs.existsSync(DATA_FOLDER)) {
    console.error('❌ HATA: Klasör bulunamadı! Lütfen "formatted-data" klasörünü proje ana dizinine koyduğundan emin ol.');
    return;
  }

  const files = fs.readdirSync(DATA_FOLDER).filter(file => file.endsWith('.cho'));
  
  if (files.length === 0) {
    console.error('❌ HATA: Klasörde hiç .txt dosyası yok.');
    return;
  }

  console.log(`📝 ${files.length} adet dosya bulundu. Veritabanına yazılıyor...\n`);

  for (const file of files) {
    try {
      const filePath = path.join(DATA_FOLDER, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');

      // Satır satır ayır (Windows \r\n veya Linux \n fark etmez)
      const lines = rawContent.split(/\r?\n/);

      let title = '';
      let artist = '';
      let youtubeUrl = null;
      let contentLines = [];

      // 2. Satır Satır Analiz
      for (const line of lines) {
        // Metadata satırı mı?
        if (line.trim().startsWith('{title:')) {
          title = line.replace('{title:', '').replace('}', '').trim();
        } 
        else if (line.trim().startsWith('{artist:')) {
          artist = line.replace('{artist:', '').replace('}', '').trim();
        }
        else if (line.trim().startsWith('{youtube:')) {
          youtubeUrl = line.replace('{youtube:', '').replace('}', '').trim();
        }
        else {
          // Metadata değilse şarkı içeriğidir.
          // DİKKAT: Satırın başındaki boşlukları silmiyoruz (trim yapmıyoruz)!
          // Tab varsa 4 boşluğa çeviriyoruz.
          contentLines.push(line.replace(/\t/g, '    '));
        }
      }

      // 3. Veri Kontrolü
      if (!title || !artist) {
        console.warn(`⚠️  ATLANDI: "${file}" dosyasında {title:..} veya {artist:..} eksik.`);
        continue;
      }

      // İçeriği birleştir (Baştaki ve sondaki gereksiz boş satırları temizle ama aradakilere dokunma)
      const finalContent = contentLines.join('\n').trim();
      
      const slug = slugify(`${title}-${artist}`);

      // 4. Veritabanına Yazma
      await prisma.song.upsert({
        where: { slug: slug },
        update: {
          title,
          artist,
          content: finalContent,
          youtubeUrl,
        },
        create: {
          slug,
          title,
          artist,
          content: finalContent,
          youtubeUrl,
        },
      });

      console.log(`✅ Eklendi: ${title} - ${artist}`);

    } catch (error) {
      console.error(`❌ HATA (${file}):`, error.message);
    }
  }

  console.log('\n🏁 İşlem Tamamlandı!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());