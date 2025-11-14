import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import EditSongForm from '@/components/EditSongForm'

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

export default async function EditSongPage({ params }: PageProps) {
  const { slug } = await params
  const song = await getSong(slug)

  if (!song) {
    notFound()
  }

  async function updateSong(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const content = formData.get('content') as string
    const newSlug = slugify(`${artist}-${title}`)

    if (!title || !artist || !content) {
      throw new Error('Tüm alanlar zorunludur')
    }

    // If slug changed, check if new slug exists
    if (newSlug !== slug) {
      const existing = await prisma.song.findUnique({
        where: { slug: newSlug },
      })

      if (existing) {
        throw new Error('Bu slug zaten kullanılıyor')
      }
    }

    await prisma.song.update({
      where: { slug },
      data: {
        title: title.trim(),
        artist: artist.trim(),
        slug: newSlug,
        content: content.trim(),
      },
    })

    redirect(`/songs/${newSlug}`)
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Şarkı Düzenle
      </h1>
      <EditSongForm song={song} action={updateSong} />
    </div>
  )
}

