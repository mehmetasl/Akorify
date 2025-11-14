/**
 * ChordPro Format Import Script
 * 
 * ChordPro format örneği:
 * {title: Şarkı Adı}
 * {artist: Sanatçı Adı}
 * {start_of_verse}
 * [Am] Yalnızlık sen ne büyük dertsin
 * [F] Kim bilir kim bilir
 * {end_of_verse}
 * {start_of_chorus}
 * [C] Nakarat satırları
 * {end_of_chorus}
 */

import { PrismaClient } from '@prisma/client'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { slugify } from '../src/lib/utils'

const prisma = new PrismaClient()

interface ChordProSong {
  title: string
  artist: string
  content: string
}

/**
 * ChordPro dosyasını parse eder
 */
function parseChordProFile(filePath: string): ChordProSong | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    let title = ''
    let artist = ''
    const verses: string[] = []
    let currentVerse: string[] = []
    let inVerse = false

    for (const line of lines) {
      const trimmed = line.trim()

      // Title
      const titleMatch = trimmed.match(/^{title:\s*(.+?)}$/i)
      if (titleMatch) {
        title = titleMatch[1].trim()
        continue
      }

      // Artist
      const artistMatch = trimmed.match(/^{artist:\s*(.+?)}$/i)
      if (artistMatch) {
        artist = artistMatch[1].trim()
        continue
      }

      // Start of verse/chorus
      if (trimmed.match(/^{start_of_(verse|chorus)}$/i)) {
        if (currentVerse.length > 0) {
          verses.push(currentVerse.join('\n'))
        }
        currentVerse = []
        inVerse = true
        continue
      }

      // End of verse/chorus
      if (trimmed.match(/^{end_of_(verse|chorus)}$/i)) {
        if (currentVerse.length > 0) {
          verses.push(currentVerse.join('\n'))
        }
        currentVerse = []
        inVerse = false
        continue
      }

      // Empty line - verse separator
      if (trimmed === '' && currentVerse.length > 0) {
        verses.push(currentVerse.join('\n'))
        currentVerse = []
        continue
      }

      // Regular line (with or without chords)
      if (trimmed && !trimmed.startsWith('{')) {
        currentVerse.push(trimmed)
      }
    }

    // Son verse'ü ekle
    if (currentVerse.length > 0) {
      verses.push(currentVerse.join('\n'))
    }

    if (!title || !artist) {
      console.warn(`⚠️  Eksik bilgi: ${filePath} - Title: ${title}, Artist: ${artist}`)
      return null
    }

    // Verse'leri birleştir (boş satırla ayır)
    const fullContent = verses.join('\n\n')

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
async function importChordProFiles(directory: string) {
  console.log(`📁 Dizin taranıyor: ${directory}\n`)

  const files = readdirSync(directory)
  const chordProFiles = files.filter(
    (file) =>
      file.toLowerCase().endsWith('.pro') ||
      file.toLowerCase().endsWith('.chordpro') ||
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
if (require.main === module) {
  main()
}

export { parseChordProFile, importChordProFiles }

