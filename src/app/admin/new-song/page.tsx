import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import NewSongForm from '@/components/NewSongForm'

export default function NewSongPage() {
  async function createSong(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const content = formData.get('content') as string

    if (!title || !artist || !content) {
      throw new Error('Tüm alanlar zorunludur')
    }

    const slug = slugify(`${artist}-${title}`)

    // Check if slug already exists
    const existing = await prisma.song.findUnique({
      where: { slug },
    })

    if (existing) {
      throw new Error('Bu şarkı zaten mevcut')
    }

    await prisma.song.create({
      data: {
        title: title.trim(),
        artist: artist.trim(),
        slug,
        content: content.trim(),
      },
    })

    redirect(`/songs/${slug}`)
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Yeni Şarkı Ekle
      </h1>
      <NewSongForm action={createSong} />
    </div>
  )
}

