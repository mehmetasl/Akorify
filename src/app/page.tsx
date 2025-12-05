import { prisma } from '@/lib/prisma'
import SongCard from '@/components/SongCard'
import AdSlot from '@/components/AdSlot'
// Search ikonunu sildim, çünkü SearchBar bileşeninin içinde zaten var.
import Link from 'next/link'
import SearchBar from '@/components/SearchBar' // 1. BİLEŞENİ İMPORT ET

export const revalidate = 3600 // Revalidate every hour

async function getPopularSongs() {
  try {
    const songs = await prisma.song.findMany({
      take: 12,
      orderBy: {
        createdAt: 'desc', // İstersen views: 'desc' yapabilirsin
      },
      select: {
        id: true,
        title: true,
        artist: true,
        slug: true,
      },
    })
    return songs
  } catch (error) {
    console.error('Error fetching popular songs:', error)
    return []
  }
}

async function getHallOfFameSongs() {
  try {
    const songs = await prisma.song.findMany({
      take: 12,
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        title: true,
        artist: true,
        slug: true,
      },
    })
    return songs
  } catch (error) {
    console.error('Error fetching hall of fame songs:', error)
    return []
  }
}

export default async function HomePage() {
  const [popularSongs, hallOfFameSongs] = await Promise.all([
    getPopularSongs(),
    getHallOfFameSongs(),
  ])

  return (
    <div className="container py-8 md:py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          <span className="animate-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Şarkı Sözleri ve Gitar Akorları
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Türkiye&apos;nin en kapsamlı şarkı sözleri ve gitar akorları platformu. Binlerce şarkının
          sözleri ve akorlarını keşfedin.
        </p>

        {/* 2. SEARCH BAR GÜNCELLEMESİ */}
        {/* Eski <form> yapısını sildik, yerine bileşeni koyduk */}
        <div className="mx-auto flex w-full max-w-3xl justify-center">
          <SearchBar
            // DIŞ KUTU: max-w-3xl (daha geniş), gölge daha belirgin (shadow-lg)
            className="max-w-3xl shadow-lg transition-all duration-300 hover:shadow-xl"
            showSuggestions={false}
            inputClassName="h-16 text-xl bg-background border-2 border-border focus:border-primary rounded-2xl px-12 placeholder:text-muted-foreground/70"
          />
        </div>
      </section>

      {/* Ad Slot - After Hero */}
      <AdSlot adFormat="horizontal" className="mb-12" />

      {/* Popular Songs Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
            Popüler Şarkılar
          </h2>
          <Link
            href="/songs"
            className="group relative text-sm font-medium text-primary transition-colors hover:text-secondary"
          >
            Tümünü Gör
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {popularSongs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularSongs.map((song) => (
              <SongCard key={song.id} title={song.title} artist={song.artist} slug={song.slug} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">Henüz şarkı eklenmemiş.</p>
            <Link
              href="/admin/new-song"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              İlk şarkıyı ekle →
            </Link>
          </div>
        )}
      </section>

      {/* Ad Slot - Between Sections */}
      <AdSlot adFormat="horizontal" className="mb-12" />

      {/* Hall of Fame Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-2xl font-bold text-transparent">
            Hall of Fame
          </h2>
          <Link
            href="/songs"
            className="group relative text-sm font-medium text-secondary transition-colors hover:text-primary"
          >
            Tümünü Gör
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {hallOfFameSongs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hallOfFameSongs.map((song) => (
              <SongCard key={song.id} title={song.title} artist={song.artist} slug={song.slug} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">Henüz şarkı eklenmemiş.</p>
            <Link
              href="/admin/new-song"
              className="mt-4 inline-block text-sm font-medium text-secondary hover:underline"
            >
              İlk şarkıyı ekle →
            </Link>
          </div>
        )}
      </section>

      {/* Ad Slot - Bottom */}
      <AdSlot adFormat="horizontal" />
    </div>
  )
}
