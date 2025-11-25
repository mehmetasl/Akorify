'use client'

import { useState } from 'react'
import { Chord } from 'chordsheetjs'
import { extractUniqueChords } from '@/lib/chord-db'
import ChordBox from './Chordbox'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, ChevronLeft, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChordSidebarProps {
  content: string
  isOpen: boolean
  onToggle: () => void
  transposeStep: number
}

export default function ChordSidebar({
  content,
  isOpen,
  onToggle,
  transposeStep,
}: ChordSidebarProps) {
  // Enstrüman sekmeleri (Görsel amaçlı, şimdilik sadece Gitar aktif)
  const [activeTab, setActiveTab] = useState('Guitar')

  // 1. Akorları Bul ve Transpoze Et
  const originalChords = extractUniqueChords(content)
  const displayedChords = originalChords.map((chordName) => {
    if (transposeStep === 0) return chordName
    try {
      const chord = Chord.parse(chordName)
      return chord ? chord.transpose(transposeStep).toString() : chordName
    } catch {
      return chordName
    }
  })
  const uniqueChords = Array.from(new Set(displayedChords))

  if (uniqueChords.length === 0) return null

  return (
    <>
      {/* --- KAPALI HALİ (Tetikleyici Buton) --- */}
      {/* Ekranın sağ kenarına yapışık durur */}
      <div
        className={cn(
          'fixed right-0 top-1/3 z-40 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-full' : 'translate-x-0'
        )}
      >
        <Button
          onClick={onToggle}
          className="flex h-auto flex-col items-center gap-2 rounded-l-xl rounded-r-none border-y border-l bg-background py-4 text-foreground shadow-lg hover:bg-secondary"
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-xs font-bold [writing-mode:vertical-lr]">AKORLAR</span>
        </Button>
      </div>

      {/* --- AÇIK HALİ (Sidebar Paneli) --- */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[320px] transform flex-col border-l bg-background shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* 1. HEADER (Başlık ve Kapatma) */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">Akorlar</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            Gizle <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* 2. TABS (Enstrüman Seçimi - Resimdeki gibi) */}
        <div className="flex items-center border-b px-4 pt-4">
          {['Guitar', 'Ukulele', 'Piano'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative px-4 pb-3 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'font-bold text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
              {/* Alt çizgi */}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* 3. İÇERİK (Akor Kutuları) */}
        <ScrollArea className="flex-1 bg-secondary/5">
          <div className="grid grid-cols-2 justify-items-center gap-6 p-6">
            {uniqueChords.map((chord) => (
              <div key={chord} className="flex flex-col items-center">
                {/* ChordBox bileşenimiz */}
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <ChordBox chord={chord} />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Alt Bilgi (Opsiyonel) */}
        <div className="border-t p-4 text-center text-xs text-muted-foreground">
          {uniqueChords.length} Akor bulundu
        </div>
      </div>

      {/* Arkaplan Karartma (Overlay) - Mobilde dışarı tıklayınca kapansın diye */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}
