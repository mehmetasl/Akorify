'use client'

import { useFormState } from 'react-dom'
import { authenticate } from '@/actions/login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Guitar, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  // Form durumunu takip etmek için hook (Hata mesajlarını göstermek için)
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Guitar className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold text-primary">Akorify</span>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <LogIn className="mx-auto mb-2 h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
          <CardDescription>Hesabınıza erişmek için bilgilerinizi girin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" name="email" placeholder="ornek@mail.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                  Şifremi unuttum
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>

            {/* Hata Mesajı Alanı */}
            {errorMessage && (
              <div className="rounded bg-red-50 p-2 text-center text-sm font-medium text-red-500">
                {errorMessage}
              </div>
            )}

            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Hesabın yok mu?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Kayıt Ol
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
