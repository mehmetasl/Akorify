'use client'

import { useState } from 'react'
import ChordDisplay from '@/components/ChordDisplay'
import SongControls from '@/components/SongControls'
import FloatingVideo from '@/components/FloatingVideo'
// YENİ İMPORT:
import ChordSidebar from '@/components/ChordSidebar'

// ... interface'ler aynı ...

export default function SongClientWrapper({ song }: WrapperProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isTwoColumns, setIsTwoColumns] = useState(false)
  const [transposeStep, setTransposeStep] = useState(0)

  // Sidebar açık mı kapalı mı? (Varsayılan false olsun)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      {/* YENİ SIDEBAR BİLEŞENİ */}
      <ChordSidebar
        content={song.content}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        transposeStep={transposeStep}
      />

      {/* Header Altı Kontroller */}
      <SongControls
        hasVideo={!!song.youtubeUrl}
        isVideoOpen={isVideoOpen}
        onToggleVideo={() => setIsVideoOpen(!isVideoOpen)}
        isTwoColumns={isTwoColumns}
        onToggleColumns={() => setIsTwoColumns(!isTwoColumns)}
      />

      {/* Sayfa Düzeni */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
        {/* SOL: Şarkı İçeriği */}
        <article className="min-w-0">
          <ChordDisplay
            lyrics={song.content}
            // @ts-ignore
            isTwoColumns={isTwoColumns}
            transposeStep={transposeStep}
            onTransposeChange={setTransposeStep}
            // Akora tıklayınca Sidebar'ı aç
            onChordClick={() => setIsSidebarOpen(true)}
          />
        </article>

        {/* SAĞ: Reklam Alanı */}
        <aside className="hidden space-y-8 lg:block">
          <div className="sticky top-32">
            <div className="flex h-[600px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
              <span className="font-mono text-xs text-muted-foreground">
                DİKEY REKLAM (300x600)
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Video Player */}
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
