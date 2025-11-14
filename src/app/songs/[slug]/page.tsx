import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import ChordDisplay from '@/components/ChordDisplay'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 86400 // Revalidate once per day (ISR)

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getSong(slug: string) {
  try {
    const song = await prisma.song.findUnique({
      where: { slug },
    })
    return song
  } catch (error) {
    console.error('Error fetching song:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const song = await getSong(slug)

  if (!song) {
    return {
      title: 'Şarkı Bulunamadı',
    }
  }

  return {
    title: `${song.title} - ${song.artist}`,
    description: `${song.artist} - ${song.title} şarkı sözleri ve gitar akorları. Akorify'de keşfedin.`,
    keywords: [
      song.title,
      song.artist,
      'şarkı sözleri',
      'gitar akorları',
      'lyrics',
      'chords',
    ],
    openGraph: {
      title: `${song.title} - ${song.artist}`,
      description: `${song.artist} - ${song.title} şarkı sözleri ve gitar akorları.`,
      type: 'article',
      publishedTime: song.createdAt.toISOString(),
      modifiedTime: song.updatedAt.toISOString(),
    },
    alternates: {
      canonical: `/songs/${slug}`,
    },
  }
}

export default async function SongPage({ params }: PageProps) {
  const { slug } = await params
  const song = await getSong(slug)

  if (!song) {
    notFound()
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Back Button */}
      <Link
        href="/songs"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Tüm Şarkılara Dön
      </Link>

      {/* Song Header */}
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {song.title}
        </h1>
        <p className="text-xl text-muted-foreground">{song.artist}</p>
      </header>

      {/* Ad Slot - Top */}
      <AdSlot adFormat="horizontal" className="mb-8" />

      {/* Song Content */}
      <article className="bg-card rounded-lg border p-6 md:p-8">
        <ChordDisplay lyrics={song.content} className="bg-muted/30 p-4 rounded-lg" />
      </article>

      {/* Ad Slot - Bottom */}
      <AdSlot adFormat="horizontal" className="mt-8" />

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MusicComposition',
            name: song.title,
            byArtist: {
              '@type': 'MusicGroup',
              name: song.artist,
            },
            datePublished: song.createdAt.toISOString(),
            dateModified: song.updatedAt.toISOString(),
          }),
        }}
      />
    </div>
  )
}

