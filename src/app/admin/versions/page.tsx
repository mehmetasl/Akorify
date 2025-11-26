import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { approveVersion, rejectVersion } from '@/actions/admin-version'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

export default async function PendingVersionsPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/')

  // Sadece PENDING (Bekleyen) olanları getir
  const versions = await prisma.songVersion.findMany({
    where: { status: 'PENDING' },
    include: {
      song: { select: { title: true, artist: true, slug: true } }, // Hangi şarkı?
      user: { select: { name: true, email: true } }, // Kim yapmış?
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Bekleyen Düzenlemeler ({versions.length})</h1>

      {versions.length === 0 ? (
        <p className="text-muted-foreground">Şu an onay bekleyen düzenleme yok.</p>
      ) : (
        <div className="space-y-6">
          {versions.map((version) => (
            <Card key={version.id} className="border-l-4 border-l-yellow-500">
              <CardHeader className="bg-secondary/10 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {version.song.artist} - {version.song.title}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Düzenleyen: <span className="font-bold">{version.user.name}</span> (
                      {version.user.email})
                    </p>
                  </div>
                  <span className="rounded bg-yellow-100 px-2 py-1 font-mono text-xs text-yellow-800">
                    {version.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="mb-2 text-sm font-bold">Yeni İçerik:</h4>
                    <pre className="max-h-60 overflow-x-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50">
                      {version.content}
                    </pre>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 border-t pt-4">
                {/* REDDET BUTONU */}
                <form
                  action={async () => {
                    'use server'
                    await rejectVersion(version.id)
                  }}
                >
                  <Button variant="destructive" className="gap-2">
                    <X className="h-4 w-4" /> Reddet
                  </Button>
                </form>

                {/* ONAYLA BUTONU */}
                <form
                  action={async () => {
                    'use server'
                    await approveVersion(version.id)
                  }}
                >
                  <Button className="gap-2 bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4" /> Onayla ve Yayınla
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
