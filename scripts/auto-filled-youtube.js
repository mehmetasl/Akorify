const { PrismaClient } = require('@prisma/client');
const ytSearch = require('yt-search');

const prisma = new PrismaClient();

// YouTube'un bizi engellememesi için bekleme fonksiyonu
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🔍 Youtube linki olmayan şarkılar aranıyor...');

  // 1. Sadece Youtube linki BOŞ olan şarkıları çek
  const songsToUpdate = await prisma.song.findMany({
    where: {
      youtubeUrl: null, // veya boş string olabilir, duruma göre
    },
    select: {
      id: true,
      title: true,
      artist: true,
    },
  });

  console.log(`📝 Toplam ${songsToUpdate.length} şarkı bulundu. İşlem başlıyor...\n`);

  for (const song of songsToUpdate) {
    try {
      // 2. Arama terimini oluştur (Örn: "Duman Melek official audio")
      const searchTerm = `${song.artist} - ${song.title} official audio`;
      
      console.log(`🔎 Aranıyor: "${searchTerm}"`);

      // 3. YouTube'da ara
      const searchResult = await ytSearch(searchTerm);

      // İlk videoyu al
      const firstVideo = searchResult.videos.length > 0 ? searchResult.videos[0] : null;

      if (firstVideo) {
        const videoUrl = firstVideo.url;

        // 4. Veritabanını güncelle
        await prisma.song.update({
          where: { id: song.id },
          data: { youtubeUrl: videoUrl },
        });

        console.log(`✅ Eşleşti: ${song.title} -> ${videoUrl}`);
      } else {
        console.log(`⚠️ Video Bulunamadı: ${song.title}`);
      }

      // YouTube spam sanmasın diye 2 saniye bekle
      await delay(2000);

    } catch (error) {
      console.error(`❌ Hata (${song.title}):`, error.message);
    }
  }

  console.log('\n🏁 Tüm işlemler tamamlandı!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());