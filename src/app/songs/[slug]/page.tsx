import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import SongClientWrapper from './SongClientWrapper' // Yeni oluşturduğumuz wrapper

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
    // pb-32: Alt kısımda video ve mobil reklam için ekstra boşluk
    <main className="min-h-screen bg-background pb-32">
      {/* Header ve Başlık Alanı */}
      <div className="container px-4 pt-8 md:px-8">
        <header className="mb-6 border-b border-border pb-6">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{song.title}</h1>
          <div className="text-lg text-muted-foreground">
            Sanatçı: <span className="font-semibold text-primary">{song.artist}</span>
          </div>
        </header>

        {/* Üst Yatay Reklam Alanı */}
        <div className="mb-4 flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed bg-secondary/20">
          <span className="text-xs text-muted-foreground">YATAY REKLAM (Responsive)</span>
        </div>
      </div>

      {/* 
          Tüm interaktif işlemler (Video, Transpoze, Scroll) 
          artık bu Wrapper içinde dönüyor.
          SEO için veriyi (song) buradan gönderiyoruz.
      */}
      <div className="container px-4 md:px-8">
        <SongClientWrapper song={song} />
      </div>
    </main>
  )
}
