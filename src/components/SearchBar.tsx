'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation' // useSearchParams'a gerek kalmadı
import { searchQuickSongs } from '@/actions/search'
import { Search, Loader2, Music, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils' // 1. cn'i import et

interface SearchBarProps {
  className?: string // Dışarıdan gelen genişlik/konum sınıfları
  inputClassName?: string // Input'un kendi stili (Yükseklik, font vs.)
  showSuggestions?: boolean
}

export default function SearchBar({
  className,
  inputClassName,
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  // 1. FIX: URL'den okumayı kaldırdık. Navbar hep boş başlasın.
  const [query, setQuery] = useState('')

  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // 2. FIX: Sayfa değiştiği an (Enter'a basıp gidince de) kutuyu temizle
  useEffect(() => {
    setQuery('')
    setIsOpen(false)
  }, [pathname])

  // Debounce ile Canlı Arama
  useEffect(() => {
    if (!showSuggestions) return

    const timer = setTimeout(async () => {
      // 3. FIX: Trim (Boşluk) kontrolü
      const trimmedQuery = query.trim()

      if (trimmedQuery.length >= 2) {
        setIsLoading(true)
        // Trimli halini gönderiyoruz
        const data = await searchQuickSongs(trimmedQuery)
        setResults(data)
        setIsLoading(false)
        setIsOpen(true)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, showSuggestions])

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Enter'a basınca
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 4. FIX: Sadece boşluksa işlem yapma
      if (!query.trim()) return

      setIsOpen(false)
      // Giderken de trimle
      router.push(`/songs?q=${encodeURIComponent(query.trim())}`)
    }
  }

  // Listeden seçince
  const handleSelect = (slug: string) => {
    setIsOpen(false)
    // Seçim yapınca da temizle (gerçi pathname değişince zaten temizlenecek)
    setQuery('')
    router.push(`/songs/${slug}`)
  }

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-md', className)}>
      <div className="relative">
        {/* ... (Search İkonu ve Input aynı kalsın) ... */}
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Şarkı veya sanatçı ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          // Focus olunca sadece showSuggestions açıksa işlem yap
          onFocus={() => showSuggestions && query.trim().length >= 2 && setIsOpen(true)}
          className={cn(
            'border-border bg-secondary/10 pl-10 pr-10 transition-all focus:bg-background',
            inputClassName
          )}
        />
        {/* Loading ikonu sadece öneriler açıksa görünsün */}
        {showSuggestions && isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
        ) : query.length > 0 ? (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* 👇 SONUÇ LİSTESİ: SADECE showSuggestions TRUE İSE GÖSTER 👇 */}
      {showSuggestions && isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl duration-200 animate-in fade-in zoom-in-95">
          {/* ... (Liste içeriği aynı kalsın) ... */}
          {results.length > 0 ? (
            <>
              <ul className="py-2">
                {results.map((song) => (
                  <li key={song.id}>
                    <button
                      onClick={() => handleSelect(song.slug)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                    >
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Music className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{song.title}</p>
                        <p className="text-xs text-muted-foreground">{song.artist}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t bg-secondary/10 p-2 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push(`/songs?q=${encodeURIComponent(query.trim())}`)
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Tüm sonuçları gör ({query}) →
                </button>
              </div>
            </>
          ) : (
            !isLoading && (
              <div className="p-6 text-center text-sm text-muted-foreground">Sonuç bulunamadı.</div>
            )
          )}
        </div>
      )}
    </div>
  )
}
