'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Yardımcı Fonksiyon: URL'den Video ID'sini çeker
// (Bunu dosyanın içine koydum ki başka dosyayla uğraşma)
function getYouTubeID(url: string | null | undefined) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

interface FloatingVideoProps {
  url: string | null | undefined
  isOpen: boolean
  onClose: () => void
}

export default function FloatingVideo({ url, isOpen, onClose }: FloatingVideoProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 1. URL'den ID'yi al
  const videoId = getYouTubeID(url)

  // Kapalıysa, mount olmadıysa veya ID bulunamadıysa gösterme
  if (!isOpen || !isMounted || !videoId) return null

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in fixed bottom-20 right-4 z-50 h-[169px] w-[300px] overflow-hidden rounded-xl border-2 border-primary/20 bg-black shadow-2xl duration-300 sm:h-[180px] sm:w-[320px]">
      {/* Kapatma Butonu */}
      <div className="absolute right-0 top-0 z-20 p-1">
        <Button
          size="icon"
          variant="secondary"
          className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* NATIVE IFRAME: Kütüphane yok, hata yok. */}
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute left-0 top-0 h-full w-full"
      />
    </div>
  )
}
