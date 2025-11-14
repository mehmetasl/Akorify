import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Sayfa Bulunamadı</h2>
      <p className="mb-8 text-muted-foreground">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Home className="mr-2 h-4 w-4" />
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}

