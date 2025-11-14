'use client'

import { useMemo } from 'react'

interface ChordDisplayProps {
  lyrics: string
  className?: string
}

interface LinePair {
  chords: string
  lyrics: string
}

/**
 * Checks if a line is a chord line (only contains chord names)
 */
function isChordLine(line: string): boolean {
  const trimmed = line.trim()
  
  // Boş satır değilse kontrol et
  if (!trimmed) return false

  // Akor pattern: Am, Dm, F, E, C, G, Em, Bbm, Fm, vb.
  const chordPattern = /^[A-G][#b]?[m]?[0-9]?(\s+[A-G][#b]?[m]?[0-9]?)*\s*(x\d+)?\s*$/i
  
  // Türkçe karakter veya uzun kelimeler varsa söz satırıdır
  const hasTurkishChars = /[ğüşıöçĞÜŞİÖÇ]/.test(trimmed)
  const hasLongWords = /\b[a-zğüşıöç]{3,}\b/i.test(trimmed)
  
  // "Intro:", "x2", "N" gibi özel durumlar
  const specialCases = /^(Intro:|x\d+|N|Outro:)$/i.test(trimmed)
  
  return (chordPattern.test(trimmed) && !hasTurkishChars && !hasLongWords) || specialCases
}

/**
 * Parses chord and lyric lines from the content
 * Format: Akor satırı, sonra söz satırı (alternating)
 * Whitespace'i korur (hizalama için)
 */
function parseChordLines(content: string): LinePair[] {
  const lines = content.split('\n')
  const pairs: LinePair[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Boş satır - verse ayırıcı
    if (trimmed === '') {
      pairs.push({ chords: '', lyrics: '' })
      continue
    }

    // Akor satırı mı kontrol et
    if (isChordLine(line)) {
      // Sonraki satırı kontrol et
      const nextLine = i + 1 < lines.length ? lines[i + 1] : ''
      const nextTrimmed = nextLine.trim()

      // Eğer sonraki satır da akor satırı değilse, bu akor satırı ve sonraki söz satırı
      if (nextTrimmed && !isChordLine(nextLine)) {
        pairs.push({ 
          chords: line, // Whitespace'i koru
          lyrics: nextLine // Whitespace'i koru
        })
        i++ // Sonraki satırı atla
      } else {
        // Sadece akor satırı (sonraki satır yok veya boş veya akor)
        pairs.push({ chords: line, lyrics: '' })
      }
    } else {
      // Söz satırı (veya özel durumlar)
      // Önceki satır akor satırı mı kontrol et
      const prevLine = i > 0 ? lines[i - 1] : ''
      const prevTrimmed = prevLine.trim()

      if (prevTrimmed && isChordLine(prevLine)) {
        // Önceki satır zaten işlendi, bu satırı atla
        continue
      } else {
        // Sadece söz satırı
        pairs.push({ chords: '', lyrics: line })
      }
    }
  }

  return pairs
}

/**
 * Renders a single chord+lyric line pair with proper alignment
 */
function ChordLine({ chords, lyrics }: LinePair) {
  if (!chords && !lyrics) {
    return <div className="h-4" /> // Boş satır için boşluk
  }

  if (!chords && lyrics) {
    // Sadece söz varsa
    return (
      <div className="mb-2 font-serif text-base leading-relaxed">
        <div className="h-5" /> {/* Akor satırı için boşluk */}
        <div className="whitespace-pre-wrap">{lyrics}</div>
      </div>
    )
  }

  if (chords && !lyrics) {
    // Sadece akor varsa
    return (
      <div className="mb-2 font-mono text-sm leading-tight">
        <div className="text-primary font-bold whitespace-pre">{chords}</div>
        <div className="h-5" /> {/* Söz satırı için boşluk */}
      </div>
    )
  }

  // Hem akor hem söz varsa - hizalı göster (whitespace korunarak)
  return (
    <div className="mb-3">
      {/* Akor satırı - monospace font ile hizalama korunur */}
      <div className="text-primary font-bold whitespace-pre font-mono text-sm leading-tight mb-1">
        {chords}
      </div>
      {/* Söz satırı - serif font, whitespace korunur */}
      <div className="font-serif text-base leading-relaxed whitespace-pre text-foreground">
        {lyrics}
      </div>
    </div>
  )
}

export default function ChordDisplay({ lyrics, className = '' }: ChordDisplayProps) {
  const linePairs = useMemo(() => parseChordLines(lyrics), [lyrics])

  return (
    <div className={`chord-display ${className}`}>
      <div className="space-y-0">
        {linePairs.map((pair, index) => (
          <ChordLine key={index} chords={pair.chords} lyrics={pair.lyrics} />
        ))}
      </div>
    </div>
  )
}

