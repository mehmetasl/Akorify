import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { Guitar, LogOut, User, Settings, AlertCircle, CheckCircle2 } from 'lucide-react' // İkonlar eklendi
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// Tooltip bileşenlerini import ediyoruz
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'

export default async function Navbar() {
  const session = await auth()
  const user = session?.user

  // Kullanıcı onaylı mı kontrolü (Tarih varsa true, yoksa false)
  const isVerified = !!(user as any)?.emailVerified

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
        {/* ORTA: Linkler */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/songs" className="transition-colors hover:text-primary">
            Tüm Şarkılar
          </Link>
          <Link href="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
        </nav>
        {/* ORTA: ARAMA ÇUBUĞU */}
        <div className="mx-4 hidden max-w-md flex-1 md:block">
          <SearchBar />
        </div>
        {/* SAĞ TARAF: AUTH BUTONLARI */}
        <div className="flex items-center gap-4">
          {user ? (
            // --- GİRİŞ YAPMIŞ KULLANICI ---
            <div className="flex items-center gap-2">
              <DropdownMenu>
                {/* Tooltip Provider ile Avatarı sarmalıyoruz */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Dropdown Trigger (Avatar Butonu) */}
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            'relative h-9 w-9 rounded-full',
                            // Onaysız ise sarı border ekle
                            !isVerified && 'ring-2 ring-yellow-500/50 ring-offset-2'
                          )}
                        >
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage src={user.image || ''} alt={user.name || ''} />
                            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                              {user.name?.slice(0, 2).toUpperCase() || 'US'}
                            </AvatarFallback>
                          </Avatar>

                          {/* Onaysız ise sağ alta küçük ünlem ikonu */}
                          {!isVerified && (
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-yellow-100 p-0.5 shadow-sm">
                              <AlertCircle className="h-3 w-3 text-yellow-600" />
                            </div>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>

                    {/* Tooltip İçeriği (Hover yapınca görünür) */}
                    <TooltipContent side="bottom" align="end">
                      {isVerified ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Hesap Onaylı</span>
                        </div>
                      ) : (
                        <div className="text-yellow-600">
                          <p className="flex items-center gap-2 font-bold">
                            <AlertCircle className="h-4 w-4" /> E-posta Onayı Gerekli
                          </p>
                          <p className="mt-1 text-xs text-foreground/80">
                            Tam erişim için lütfen e-postanızı doğrulayın.
                          </p>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Dropdown Menü İçeriği */}
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
            </div>
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
