'use client'

import { useMemo } from 'react'
import { Chord } from 'chordsheetjs'
import { Minus, Plus, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChordDisplayProps {
  lyrics: string
  className?: string
  isTwoColumns?: boolean
  initialLines?: any
  onChordClick?: (chord: string) => void
  transposeStep: number
  onTransposeChange: (step: number) => void
  fontSize: number // Font boyutu prop'u
}

interface LinePair {
  chords: string
  lyrics: string
}

function isChordLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false
  const chordPattern =
    /^[A-G][#b]?(?:m|maj|min|aug|dim|sus|add|M)?[0-9]*(?:\/[A-G][#b]?)?(\s+[A-G][#b]?(?:m|maj|min|aug|dim|sus|add|M)?[0-9]*(?:\/[A-G][#b]?)?)*\s*(x\d+)?\s*$/i
  const hasTurkishChars = /[ğüşıöçĞÜŞİÖÇ]/.test(trimmed)
  const hasLongWords = /\b[a-zğüşıöç]{3,}\b/i.test(trimmed)
  const specialCases = /^(Intro:|x\d+|N|Outro:)$/i.test(trimmed)
  return (chordPattern.test(trimmed) && !hasTurkishChars && !hasLongWords) || specialCases
}

function transposeSingleLine(lineStr: string, steps: number): string {
  if (steps === 0) return lineStr
  const chordRegex = /\b[A-G][#b]?[a-zA-Z0-9#]*(?:\/[A-G][#b]?)?\b/g
  return lineStr.replace(chordRegex, (match) => {
    try {
      const chord = Chord.parse(match)
      return chord ? chord.transpose(steps).toString() : match
    } catch (e) {
      return match
    }
  })
}

function parseChordLines(content: string, transposeSteps: number): LinePair[] {
  const lines = content.split('\n')
  const pairs: LinePair[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) {
      pairs.push({ chords: '', lyrics: '' })
      continue
    }
    if (isChordLine(line)) {
      const nextLine = i + 1 < lines.length ? lines[i + 1] : ''
      const transposedChords = transposeSingleLine(line, transposeSteps)
      if (!isChordLine(nextLine)) {
        pairs.push({ chords: transposedChords, lyrics: nextLine })
        i++
      } else {
        pairs.push({ chords: transposedChords, lyrics: '' })
      }
    } else {
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
  transposeStep,
  onTransposeChange,
  onChordClick,
  fontSize, // Prop'u alıyoruz
}: ChordDisplayProps) {
  const linePairs = useMemo(() => {
    return parseChordLines(lyrics, transposeStep)
  }, [lyrics, transposeStep])

  return (
    <div className={cn('w-full', className)}>
      {/* KONTROL PANELİ (TRANSPOZE) */}
      {/* <div className="mb-6 flex break-inside-avoid items-center justify-between rounded-xl border border-border/50 bg-secondary/10 p-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Music className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">Ton Ayarı</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border bg-background p-1 shadow-sm">
          <button
            onClick={() => onTransposeChange(transposeStep - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-secondary/80"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 select-none text-center text-lg font-bold text-primary">
            {transposeStep > 0 ? `+${transposeStep}` : transposeStep}
          </span>
          <button
            onClick={() => onTransposeChange(transposeStep + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-secondary/80"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div> */}

      {/* ŞARKI GÖRÜNTÜLEME ALANI */}
      <div
        className={cn('pb-4 font-mono', isTwoColumns ? 'md:block md:columns-2 md:gap-12' : '')}
        // Ana font boyutunu burada veriyoruz
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
      >
        {linePairs.map((pair, index) => (
          <div key={index} className="mb-4 inline-block w-full break-inside-avoid">
            {/* AKOR SATIRI */}
            {pair.chords && (
              <div
                className="mb-1 select-none whitespace-pre font-bold leading-none text-primary"
                // Akorlar, sözlerden birazcık daha küçük ve orantılı olsun
                style={{ fontSize: '0.9em' }}
              >
                {pair.chords.split(/(\s+)/).map((part, i) => {
                  if (part.trim() === '') {
                    return <span key={i}>{part}</span>
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => onChordClick?.(part.trim())}
                      className="cursor-pointer rounded px-0.5 transition-colors hover:bg-primary/10 hover:text-purple-600 hover:underline"
                      title="Akor Şemasını Gör"
                    >
                      {part}
                    </button>
                  )
                })}
              </div>
            )}

            {/* SÖZ SATIRI */}
            {pair.lyrics && (
              <div className="whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                {pair.lyrics}
              </div>
            )}

            {/* BOŞ SATIR */}
            {!pair.chords && !pair.lyrics && <div className="h-6" />}
          </div>
        ))}
      </div>
    </div>
  )
}
