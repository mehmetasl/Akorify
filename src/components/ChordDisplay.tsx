'use client'

import { useState, useMemo } from 'react'
import { Chord } from 'chordsheetjs'
import { Minus, Plus, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChordDisplayProps {
  lyrics: string
  className?: string
  isTwoColumns?: boolean
  initialLines?: any
}

interface LinePair {
  chords: string
  lyrics: string
}

/**
 * Bir satırın akor satırı olup olmadığını kontrol eder.
 */
function isChordLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false

  const chordPattern = /^[A-G][#b]?[m]?[0-9]?(\s+[A-G][#b]?[m]?[0-9]?)*\s*(x\d+)?\s*$/i

  const hasTurkishChars = /[ğüşıöçĞÜŞİÖÇ]/.test(trimmed)
  const hasLongWords = /\b[a-zğüşıöç]{3,}\b/i.test(trimmed)
  const specialCases = /^(Intro:|x\d+|N|Outro:)$/i.test(trimmed)

  return (chordPattern.test(trimmed) && !hasTurkishChars && !hasLongWords) || specialCases
}

/**
 * YARDIMCI FONKSİYON: Akorları bulur ve transpoze eder.
 */
function transposeSingleLine(lineStr: string, steps: number): string {
  if (steps === 0) return lineStr

  // Regex: A'dan G'ye harfle başlayan ve akor formatına uyan kelimeleri bulur.
  const chordRegex = /\b[A-G][#b]?[a-zA-Z0-9#]*(?:\/[A-G][#b]?)?\b/g

  return lineStr.replace(chordRegex, (match) => {
    try {
      const chord = Chord.parse(match)
      // Akorun transpoze edilmiş halini string olarak al
      return chord ? chord.transpose(steps).toString() : match
    } catch (e) {
      return match
    }
  })
}

/**
 * İçeriği satır satır analiz eder
 */
function parseChordLines(content: string, transposeSteps: number): LinePair[] {
  const lines = content.split('\n')
  const pairs: LinePair[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Boş satır
    if (!line.trim()) {
      pairs.push({ chords: '', lyrics: '' })
      continue
    }

    // Akor satırı mı?
    if (isChordLine(line)) {
      const nextLine = i + 1 < lines.length ? lines[i + 1] : ''

      // Akor satırını transpoze et
      const transposedChords = transposeSingleLine(line, transposeSteps)

      // Sonraki satır söz mü?
      if (!isChordLine(nextLine)) {
        pairs.push({
          chords: transposedChords,
          lyrics: nextLine,
        })
        i++ // Söz satırını işledik, atla
      } else {
        // Sadece akor satırı (altında söz yok)
        pairs.push({ chords: transposedChords, lyrics: '' })
      }
    } else {
      // Sadece söz satırı
      pairs.push({ chords: '', lyrics: line })
    }
  }
  return pairs
}

export default function ChordDisplay({
  lyrics,
  className = '',
  isTwoColumns = false,
  initialLines,
}: ChordDisplayProps) {
  const [transpose, setTranspose] = useState(0)

  const linePairs = useMemo(() => {
    return parseChordLines(lyrics, transpose)
  }, [lyrics, transpose])

  return (
    <div className={cn('w-full', className)}>
      {/* KONTROL PANELİ */}
      <div className="mb-6 flex break-inside-avoid items-center justify-between rounded-xl border border-border/50 bg-secondary/10 p-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Music className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">Ton Ayarı</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border bg-background p-1 shadow-sm">
          <button
            onClick={() => setTranspose((t) => t - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-secondary/80"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 select-none text-center text-lg font-bold text-primary">
            {transpose > 0 ? `+${transpose}` : transpose}
          </span>
          <button
            onClick={() => setTranspose((t) => t + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-secondary/80"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ŞARKI GÖRÜNTÜLEME ALANI */}
      <div
        className={cn(
          'pb-4 font-mono text-base',
          // İki sütun açıksa ve ekran genişse (md) sütunlara böl
          isTwoColumns ? 'md:block md:columns-2 md:gap-12' : ''
        )}
      >
        {linePairs.map((pair, index) => (
          <div
            key={index}
            // break-inside-avoid: Bu kutuyu (akor+söz) asla ortadan bölme
            // inline-block w-full: Sütun yapısında rendering hatasını önler
            className="mb-4 inline-block w-full break-inside-avoid"
          >
            {/* Akor Satırı */}
            {pair.chords && (
              <div className="mb-1 select-none whitespace-pre text-sm font-bold leading-none text-primary">
                {pair.chords}
              </div>
            )}

            {/* Söz Satırı */}
            {pair.lyrics && (
              <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-foreground">
                {pair.lyrics}
              </div>
            )}

            {/* Boş Satır */}
            {!pair.chords && !pair.lyrics && <div className="h-6" />}
          </div>
        ))}
      </div>
    </div>
  )
}
