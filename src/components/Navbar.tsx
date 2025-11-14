import Link from 'next/link'
import { Search } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-primary transition-all duration-300">
            Akorify
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/songs"
            className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-secondary hover:after:w-full after:transition-all after:duration-300"
          >
            Tüm Şarkılar
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium transition-colors hover:text-secondary relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-secondary after:to-primary hover:after:w-full after:transition-all after:duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}

