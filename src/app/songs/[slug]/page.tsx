import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import SongClientWrapper from './SongClientWrapper'
import { auth } from '@/auth'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const song = await prisma.song.findUnique({
    where: { slug: params.slug },
    select: { title: true, artist: true },
  })

  if (!song) return { title: 'Şarkı Bulunamadı' }
  return {
    title: `${song.title} Akor - ${song.artist}`,
  }
}

export default async function SongPage({ params }: PageProps) {
  const session = await auth()
  const userId = session?.user?.id

  // 👇 GÜNCELLEMEN GEREKEN KISIM BURASI 👇
  const song = await prisma.song.findUnique({
    where: { slug: params.slug },
    include: {
      // Versiyonları da dahil et
      versions: {
        where: {
          OR: [
            // 1. Herkese açık VE Onaylanmış olanlar
            { isPublic: true, status: 'APPROVED' },

            // 2. VEYA: Benim kendi yazdıklarım (Onaylı/Onaysız/Özel fark etmez)
            // userId varsa onu kullan, yoksa undefined (hiçbir şeyle eşleşmez)
            { userId: userId ?? undefined },
          ],
        },
        include: {
          user: { select: { name: true } }, // Versiyonu kimin yazdığını da al
        },
        orderBy: { createdAt: 'desc' }, // En yeniler üstte
      },
    },
  })
  // 👆 GÜNCELLEME BİTTİ 👆

  if (!song) return notFound()

  let isFavorited = false
  if (userId) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId,
          songId: song.id,
        },
      },
    })
    isFavorited = !!fav
  }

  return (
    <main className="min-h-screen bg-background pb-32">
      <div className="container px-4 pt-8 md:px-8">
        <header className="mb-6 border-b border-border pb-6">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{song.title}</h1>
          <div className="text-lg text-muted-foreground">
            Sanatçı: <span className="font-semibold text-primary">{song.artist}</span>
          </div>
        </header>

        <div className="mb-4 flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed bg-secondary/20">
          <span className="text-xs text-muted-foreground">YATAY REKLAM (Responsive)</span>
        </div>
      </div>

      <div className="container px-4 md:px-8">
        <SongClientWrapper song={song} isFavorited={isFavorited} />
      </div>
    </main>
  )
}
