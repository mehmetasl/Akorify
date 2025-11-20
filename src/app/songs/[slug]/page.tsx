import { prisma } from '@/lib/prisma'
import ChordDisplay from '@/components/ChordDisplay' // Güncellediğimiz bileşen
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

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
  const song = await prisma.song.findUnique({
    where: { slug: params.slug },
  })

  if (!song) return notFound()

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{song.title}</h1>
          <div className="text-lg text-muted-foreground">
            Sanatçı: <span className="font-semibold text-primary">{song.artist}</span>
          </div>
        </header>

        {/* Reklam Alanı */}
        <div className="mb-8 flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed bg-secondary/20">
          <span className="text-xs text-muted-foreground">REKLAM</span>
        </div>

        {/* 
            DİKKAT: Artık 'initialLines' göndermiyoruz. 
            Direkt 'lyrics' propuna veritabanındaki ham metni basıyoruz. 
            Senin eski sistemin bunu zaten düzgün gösteriyordu.
        */}
        <ChordDisplay lyrics={song.content} />
      </div>
    </main>
  )
}
