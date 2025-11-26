'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useRef, Suspense } from 'react' // useRef ekle
import { verifyEmail } from '@/actions/verify-email'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  // 👇 BU SATIR YENİ: İşlemin yapılıp yapılmadığını takip eder
  const hasFired = useRef(false)

  const onSubmit = useCallback(() => {
    // Eğer zaten çalıştıysa, başarılıysa veya token yoksa durdur
    if (hasFired.current || success || error || !token) return

    // İşaretle: Artık çalıştı
    hasFired.current = true

    verifyEmail(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success)
        } else {
          setError(data.error)
        }
      })
      .catch(() => {
        setError('Beklenmedik bir hata oluştu!')
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <Card className="w-[400px] bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Hesap Onayı</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {!success && !error && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Doğrulanıyor...</p>
          </div>
        )}

        {success && (
          <div className="w-full rounded-md border border-green-200 bg-green-100 p-3 text-center text-green-700">
            <p className="font-medium">{success}</p>
            <p className="mt-1 text-xs text-green-800">
              Güncel durumu görmek için lütfen çıkış yapıp tekrar girin.
            </p>
          </div>
        )}

        {error && (
          <div className="w-full rounded-md border border-red-200 bg-red-100 p-3 text-center text-red-700">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <Link href="/giris" className="mt-2 text-sm font-medium text-primary hover:underline">
          Giriş Yapmaya Dön
        </Link>
      </CardContent>
    </Card>
  )
}

// Ana sayfa bileşeni (Suspense ile sarmalanmış)
export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
