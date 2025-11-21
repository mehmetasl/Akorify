'use client'

import { useState } from 'react'
import ChordDisplay from '@/components/ChordDisplay'
import SongControls from '@/components/SongControl'
import FloatingVideo from '@/components/FloatingVideo'

// Basit bir tip tanımı (Prisma'dan gelen veri yapısı)
interface Song {
  title: string
  artist: string
  content: string
  youtubeUrl?: string | null
}

interface WrapperProps {
  song: Song
}

export default function SongClientWrapper({ song }: WrapperProps) {
  // Videonun ve İki Sütun görünümünün açık/kapalı durumları
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isTwoColumns, setIsTwoColumns] = useState(false)

  return (
    <>
      {/* 1. Kontrol Paneli (Header'ın altına yapışır) */}
      <SongControls
        hasVideo={!!song.youtubeUrl}
        isVideoOpen={isVideoOpen}
        onToggleVideo={() => setIsVideoOpen(!isVideoOpen)}
        isTwoColumns={isTwoColumns}
        onToggleColumns={() => setIsTwoColumns(!isTwoColumns)}
      />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
        {/* SOL: Şarkı İçeriği */}
        <article className="min-w-0">
          {/* 
             DİKKAT: Veritabanındaki 'song.content' verisini,
             bileşenin beklediği 'lyrics' prop'una atıyoruz.
          */}
          <ChordDisplay
            lyrics={song.content}
            // ChordDisplay bileşenine bu prop'u eklediysen çalışır,
            // eklemediysen hata vermez ama sütunlara bölmez.
            // (Önceki adımlarda isTwoColumns prop'u eklemiştik)
            // @ts-ignore (Eğer ChordDisplay'de tip hatası alırsan bunu aç)
            isTwoColumns={isTwoColumns}
          />
        </article>

        {/* SAĞ: Sidebar (Reklamlar) */}
        <aside className="hidden space-y-8 lg:block">
          <div className="sticky top-24">
            {/* Sidebar Reklam Alanı */}
            <div className="flex h-[600px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
              <span className="font-mono text-xs text-muted-foreground">
                DİKEY REKLAM (300x600)
              </span>
            </div>
          </div>
        </aside>
      </div>
      {/* 2. Yüzen Video Player (Sağ Altta Çıkar) */}
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
