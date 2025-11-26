'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link' // Link ekle

import {
  Minus,
  Plus,
  Heart,
  Play,
  Pause,
  Columns,
  Eye,
  EyeOff,
  Share2,
  Music,
  Youtube,
  Type,
  Edit,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { boolean } from 'zod'

interface SongHeaderProps {
  title: string
  artist: string
  chords: string[]
  onTranspose: (step: number) => void
  transposeStep: number
  onAutoScroll: () => void
  isScrolling: boolean
  onToggleColumns: () => void
  isTwoColumns: boolean

  // 👇 EKSİK OLAN VE HATAYA SEBEP OLAN KISIM BURASI 👇
  selectedChord: string | null
  onChordToggle: (chord: string) => void

  // Video Propları
  isVideoOpen: boolean
  onToggleVideo: () => void
  hasVideo: boolean
  fontSize: number
  onFontSizeChange: (size: number) => void
  isInRepertoire: boolean
  onToggleRepertoire: () => void
  slug: string
}

export default function SongHeader({
  title,
  artist,
  chords = [],
  onTranspose,
  transposeStep,
  onAutoScroll,
  isScrolling,
  onToggleColumns,
  isTwoColumns,
  isInRepertoire,
  onToggleRepertoire,
  // 👇 Bunları parametre olarak alıyoruz
  selectedChord,
  onChordToggle,

  isVideoOpen,
  onToggleVideo,
  hasVideo,
  fontSize,
  onFontSizeChange,
  slug,
}: SongHeaderProps) {
  // const [capo, setCapo] = useState(0); // İstersen kullanabilirsin
  const [showChords, setShowChords] = useState(true)

  return (
    <div className="w-full shadow-sm">
      {/* ÜST KISIM */}
      <div className="container flex flex-col justify-between gap-4 py-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-primary">{artist}</span>
            <span>•</span>
            <span className="text-sm">Gitar Akorları</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/songs/${slug}/edit`}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Düzenle</span>
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Paylaş</span>
          </Button>
          <Button
            onClick={onToggleRepertoire} // Fonksiyonu bağla
            className={cn(
              'gap-2 border-none transition-all',
              isInRepertoire
                ? 'bg-red-100 text-red-600 hover:bg-red-200' // Ekliyse açık kırmızı
                : 'bg-red-600 text-white hover:bg-red-700' // Değilse koyu kırmızı
            )}
          >
            {/* İkon dolu veya boş olsun */}
            <Heart
              onClick={onToggleRepertoire}
              className={cn('h-4 w-4', isInRepertoire && 'fill-current')}
            />
            <span className="hidden sm:inline">
              {isInRepertoire ? 'Repertuarda' : 'Repertuara Ekle'}
            </span>
          </Button>
        </div>
      </div>

      {/* ARAÇ ÇUBUĞU */}
      <div className="">
        <div className="container flex flex-wrap items-center gap-4 py-3 md:gap-8">
          {/* Transpoze */}
          <div className="flex items-center gap-2 rounded-md border bg-background p-1 shadow-sm">
            <span className="px-2 text-xs font-bold uppercase text-muted-foreground">Ton</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onTranspose(transposeStep - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-mono font-bold text-primary">
              {transposeStep > 0 ? `+${transposeStep}` : transposeStep}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onTranspose(transposeStep + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-background p-1 shadow-sm">
            <span className="px-2 text-xs font-bold uppercase text-muted-foreground">
              <Type className="h-4 w-4" /> {/* İkon */}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))} // Min 12px
              title="Küçült"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center font-mono text-xs font-bold text-primary">
              {fontSize}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onFontSizeChange(Math.min(32, fontSize + 2))} // Max 32px
              title="Büyüt"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          {/* Aksiyon Butonları */}
          <div className="ml-auto flex items-center gap-2">
            {/* Video Butonu */}
            {hasVideo && (
              <Button
                variant={isVideoOpen ? 'destructive' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={onToggleVideo}
              >
                <Youtube className="h-4 w-4" />
                <span className="hidden sm:inline">{isVideoOpen ? 'Kapat' : 'Video'}</span>
              </Button>
            )}

            <Button
              variant={isScrolling ? 'secondary' : 'outline'}
              size="sm"
              className={cn('gap-2', isScrolling && 'border-green-200 bg-green-50 text-green-600')}
              onClick={onAutoScroll}
            >
              {isScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="hidden sm:inline">Oto Kaydır</span>
            </Button>

            <Button
              variant={isTwoColumns ? 'secondary' : 'outline'}
              size="sm"
              onClick={onToggleColumns}
              className="hidden md:flex"
              title="İki Sütun"
            >
              <Columns className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* AKOR ŞERİDİ */}
      <div className="scrollbar-hide container overflow-x-auto py-4">
        <div className="flex min-w-max items-center gap-3">
          <div className="mr-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Music className="h-4 w-4" />
            Şarkıdaki Akorlar:
          </div>

          {chords.map((chord, index) => (
            <button
              key={index}
              // 👇 Toggle fonksiyonunu çağırıyoruz
              onClick={() => onChordToggle(chord)}
              className={cn(
                'rounded-md border px-4 py-2 text-sm font-bold transition-all hover:scale-105',
                // 👇 SelectedChord prop'una göre renklendirme yapıyoruz
                selectedChord === chord
                  ? 'scale-105 border-primary bg-primary text-primary-foreground shadow-md'
                  : 'bg-background hover:border-primary hover:text-primary'
              )}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
