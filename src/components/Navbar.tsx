import Link from 'next/link'
import { auth, signOut } from '@/auth' // Auth kütüphanemiz
import { Button } from '@/components/ui/button'
import { Guitar, LogOut, User, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function Navbar() {
  // Sunucu tarafında oturumu kontrol ediyoruz
  const session = await auth()
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* SOL TARAF: LOGO */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Guitar className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Akorify
          </span>
        </Link>

        {/* ORTA (Opsiyonel): Linkler masaüstünde görünebilir */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/songs" className="transition-colors hover:text-primary">
            Tüm Şarkılar
          </Link>
          <Link href="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
        </nav>

        {/* SAĞ TARAF: AUTH BUTONLARI */}
        <div className="flex items-center gap-4">
          {user ? (
            // --- GİRİŞ YAPMIŞ KULLANICI ---
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {user.name?.slice(0, 2).toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="truncate text-sm font-medium leading-none">{user.name}</p>
                    <p className="truncate text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profilim</span>
                  </Link>
                </DropdownMenuItem>

                {/* Sadece ADMIN ise göster */}
                {(user as any).role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Yönetim Paneli</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  {/* Çıkış Yap Formu */}
                  <form
                    action={async () => {
                      'use server'
                      await signOut()
                    }}
                    className="w-full"
                  >
                    <button type="submit" className="flex w-full items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // --- GİRİŞ YAPMAMIŞ (ZİYARETÇİ) ---
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="border-0 bg-gradient-to-r from-primary to-purple-600 text-white"
                >
                  Kayıt Ol
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
