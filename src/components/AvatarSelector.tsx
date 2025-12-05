'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Dice5 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const STYLES = [
  { id: 'avataaars', name: 'Çizgi Karakter' },
  { id: 'notionists', name: 'Notion' },
  { id: 'bottts', name: 'Robot' },
  { id: 'lorelei', name: 'Eğlenceli' },
]

interface AvatarSelectorProps {
  currentImage?: string | null
  onSelect: (url: string) => void
}

export default function AvatarSelector({ currentImage, onSelect }: AvatarSelectorProps) {
  const [seed, setSeed] = useState('akorify')
  const [selectedStyle, setSelectedStyle] = useState('avataaars')

  useEffect(() => {
    if (currentImage && currentImage.includes('api.dicebear.com')) {
      try {
        const url = new URL(currentImage)
        const pathParts = url.pathname.split('/')
        if (pathParts[2]) setSelectedStyle(pathParts[2])
        const seedParam = url.searchParams.get('seed')
        if (seedParam) setSeed(seedParam)
      } catch (e) {}
    }
  }, [currentImage])

  const getAvatarUrl = (style: string, seedVal: string) =>
    `https://api.dicebear.com/9.x/${style}/svg?seed=${seedVal}`

  const handleRandomize = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10)
    setSeed(randomSeed)
    onSelect(getAvatarUrl(selectedStyle, randomSeed))
  }

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId)
    onSelect(getAvatarUrl(styleId, seed))
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 1. Avatar Önizleme */}
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div
              className="group relative cursor-pointer transition-all hover:scale-105 active:scale-95"
              onClick={handleRandomize}
            >
              <Avatar className="h-28 w-28 border-4 border-white bg-orange-50/50 shadow-xl">
                <AvatarImage src={getAvatarUrl(selectedStyle, seed)} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>

              <div className="absolute bottom-0 right-0 rounded-full bg-green-500 p-2 text-white shadow-lg ring-4 ring-white transition-transform group-hover:rotate-180">
                <RefreshCw className="h-4 w-4" />
              </div>
            </div>
          </TooltipTrigger>

          {/* 👇 GÜNCELLEME BURADA: side="bottom" ve "text-xs" */}
          <TooltipContent
            side="bottom"
            className="border-none bg-slate-900 px-2 py-1 text-xs text-white shadow-xl"
            sideOffset={5}
          >
            <p>Değiştir</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-full space-y-4">
        {/* 2. Stil Butonları */}
        <div className="flex flex-wrap justify-center gap-2">
          {STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => handleStyleChange(style.id)}
              className={`mt-3 rounded-full border px-3 py-1.5 text-xs transition-all ${
                selectedStyle === style.id
                  ? 'scale-105 border-teal-600 bg-teal-600 font-medium text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* 3. Rastgele Butonu */}
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomize}
                  className="gap-2 border-gray-200 text-gray-600 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                >
                  <Dice5 className="h-4 w-4" />
                  Beni Şaşırt
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="border-none bg-slate-900 px-2 py-1 text-xs text-white"
              >
                <p>Rastgele bir görünüm 🎲</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
