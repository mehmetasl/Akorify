import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import EditClientWrapper from './EditCleintWrapper'

interface PageProps {
  params: { slug: string }
}

export default async function EditSongPage({ params }: PageProps) {
  // 1. Oturum Kontrolü
  const session = await auth()
  if (!session?.user) {
    redirect('/giris') // Giriş yapmamışsa at
  }

  // 2. Şarkıyı Bul
  const song = await prisma.song.findUnique({
    where: { slug: params.slug },
  })

  if (!song) return notFound()

  return (
    <main className="container py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Şarkıyı Düzenle: {song.title}</h1>
        <p className="text-muted-foreground">
          Şarkı sözlerini veya akorları düzenleyerek katkıda bulunabilirsiniz.
        </p>
      </div>

      {/* Editör Sarmalayıcı */}
      <EditClientWrapper song={song} />
    </main>
  )
}
