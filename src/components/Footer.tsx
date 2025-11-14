import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-primary/20 bg-gradient-to-b from-background to-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Akorify
            </h3>
            <p className="text-sm text-muted-foreground">
              Türkiye&apos;nin en kapsamlı şarkı sözleri ve gitar akorları platformu.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/songs" className="text-muted-foreground hover:text-primary transition-colors">
                  Tüm Şarkılar
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-secondary transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Hakkında</h4>
            <p className="text-sm text-muted-foreground">
              Şarkı sözleri ve gitar akorlarını kolayca bulun ve paylaşın.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-primary/20 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Akorify. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

