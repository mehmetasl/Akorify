'use client'

import { useState, useTransition } from 'react'
import { z } from 'zod'

const songSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  artist: z.string().min(1, 'Sanatçı zorunludur'),
  content: z.string().min(10, 'İçerik en az 10 karakter olmalıdır'),
})

interface FormErrors {
  title?: string
  artist?: string
  content?: string
  _form?: string
}

export default function NewSongForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<FormErrors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      content: formData.get('content') as string,
    }

    // Client-side validation
    const validation = songSchema.safeParse(data)
    if (!validation.success) {
      const fieldErrors: FormErrors = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FormErrors] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    startTransition(async () => {
      try {
        await action(formData)
      } catch (error) {
        setErrors({
          _form: error instanceof Error ? error.message : 'Bir hata oluştu',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Şarkı Başlığı *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Örn: Yalnızlık"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="artist" className="text-sm font-medium">
          Sanatçı *
        </label>
        <input
          type="text"
          id="artist"
          name="artist"
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Örn: Müslüm Gürses"
        />
        {errors.artist && (
          <p className="text-sm text-red-500">{errors.artist}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Şarkı Sözleri ve Akorlar *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={20}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-mono text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="[Am] Yalnızlık sen ne büyük dertsin&#10;[F] Kim bilir kim bilir&#10;[C] [G] [Am]&#10;&#10;Akorları köşeli parantez içinde yazın. Boş satırlar verse ayırıcı olarak kullanılır."
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Akorları [Am], [F], [C] gibi köşeli parantez içinde yazın. Boş satırlar verse
          ayırıcı olarak kullanılır.
        </p>
      </div>

      {errors._form && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors._form}
          </p>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-medium text-white hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
        >
          {isPending ? 'Kaydediliyor...' : 'Şarkıyı Kaydet'}
        </button>
        <a
          href="/admin"
          className="rounded-lg border-2 border-border bg-background px-6 py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
        >
          İptal
        </a>
      </div>
    </form>
  )
}

