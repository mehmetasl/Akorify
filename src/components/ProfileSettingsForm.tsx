'use client'

import { useState } from 'react'
import AvatarSelector from '@/components/AvatarSelector'
import { updateProfile } from '@/actions/profile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2, Globe, User, MapPin, Music } from 'lucide-react'

interface ProfileFormData {
  avatarUrl: string
  name: string
  location: string
  bio: string
  instruments: string
  socialLinks: string[] // <-- İşte sihirli değnek burada (String Dizisi)
}

export default function ProfileSettingsForm({ user }: { user: any }) {
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  //   // 1. STATE YÖNETİMİ (Başlangıç verilerini saklıyoruz)
  //   const initialData = {
  //     avatarUrl: user.image || 'https://api.dicebear.com/9.x/avataaars/svg?seed=akorify',
  //     name: user.name || '',
  //     location: user.location || '',
  //     bio: user.bio || '',
  //     instruments: user.instruments?.join(', ') || '',
  //     socialLinks: user.socialLinks && user.socialLinks.length > 0 ? user.socialLinks : [''],
  //   }
  const [formData, setFormData] = useState<ProfileFormData>({
    avatarUrl: user.image || 'https://api.dicebear.com/9.x/avataaars/svg?seed=akorify',
    name: user.name || '',
    location: user.location || '',
    bio: user.bio || '',
    instruments: user.instruments?.join(', ') || '',
    // Eğer user.socialLinks varsa onu kullan, yoksa veya boşsa [""] (bir tane boş input) kullan
    socialLinks: user.socialLinks && user.socialLinks.length > 0 ? user.socialLinks : [''],
  })
  const [initialData] = useState<ProfileFormData>(formData)
  // 2. DEĞİŞİKLİK KONTROLÜ (Veriler ilk haliyle aynı mı?)
  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData)

  // Helperlar
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateLink = (index: number, value: string) => {
    const newLinks = [...formData.socialLinks]
    newLinks[index] = value
    handleChange('socialLinks', newLinks)
  }

  const addLinkField = () => {
    handleChange('socialLinks', [...formData.socialLinks, ''])
  }

  const removeLink = (index: number) => {
    const newLinks = formData.socialLinks.filter((_: any, i: number) => i !== index)
    handleChange('socialLinks', newLinks)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Client-side Validasyon: Ad Soyad Kontrolü
    const nameParts = formData.name.trim().split(/\s+/)
    if (nameParts.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi',
        description: 'Lütfen adınızı ve soyadınızı tam giriniz.',
      })
      return
    }

    setIsPending(true)

    const dataToSend = new FormData()
    dataToSend.append('name', formData.name)
    dataToSend.append('location', formData.location)
    dataToSend.append('bio', formData.bio)
    dataToSend.append('instruments', formData.instruments)
    dataToSend.append('image', formData.avatarUrl)
    dataToSend.append('socialLinks', JSON.stringify(formData.socialLinks))

    const result = await updateProfile(dataToSend)

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: result.error,
      })
    } else {
      toast({
        title: 'Kaydedildi ✅',
        description: 'Profiliniz başarıyla güncellendi.',
        className: 'bg-green-600 text-white border-none',
      })
      // Başarılı kayıttan sonra mevcut durumu "yeni başlangıç" kabul etmek için sayfa yenilemek en temizidir
      // Veya router.refresh() kullanılabilir.
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* AVATAR ALANI */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-6">
        <div className="flex flex-col items-center">
          <Label className="mb-4 text-center text-base font-semibold text-gray-700">
            Avatarını Tasarla
          </Label>
          <div className="w-full max-w-md">
            <AvatarSelector
              currentImage={formData.avatarUrl}
              onSelect={(url) => handleChange('avatarUrl', url)}
            />
          </div>
        </div>
      </div>

      {/* KİŞİSEL BİLGİLER */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Ad Soyad
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="h-4 w-4" />
            </div>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Adınız Soyadınız"
              className="border-gray-200 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Konum
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="h-4 w-4" />
            </div>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="İstanbul, Türkiye"
              className="border-gray-200 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
          Hakkında
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Müzik yolculuğundan bahset..."
          className="min-h-[100px] resize-y border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instruments" className="text-sm font-medium text-gray-700">
          Enstrümanlar
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Music className="h-4 w-4" />
          </div>
          <Input
            id="instruments"
            value={formData.instruments}
            onChange={(e) => handleChange('instruments', e.target.value)}
            placeholder="Gitar, Piyano, Vokal..."
            className="border-gray-200 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
          />
        </div>
        <p className="text-[11px] text-gray-400">
          Birden fazla enstrümanı virgülle ayırarak yazın.
        </p>
      </div>

      {/* SOSYAL MEDYA */}
      <div className="space-y-4 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Sosyal Medya Linkleri</Label>
        </div>

        <div className="space-y-3">
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="group flex items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                <Globe className="h-4 w-4" />
              </div>
              <Input
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                placeholder="https://..."
                className="h-10 rounded-l-none border-gray-200 focus:z-10 focus:border-indigo-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(index)}
                className="ml-2 h-10 w-10 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addLinkField}
          className="flex items-center gap-2 px-1 py-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Yeni link ekle
        </button>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end border-t border-gray-50 pt-6">
        {!isChanged && (
          <span className="mr-4 text-xs italic text-gray-400">Değişiklik yapılmadı</span>
        )}

        <Button
          type="submit"
          disabled={!isChanged || isPending}
          className={`h-11 min-w-[140px] shadow-lg transition-all active:scale-95 ${
            !isChanged
              ? 'cursor-not-allowed bg-gray-200 text-gray-400 shadow-none'
              : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor
            </>
          ) : (
            'Kaydet'
          )}
        </Button>
      </div>
    </form>
  )
}
