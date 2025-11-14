import { prisma } from '@/lib/prisma'
import SongCard from '@/components/SongCard'
import AdSlot from '@/components/AdSlot'
import { Search } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 3600 // Revalidate every hour

async function getPopularSongs() {
  try {
    const songs = await prisma.song.findMany({
      take: 12,
      orderBy: {
        createdAt: 'desc',
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
    // Hall of Fame için en eski eklenen şarkıları al (veya farklı bir kriter)
    const songs = await prisma.song.findMany({
      take: 12,
      orderBy: {
        createdAt: 'asc', // En eski şarkılar
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
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
            Şarkı Sözleri ve Gitar Akorları
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Türkiye&apos;nin en kapsamlı şarkı sözleri ve gitar akorları platformu. Binlerce
          şarkının sözleri ve akorlarını keşfedin.
        </p>

        {/* Search Bar */}
        <div className="mx-auto max-w-2xl">
          <form action="/songs" method="get" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Şarkı veya sanatçı ara..."
              className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 pl-12 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors"
            />
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          </form>
        </div>
      </section>

      {/* Ad Slot - After Hero */}
      <AdSlot adFormat="horizontal" className="mb-12" />

      {/* Popular Songs Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Popüler Şarkılar
          </h2>
          <Link
            href="/songs"
            className="text-sm font-medium text-primary hover:text-secondary transition-colors relative group"
          >
            Tümünü Gör
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {popularSongs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularSongs.map((song) => (
              <SongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                slug={song.slug}
              />
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Hall of Fame
          </h2>
          <Link
            href="/songs"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors relative group"
          >
            Tümünü Gör
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {hallOfFameSongs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hallOfFameSongs.map((song) => (
              <SongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                slug={song.slug}
              />
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

