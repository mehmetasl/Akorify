'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/actions/register' // Server Action'ı import ettik
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Guitar, UserPlus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    // Backend fonksiyonunu çağırıyoruz
    const result = await registerUser(formData)

    if (result.error) {
      // Hata varsa kullanıcıya göster
      toast({
        variant: 'destructive',
        title: 'Kayıt Başarısız',
        description: result.error,
      })
      setIsSubmitting(false)
    } else {
      // Başarılıysa bilgi ver ve yönlendir
      toast({
        title: 'Kayıt Başarılı! 🎉',
        description: result.success,
        className: 'bg-green-600 text-white border-none', // Yeşil yapmak istersen class verebilirsin
      })
      router.push('/login') // Şimdilik ana sayfaya, giriş yapınca Login sayfasına yönlendireceğiz
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4 dark:bg-gray-900/50">
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100/20 via-emerald-100/20 to-white dark:from-purple-900/10 dark:via-emerald-900/10 dark:to-gray-900/10"></div>

      {/* Logo - Ana Sayfaya Dönüş */}
      <div className="absolute left-8 top-8">
        <Link
          href="/"
          className="flex select-none items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Guitar className="h-8 w-8 text-primary" />
          <span className="bg-gradient-to-r from-purple-500 to-emerald-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Akorify
          </span>
        </Link>
      </div>

      {/* Kayıt Kartı */}
      <Card className="w-full max-w-md rounded-2xl border-gray-200/80 shadow-2xl shadow-emerald-100/50 dark:border-gray-800/80 dark:shadow-purple-900/50">
        <CardHeader className="space-y-2 pt-8 text-center">
          <UserPlus className="mx-auto h-8 w-8 text-emerald-500" />
          <CardTitle className="text-3xl font-bold">Hesap Oluştur</CardTitle>
          <CardDescription>
            Müziğin ritmine katıl! Zaten bir hesabın var mı?{' '}
            {/* Giriş sayfası henüz yoksa ana sayfaya atsın şimdilik */}
            <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
              Giriş Yap
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Ad</Label>
                <Input id="first-name" name="first-name" placeholder="Adın" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Soyad</Label>
                <Input id="last-name" name="last-name" placeholder="Soyadın" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" placeholder="ornek@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="En az 6 karakter"
                minLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-gradient-to-r from-emerald-500 to-purple-500 text-base font-bold text-white transition-opacity hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kayıt Yapılıyor...' : 'Ücretsiz Kayıt Ol'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
