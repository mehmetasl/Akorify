'use client'

import { useState, useEffect, useMemo } from 'react'
import ChordDisplay from '@/components/ChordDisplay'
import FloatingVideo from '@/components/FloatingVideo'
import ChordSidebar from '@/components/ChordSidebar'
import SongHeader from '@/components/SongHeader'
import { extractUniqueChords } from '@/lib/chord-db'
import { Chord } from 'chordsheetjs'
import { toggleRepertoire } from '@/actions/repertoire' // Action importu
import { useRouter } from 'next/navigation'

interface Song {
  id: string
  title: string
  artist: string
  content: string
  youtubeUrl?: string | null
}
interface WrapperProps {
  song: Song
  isFavorited: boolean
}
export default function SongClientWrapper({ song, isFavorited }: WrapperProps) {
  // --- STATE'LER ---
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isTwoColumns, setIsTwoColumns] = useState(false)
  const [transposeStep, setTransposeStep] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedChord, setSelectedChord] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(16)
  const [isInRepertoire, setIsInRepertoire] = useState(isFavorited)

  const router = useRouter()

  const handleRepertoireToggle = async () => {
    // 1. Optimistic Update (Hemen rengi değiştir, kullanıcı beklemesin)
    const previousState = isInRepertoire
    setIsInRepertoire(!isInRepertoire)

    // 2. Sunucu işlemini yap
    const result = await toggleRepertoire(song.id as string) // song.id string olmalı

    if (result.error) {
      // Hata varsa (örn: giriş yapmamış) geri al
      setIsInRepertoire(previousState)
      alert(result.error) // Veya toast mesajı
      router.push('/giris') // Girişe yönlendir
    }
  }
  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)

    // Eğer font 20px'den büyükse, 2 sütun görünümü sığmaz, kapat.
    if (newSize > 20 && isTwoColumns) {
      setIsTwoColumns(false)
    }
  }
  const handleToggleColumns = () => {
    // Eğer font çok büyükse sütunlara bölmeye izin verme
    if (fontSize > 20) {
      alert('Yazı boyutu çok büyükken ikiye bölünemez. Lütfen fontu küçültün.')
      return
    }
    setIsTwoColumns(!isTwoColumns)
  }
  // --- USE EFFECT (Oto Kaydır) ---
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isScrolling) {
      interval = setInterval(() => {
        window.scrollBy(0, 1)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isScrolling])

  // --- MEMO (Akor Hesaplama) ---
  const originalChords = useMemo(() => extractUniqueChords(song.content), [song.content])

  const headerChords = useMemo(() => {
    if (transposeStep === 0) return originalChords
    return originalChords.map((chordName) => {
      try {
        const chord = Chord.parse(chordName)
        return chord ? chord.transpose(transposeStep).toString() : chordName
      } catch {
        return chordName
      }
    })
  }, [originalChords, transposeStep])

  // ⭐ GÜNCELLENMİŞ MANTIK BURADA ⭐
  const handleChordToggle = (chord: string) => {
    if (isSidebarOpen) {
      // Eğer menü AÇIKSA -> Direkt KAPAT (Hangi akora basıldığına bakmaksızın)
      setIsSidebarOpen(false)
      setSelectedChord(null)
    } else {
      // Eğer menü KAPALIYSA -> AÇ ve tıklanan akoru seç
      setIsSidebarOpen(true)
      setSelectedChord(chord)
    }
  }

  return (
    <>
      <SongHeader
        title={song.title}
        artist={song.artist}
        chords={headerChords}
        // Header'daki tıklamalar da aynı mantığı kullansın
        selectedChord={selectedChord}
        onChordToggle={handleChordToggle}
        transposeStep={transposeStep}
        onTranspose={setTransposeStep}
        isScrolling={isScrolling}
        onAutoScroll={() => setIsScrolling(!isScrolling)}
        isTwoColumns={isTwoColumns}
        onToggleColumns={handleToggleColumns}
        hasVideo={!!song.youtubeUrl}
        isVideoOpen={isVideoOpen}
        onToggleVideo={() => setIsVideoOpen(!isVideoOpen)}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        isInRepertoire={isInRepertoire}
        onToggleRepertoire={handleRepertoireToggle}
      />

      <ChordSidebar
        content={song.content}
        isOpen={isSidebarOpen}
        // Sidebar X tuşu ile kapanırsa state'i temizle
        onToggle={() => {
          setIsSidebarOpen(!isSidebarOpen)
          if (isSidebarOpen) setSelectedChord(null)
        }}
        transposeStep={transposeStep}
      />

      <div className="container mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
        <article className="min-w-0">
          <ChordDisplay
            lyrics={song.content}
            isTwoColumns={isTwoColumns}
            transposeStep={transposeStep}
            onTransposeChange={setTransposeStep}
            // Metindeki akora tıklayınca yukarıdaki "Aç/Kapa" fonksiyonu çalışır
            onChordClick={(chord) => handleChordToggle(chord)}
            fontSize={fontSize}
          />
        </article>

        {/* <aside className="hidden space-y-8 lg:block">
          <div className="sticky top-32">
            <div className="flex h-[600px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
              <span className="font-mono text-xs text-muted-foreground">REKLAM</span>
            </div>
          </div>
        </aside> */}
      </div>

      {song.youtubeUrl && (
        <FloatingVideo
          url={song.youtubeUrl}
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </>
  )
}
