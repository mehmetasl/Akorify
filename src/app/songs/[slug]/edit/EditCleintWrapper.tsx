'use client'

import { useState, useTransition } from 'react'
import ChordEditor from '@/components/editor/ChordEditor'
import { submitSongEdit } from '@/actions/version' // Eski isimle import ediyoruz
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function EditClientWrapper({ song }: { song: any }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const [versionTitle, setVersionTitle] = useState('Yeni Versiyon')
  const [isPublic, setIsPublic] = useState(false)

  const handleSubmit = (content: string) => {
    startTransition(async () => {
      // Fonksiyonu 4 parametreyle çağırıyoruz
      const result = await submitSongEdit(song.id, content, versionTitle, isPublic)

      if (result.success) {
        toast({
          title: 'Başarılı! 🚀',
          description: result.success,
          className: 'bg-green-600 text-white border-none',
        })
        router.push(`/songs/${song.slug}`)
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata Oluştu',
          description: result.error,
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Ayarlar */}
      <div className="flex items-end gap-4 rounded-lg border bg-card p-4">
        <div className="grid flex-1 gap-2">
          <Label>Versiyon Adı</Label>
          <Input value={versionTitle} onChange={(e) => setVersionTitle(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <input
            type="checkbox"
            id="pub"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="pub">Herkese Açık Yayınla</Label>
        </div>
      </div>

      {/* Editör */}
      <ChordEditor initialContent={song.content} onSubmit={handleSubmit} isPending={isPending} />
    </div>
  )
}
