'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider' // Shadcn Slider eklemen gerekebilir: npx shadcn@latest add slider
import { Play, Pause, Columns, Youtube, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SongControlsProps {
  hasVideo: boolean
  onToggleVideo: () => void
  isVideoOpen: boolean
  onToggleColumns: () => void
  isTwoColumns: boolean
}

export default function SongControls({
  hasVideo,
  onToggleVideo,
  isVideoOpen,
  onToggleColumns,
  isTwoColumns,
}: SongControlsProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState([1]) // 1 (Yavaş) - 10 (Hızlı)

  // Otomatik Kaydırma Mantığı
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isScrolling) {
      interval = setInterval(() => {
        // Hız arttıkça pixel artar
        window.scrollBy(0, 1)
      }, 50 / scrollSpeed[0]) // Matematiksel hız ayarı
    }
    return () => clearInterval(interval)
  }, [isScrolling, scrollSpeed])

  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background/95 px-4 py-2 shadow-sm backdrop-blur transition-all">
      <div className="container flex max-w-6xl flex-wrap items-center justify-between gap-4">
        {/* Sol: Auto Scroll */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/20 p-1">
          <Button
            variant={isScrolling ? 'destructive' : 'secondary'}
            size="sm"
            onClick={() => setIsScrolling(!isScrolling)}
            className="gap-2"
          >
            {isScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="hidden sm:inline">{isScrolling ? 'Durdur' : 'Oto Kaydır'}</span>
          </Button>

          {/* Hız Slider'ı */}
          <div className="w-24 px-2 sm:w-32">
            <Slider value={scrollSpeed} onValueChange={setScrollSpeed} min={1} max={10} step={1} />
          </div>
          <span className="w-4 font-mono text-xs">{scrollSpeed}x</span>
        </div>

        {/* Sağ: Görünüm Ayarları */}
        <div className="flex items-center gap-2">
          {/* İki Sütun Butonu (Masaüstü için) */}
          <Button
            variant={isTwoColumns ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleColumns}
            className="hidden gap-2 md:flex"
            title="İki Sütun Görünümü"
          >
            <Columns className="h-4 w-4" />
            <span className="hidden lg:inline">Geniş Görünüm</span>
          </Button>

          {/* Video Butonu */}
          {hasVideo && (
            <Button
              variant={isVideoOpen ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleVideo}
              className={cn('gap-2', isVideoOpen && 'bg-red-600 text-white hover:bg-red-700')}
            >
              <Youtube className="h-4 w-4" />
              <span className="hidden sm:inline">Video</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
