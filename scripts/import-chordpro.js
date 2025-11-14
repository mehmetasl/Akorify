/**
 * ChordPro Format Import Script (JavaScript version for direct execution)
 * 
 * Kullanım: node scripts/import-chordpro.js [dizin-yolu]
 * Örnek: node scripts/import-chordpro.js ./chordpro-files
 */

const { PrismaClient } = require('@prisma/client')
const { readFileSync, readdirSync, statSync } = require('fs')
const { join } = require('path')

const prisma = new PrismaClient()

/**
 * Slugify function
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * ChordPro/CHO dosyasını parse eder
 * Format dönüştürme YAPMAZ - içeriği olduğu gibi alır
 * Sadece title ve artist'i çıkarır, geri kalanı olduğu gibi saklar
 */
function parseChordProFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    let title = ''
    let artist = ''
    const contentLines = []
    let foundTitle = false
    let foundArtist = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Title - çeşitli formatları destekle
      if (!foundTitle) {
        const titleMatch1 = trimmed.match(/^{title:\s*(.+?)}$/i)
        const titleMatch2 = trimmed.match(/^title:\s*(.+?)$/i)
        const titleMatch3 = trimmed.match(/^#title:\s*(.+?)$/i)
        
        if (titleMatch1) {
          title = titleMatch1[1].trim()
          foundTitle = true
          continue
        } else if (titleMatch2) {
          title = titleMatch2[1].trim()
          foundTitle = true
          continue
        } else if (titleMatch3) {
          title = titleMatch3[1].trim()
          foundTitle = true
          continue
        }
      }

      // Artist - çeşitli formatları destekle
      if (!foundArtist) {
        const artistMatch1 = trimmed.match(/^{artist:\s*(.+?)}$/i)
        const artistMatch2 = trimmed.match(/^artist:\s*(.+?)$/i)
        const artistMatch3 = trimmed.match(/^#artist:\s*(.+?)$/i)
        const artistMatch4 = trimmed.match(/^#\s*(.+?)$/i) // Sadece # ile başlayan satır
        
        if (artistMatch1) {
          artist = artistMatch1[1].trim()
          foundArtist = true
          continue
        } else if (artistMatch2) {
          artist = artistMatch2[1].trim()
          foundArtist = true
          continue
        } else if (artistMatch3) {
          artist = artistMatch3[1].trim()
          foundArtist = true
          continue
        } else if (artistMatch4 && !foundTitle && !foundArtist) {
          // Eğer henüz title/artist bulunamadıysa, # ile başlayan satır artist olabilir
          artist = artistMatch4[1].trim()
          foundArtist = true
          continue
        }
      }

      // Meta tag'leri atla (start_of_verse, end_of_verse, vb.)
      if (trimmed.match(/^{start_of_(verse|chorus)}$/i) || 
          trimmed.match(/^{end_of_(verse|chorus)}$/i) ||
          (trimmed.startsWith('{') && trimmed.endsWith('}') && 
           !trimmed.match(/^{(title|artist):/i))) {
        continue
      }

      // Diğer tüm satırları olduğu gibi ekle (format dönüştürme YOK)
      contentLines.push(line)
    }

    // Title ve artist bulunamadıysa, dosya adından çıkarmayı dene
    if (!title || !artist) {
      const fileName = filePath.split(/[/\\]/).pop().replace(/\.(pro|cho|chordpro|txt)$/i, '')
      
      // Dosya adından title ve artist çıkarmayı dene (örn: "Artist - Title.cho")
      const nameMatch = fileName.match(/^(.+?)\s*-\s*(.+?)$/)
      if (nameMatch && !artist) {
        artist = nameMatch[1].trim()
        title = nameMatch[2].trim()
      } else if (!title) {
        title = fileName
      }
    }

    if (!title) {
      console.warn(`⚠️  Title bulunamadı: ${filePath}`)
      return null
    }

    if (!artist) {
      console.warn(`⚠️  Artist bulunamadı, "Bilinmeyen" olarak ayarlandı: ${filePath}`)
      artist = 'Bilinmeyen'
    }

    // İçeriği olduğu gibi birleştir (son boş satırları temizle)
    let fullContent = contentLines.join('\n').trim()

    // Eğer içerik boşsa, uyarı ver
    if (!fullContent) {
      console.warn(`⚠️  İçerik boş: ${filePath}`)
      fullContent = '(İçerik bulunamadı)'
    }

    return {
      title,
      artist,
      content: fullContent,
    }
  } catch (error) {
    console.error(`❌ Hata parsing: ${filePath}`, error)
    return null
  }
}

/**
 * Tüm .pro veya .chordpro dosyalarını import eder
 */
async function importChordProFiles(directory) {
  console.log(`📁 Dizin taranıyor: ${directory}\n`)

  const files = readdirSync(directory)
  const chordProFiles = files.filter(
    (file) =>
      file.toLowerCase().endsWith('.pro') ||
      file.toLowerCase().endsWith('.chordpro') ||
      file.toLowerCase().endsWith('.cho') ||
      file.toLowerCase().endsWith('.txt')
  )

  if (chordProFiles.length === 0) {
    console.log('❌ ChordPro dosyası bulunamadı!')
    return
  }

  console.log(`📄 ${chordProFiles.length} dosya bulundu\n`)

  let imported = 0
  let skipped = 0
  let errors = 0

  for (const file of chordProFiles) {
    const filePath = join(directory, file)
    const stats = statSync(filePath)

    // Sadece dosyaları işle (dizinleri değil)
    if (!stats.isFile()) continue

    console.log(`📖 İşleniyor: ${file}`)

    const song = parseChordProFile(filePath)

    if (!song) {
      errors++
      console.log(`   ❌ Parse edilemedi\n`)
      continue
    }

    const slug = slugify(`${song.artist}-${song.title}`)

    try {
      // Mevcut şarkıyı kontrol et
      const existing = await prisma.song.findUnique({
        where: { slug },
      })

      if (existing) {
        console.log(`   ⏭️  Zaten mevcut: ${song.title} - ${song.artist}`)
        skipped++
        continue
      }

      // Yeni şarkıyı ekle
      await prisma.song.create({
        data: {
          title: song.title,
          artist: song.artist,
          slug,
          content: song.content,
        },
      })

      console.log(`   ✅ İçe aktarıldı: ${song.title} - ${song.artist}`)
      imported++
    } catch (error) {
      console.error(`   ❌ Veritabanı hatası:`, error)
      errors++
    }

    console.log('')
  }

  console.log('\n📊 Özet:')
  console.log(`   ✅ İçe aktarılan: ${imported}`)
  console.log(`   ⏭️  Atlanan: ${skipped}`)
  console.log(`   ❌ Hatalar: ${errors}`)
}

/**
 * Ana fonksiyon
 */
async function main() {
  const args = process.argv.slice(2)
  const directory = args[0] || './chordpro-files'

  console.log('🎵 ChordPro Import Script\n')
  console.log(`📂 Hedef dizin: ${directory}\n`)

  try {
    await importChordProFiles(directory)
  } catch (error) {
    console.error('❌ Kritik hata:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Script çalıştır
main()

