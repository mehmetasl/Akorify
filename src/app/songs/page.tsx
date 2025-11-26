import { prisma } from '@/lib/prisma'
import SongCard from '@/components/SongCard'
import { Search } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'

export const revalidate = 3600 // Revalidate every hour

interface SearchParams {
  q?: string
  page?: string
}

async function getSongs(searchQuery?: string, page: number = 1) {
  const pageSize = 20
  const skip = (page - 1) * pageSize

  try {
    const where = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' as const } },
            { artist: { contains: searchQuery, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        take: pageSize,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          artist: true,
          slug: true,
        },
      }),
      prisma.song.count({ where }),
    ])

    return {
      songs,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    }
  } catch (error) {
    console.error('Error fetching songs:', error)
    return {
      songs: [],
      total: 0,
      page: 1,
      totalPages: 0,
    }
  }
}

async function SongsList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const searchQuery = params.q || ''
  const page = parseInt(params.page || '1', 10)
  const { songs, total, totalPages } = await getSongs(searchQuery, page)

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form action="/songs" method="get" className="relative">
        <input
          key={searchQuery}
          type="text"
          name="q"
          defaultValue={searchQuery}
          placeholder="Şarkı veya sanatçı ara..."
          className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 pl-12 pr-4 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
      </form>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          &quot;{searchQuery}&quot; için {total} sonuç bulundu
        </p>
      )}

      {/* Songs Grid */}
      {songs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {songs.map((song) => (
              <SongCard key={song.id} title={song.title} artist={song.artist} slug={song.slug} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              {page > 1 && (
                <Link
                  href={`/songs?page=${page - 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="rounded-lg border-2 border-border bg-background px-4 py-2 text-sm font-medium transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Önceki
                </Link>
              )}
              <span className="px-4 text-sm text-muted-foreground">
                Sayfa <span className="font-semibold text-primary">{page}</span> /{' '}
                <span className="font-semibold text-secondary">{totalPages}</span>
              </span>
              {page < totalPages && (
                <Link
                  href={`/songs?page=${page + 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="rounded-lg border-2 border-border bg-background px-4 py-2 text-sm font-medium transition-all hover:border-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  Sonraki
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery
              ? 'Aradığınız kriterlere uygun şarkı bulunamadı.'
              : 'Henüz şarkı eklenmemiş.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default async function SongsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
        Tüm Şarkılar
      </h1>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <SongsList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
