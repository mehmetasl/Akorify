import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'

export const revalidate = 0 // Always fetch fresh data

async function getAllSongs() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        artist: true,
        slug: true,
        createdAt: true,
      },
    })
    return songs
  } catch (error) {
    console.error('Error fetching songs:', error)
    return []
  }
}

export default async function AdminPage() {
  const songs = await getAllSongs()

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
          Admin Panel
        </h1>
        <Link
          href="/admin/new-song"
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:from-primary/90 hover:to-secondary/90 hover:shadow-primary/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Şarkı Ekle
        </Link>
      </div>
      <Link href="/admin/versions">
        <div className="cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-500/10 p-3 text-yellow-600">
              {/* Edit ikonu import et */}
              <Edit className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Onay Bekleyenler</h3>
              <p className="text-sm text-muted-foreground">Kullanıcı düzenlemelerini yönet.</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Tüm Şarkılar</h2>
          {songs.length > 0 ? (
            <div className="space-y-2">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                >
                  <div>
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <Link
                    href={`/admin/edit-song/${song.slug}`}
                    className="inline-flex items-center rounded-lg border-2 border-secondary/30 bg-background px-3 py-1.5 text-sm font-medium transition-all hover:border-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Düzenle
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Henüz şarkı eklenmemiş.</p>
          )}
        </div>
      </div>
    </div>
  )
}
