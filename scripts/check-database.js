/**
 * Database Bağlantı Kontrol Script'i
 * Hangi database'e bağlandığını gösterir
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function main() {
  console.log('🔍 Database Bağlantı Kontrolü\n')
  
  // DATABASE_URL'i göster (ilk 50 karakter)
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL
    console.log(`📋 DATABASE_URL: ${dbUrl.substring(0, 80)}...`)
    
    // Database tipini belirle
    if (dbUrl.startsWith('prisma+postgres://')) {
      console.log('✅ Prisma Accelerate (Production) kullanılıyor')
    } else if (dbUrl.startsWith('postgres://')) {
      console.log('✅ Normal PostgreSQL kullanılıyor')
    } else if (dbUrl.startsWith('file:')) {
      console.log('⚠️  SQLite (Local) kullanılıyor')
    } else {
      console.log('❓ Bilinmeyen database tipi')
    }
  } else {
    console.log('❌ DATABASE_URL bulunamadı!')
    process.exit(1)
  }

  console.log('\n🔗 Database bağlantısı test ediliyor...\n')

  try {
    // Database'e bağlan
    await prisma.$connect()
    console.log('✅ Database bağlantısı başarılı!\n')

    // Şarkı sayısını kontrol et
    const songCount = await prisma.song.count()
    console.log(`📊 Toplam şarkı sayısı: ${songCount}`)

    if (songCount > 0) {
      // İlk 5 şarkıyı göster
      const songs = await prisma.song.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          title: true,
          artist: true,
          slug: true,
        },
      })

      console.log('\n📝 Son eklenen 5 şarkı:')
      songs.forEach((song, index) => {
        console.log(`   ${index + 1}. ${song.artist} - ${song.title} (${song.slug})`)
      })
    } else {
      console.log('\n⚠️  Database'de şarkı bulunamadı!')
    }
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

