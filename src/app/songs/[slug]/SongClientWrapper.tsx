'use client'

import { useState, useEffect, useMemo } from 'react'
import ChordDisplay from '@/components/ChordDisplay'
import FloatingVideo from '@/components/FloatingVideo'
import ChordSidebar from '@/components/ChordSidebar'
import SongHeader from '@/components/SongHeader'
import { extractUniqueChords } from '@/lib/chord-db'
import { Chord } from 'chordsheetjs'
import { toggleRepertoire } from '@/actions/repertoire'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge' // 1. Badge İmportu

interface Song {
  id: string
  title: string
  artist: string
  content: string
  youtubeUrl?: string | null
  slug: string
  versions?: {
    id: string
    title: string
    content: string
    isPublic: boolean
    user: { name: string | null }
  }[]
}

interface WrapperProps {
  song: Song
  isFavorited: boolean
}

export default function SongClientWrapper({ song, isFavorited }: WrapperProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isTwoColumns, setIsTwoColumns] = useState(false)
  const [transposeStep, setTransposeStep] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedChord, setSelectedChord] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(16)
  const [isInRepertoire, setIsInRepertoire] = useState(isFavorited)

  const [activeContent, setActiveContent] = useState(song.content)
  const [activeVersionId, setActiveVersionId] = useState('original')

  const router = useRouter()

  const handleRepertoireToggle = async () => {
    const previousState = isInRepertoire
    setIsInRepertoire(!isInRepertoire)
    const result = await toggleRepertoire(song.id as string)
    if (result.error) {
      setIsInRepertoire(previousState)
      alert(result.error)
      router.push('/giris')
    }
  }

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    if (newSize > 20 && isTwoColumns) {
      setIsTwoColumns(false)
    }
  }

  const handleToggleColumns = () => {
    if (fontSize > 20) {
      alert('Yazı boyutu çok büyükken ikiye bölünemez. Lütfen fontu küçültün.')
      return
    }
    setIsTwoColumns(!isTwoColumns)
  }

  const handleChordToggle = (chord: string) => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false)
      setSelectedChord(null)
    } else {
      setIsSidebarOpen(true)
      setSelectedChord(chord)
    }
  }

  const handleVersionChange = (content: string, id: string) => {
    setActiveContent(content)
    setActiveVersionId(id)
    setTransposeStep(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isScrolling) {
      interval = setInterval(() => {
        window.scrollBy(0, 1)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isScrolling])

  const originalChords = useMemo(() => extractUniqueChords(activeContent), [activeContent])

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

  return (
    <>
      <SongHeader
        slug={song.slug}
        title={song.title}
        artist={song.artist}
        chords={headerChords}
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
        content={activeContent}
        isOpen={isSidebarOpen}
        onToggle={() => {
          setIsSidebarOpen(!isSidebarOpen)
          if (isSidebarOpen) setSelectedChord(null)
        }}
        transposeStep={transposeStep}
      />

      <div className="container mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
        <article className="min-w-0">
          {/* --- VERSİYON SEÇİCİ TABLAR --- */}
          <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleVersionChange(song.content, 'original')}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                activeVersionId === 'original'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-secondary'
              }`}
            >
              Orijinal
            </button>

            {song.versions?.map((ver) => (
              <button
                key={ver.id}
                onClick={() => handleVersionChange(ver.content, ver.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  activeVersionId === ver.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-secondary'
                }`}
              >
                <span>{ver.title}</span>
                <span className="text-[10px] font-normal opacity-70">
                  ({ver.user?.name?.split(' ')[0] || 'Kullanıcı'})
                </span>

                {/* 2. Badge Kullanımı */}
                {!ver.isPublic && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 border-yellow-200 bg-yellow-50 px-1.5 text-[9px] font-normal text-yellow-700 hover:bg-yellow-100"
                  >
                    Özel
                  </Badge>
                )}
              </button>
            ))}
          </div>

          <ChordDisplay
            lyrics={activeContent}
            isTwoColumns={isTwoColumns}
            transposeStep={transposeStep}
            onTransposeChange={setTransposeStep}
            onChordClick={(chord) => handleChordToggle(chord)}
            fontSize={fontSize}
          />
        </article>
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
