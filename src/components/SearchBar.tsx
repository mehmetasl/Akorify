'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation' // useSearchParams eklendi
import { searchQuickSongs } from '@/actions/search'
import { Search, Loader2, Music, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // URL'deki query değişirse inputu güncelle (Senkronizasyon)
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce ile Canlı Arama
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true)
        const data = await searchQuickSongs(query)
        setResults(data)
        setIsLoading(false)
        setIsOpen(true)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

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

  useEffect(() => {
    // Eğer Arama Sonuçları sayfasında değilsek kutuyu temizle
    if (pathname !== '/songs') {
      setQuery('')
      setIsOpen(false)
    }
  }, [pathname])

  // Enter'a basınca SENİN sayfana git
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsOpen(false)
      router.push(`/songs?q=${encodeURIComponent(query)}`)
    }
  }

  // Listeden seçince direkt detaya git
  const handleSelect = (slug: string) => {
    setIsOpen(false)
    // Arama kutusunu temizlemek istersen: setQuery("");
    // Ama genelde kullanıcının ne aradığı kalsın istenir.
    router.push(`/songs/${slug}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Şarkı veya sanatçı ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Enter kontrolü
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="border-border bg-secondary/10 pl-10 pr-10 transition-all focus:bg-background"
        />

        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
        ) : (
          query.length > 0 && (
            <button
              onClick={() => {
                setQuery('')
                setIsOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* DROP-DOWN SONUÇLAR */}
      {isOpen && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl duration-200 animate-in fade-in zoom-in-95">
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
              {/* "Tüm Sonuçları Gör" Linki */}
              <div className="border-t bg-secondary/10 p-2 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push(`/songs?q=${encodeURIComponent(query)}`)
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
