'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CHORD_DATA } from '@/lib/chord-db'
import { Eraser, MousePointerClick } from 'lucide-react'

interface ChordEditorProps {
  initialContent: string
  onSubmit: (newContent: string) => void
  isPending: boolean
}

// Yer tutucu işaretimiz (Kullanıcının elle yazmayacağı bir şey olmalı)
const MARKER = '📍'

export default function ChordEditor({ initialContent, onSubmit, isPending }: ChordEditorProps) {
  const [content, setContent] = useState(initialContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Akorları alıyoruz
  const availableChords = Object.keys(CHORD_DATA)

  // --- 1. AKOR EKLEME FONKSİYONU (Hem Tekli Hem Toplu) ---
  const insertChord = (chord: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    // İçeride MARKER var mı kontrol et
    if (content.includes(MARKER)) {
      // --- TOPLU MOD ---
      // Tüm işaretleri seçilen akorla değiştir
      // replaceAll ile tüm işaretleri değiştiriyoruz
      const newText = content.replaceAll(MARKER, chord)
      setContent(newText)
    } else {
      // --- TEKLİ MOD (Normal) ---
      // İmlecin olduğu yere ekle
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newText = content.substring(0, start) + chord + content.substring(end)

      setContent(newText)

      // İmleci akorun sonuna taşı
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + chord.length, start + chord.length)
      }, 0)
    }
  }

  // --- 2. CTRL + TIKLAMA İLE İŞARET KOYMA ---
  const handleTextAreaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Eğer CTRL (veya Mac için CMD) basılıysa
    if (e.ctrlKey || e.metaKey) {
      const textarea = e.currentTarget
      const start = textarea.selectionStart

      // O anki tıklanan yere MARKER ekle
      const newText = content.substring(0, start) + MARKER + content.substring(start)

      setContent(newText)

      // İmleci marker'ın sonuna getir ki arka arkaya tıklanabilsin
      // React state update asenkron olduğu için timeout kullanıyoruz
      setTimeout(() => {
        textarea.selectionStart = start + MARKER.length
        textarea.selectionEnd = start + MARKER.length
      }, 0)
    }
  }

  // --- 3. İŞARETLERİ TEMİZLEME ---
  const clearMarkers = () => {
    setContent(content.replaceAll(MARKER, ''))
  }

  return (
    <div className="grid h-[70vh] grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
      {/* SOL: Akor Paleti */}
      <div className="flex h-full flex-col gap-4 overflow-hidden border-r pr-4">
        <div className="space-y-2 rounded-lg bg-secondary/20 p-3 text-xs">
          <h4 className="flex items-center gap-2 font-bold">
            <MousePointerClick className="h-4 w-4" /> Nasıl Kullanılır?
          </h4>
          <p>1. Metinde istediğin yere tıkla ve akor seç.</p>
          <p className="font-semibold text-primary">
            2. Toplu ekleme: <strong>CTRL</strong> basılı tutarak birden fazla yere tıkla ({MARKER}
            ), sonra akora bas.
          </p>
        </div>

        {/* Marker Temizleme Butonu (Eğer ekranda varsa göster) */}
        {content.includes(MARKER) && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearMarkers}
            className="w-full gap-2 animate-in fade-in"
          >
            <Eraser className="h-4 w-4" /> İşaretleri Temizle
          </Button>
        )}

        <div className="scrollbar-thin grid grid-cols-2 gap-2 overflow-y-auto pr-2">
          {availableChords.map((chord) => (
            <Button
              key={chord}
              variant="outline"
              size="sm"
              onClick={() => insertChord(chord)}
              className="font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {chord}
            </Button>
          ))}
        </div>
      </div>

      {/* SAĞ: Editör Alanı */}
      <div className="flex h-full flex-col gap-4">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={handleTextAreaClick} // Tıklamaları dinliyoruz
          className="flex-1 resize-none border-2 p-6 font-mono text-base leading-loose focus-visible:ring-primary"
          placeholder="Şarkı sözleri ve akorlar buraya..."
          spellCheck={false}
        />

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <span className="text-xs text-muted-foreground">{content.length} karakter</span>
          <Button
            onClick={() => onSubmit(content)}
            disabled={isPending}
            size="lg"
            className="bg-green-600 font-bold text-white shadow-md hover:bg-green-700"
          >
            {isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </div>
    </div>
  )
}
