import { auth, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SongCard from '@/components/SongCard'
import ProfileSettingsForm from '@/components/ProfileSettingsForm'
import { MapPin, Calendar, Music, LogOut, Award, Zap, ExternalLink, Star } from 'lucide-react'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      favorites: { include: { song: true } },
      contributions: { include: { song: true }, orderBy: { createdAt: 'desc' } },
    },
  })

  if (!user) return <div>Kullanıcı bulunamadı.</div>

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* --- HEADER --- */}
      <div className="relative h-60 w-full overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 shadow-md">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="container relative -mt-24 px-4 md:px-8">
        <div className="rounded-2xl border bg-white shadow-xl">
          <div className="flex flex-col items-center p-6 md:flex-row md:items-start md:gap-8">
            {/* Avatar */}
            <div className="relative -mt-20 md:-mt-24">
              <Avatar className="h-32 w-32 border-[6px] border-white bg-white shadow-lg transition-transform hover:scale-105 md:h-40 md:w-40">
                <AvatarImage src={user.image || ''} className="object-cover" />
                <AvatarFallback className="bg-indigo-50 text-4xl font-bold text-primary">
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-4 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 ring-4 ring-white">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white/60"></div>
              </div>
            </div>

            {/* İsim ve Bilgiler */}
            <div className="mt-4 flex flex-1 flex-col items-center md:mt-2 md:items-start">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  {user.name}
                </h1>
                <Badge
                  variant="secondary"
                  className="mt-2 w-fit bg-indigo-50 text-indigo-700 hover:bg-indigo-100 md:mt-0"
                >
                  <Award className="mr-1 h-3 w-3" />
                  {user.levelTitle}
                </Badge>
              </div>

              {/* KONUM BİLGİSİ HEADER'A TAŞINDI */}
              {user.location && (
                <div className="mt-2 flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  <span>{user.location}</span>
                </div>
              )}

              <div className="mt-3 flex items-center gap-4 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
                  <Zap className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-gray-900">{user.xp} XP</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-300"></div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Üyelik:{' '}
                    {user.createdAt.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Sadece Linkler */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500 md:justify-start">
                {user.socialLinks &&
                  user.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      className="flex items-center gap-1.5 transition-colors hover:text-indigo-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" /> Link {index + 1}
                    </a>
                  ))}
              </div>
            </div>

            {/* Çıkış Butonu */}
            <div className="mt-6 flex gap-3 md:mt-2">
              <form
                action={async () => {
                  'use server'
                  await signOut()
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Çıkış
                </Button>
              </form>
            </div>
          </div>

          <div className="rounded-b-2xl border-t bg-gray-50/50 px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  İlgi Alanları:
                </span>
                {user.instruments && user.instruments.length > 0 ? (
                  user.instruments.map((inst, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                    >
                      <Music className="mr-1 h-3 w-3" /> {inst}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs italic text-gray-400">Henüz eklenmemiş.</span>
                )}
              </div>
              {user.bio && (
                <p className="max-w-xl text-center text-sm italic text-gray-600 md:text-right">
                  &quot;{user.bio}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="mt-12">
          <Tabs defaultValue="favorites" className="w-full">
            <div className="mb-8">
              <TabsList className="flex h-auto w-full items-center justify-start gap-6 border-b border-gray-200 bg-transparent p-0">
                {['favorites', 'contributions', 'settings'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="group relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-base font-medium text-gray-500 shadow-none transition-all duration-300 hover:text-violet-600 data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-violet-700 data-[state=active]:shadow-none"
                  >
                    <span className="relative z-10 capitalize">
                      {tab === 'settings'
                        ? 'Ayarlar'
                        : tab === 'contributions'
                          ? 'Katkılar'
                          : 'Favoriler'}
                    </span>
                    <div className="absolute inset-0 -z-10 rounded-t-lg bg-violet-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 data-[state=active]:opacity-0"></div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent
              value="favorites"
              className="duration-500 animate-in fade-in-50 slide-in-from-bottom-4"
            >
              {user.favorites.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {user.favorites.map((fav) => (
                    <SongCard
                      key={fav.id}
                      title={fav.song.title}
                      artist={fav.song.artist}
                      slug={fav.song.slug}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white/50 py-16">
                  <div className="mb-3 rounded-full bg-gray-50 p-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-500">Favori listeniz boş.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="contributions"
              className="duration-500 animate-in fade-in-50 slide-in-from-bottom-4"
            >
              {user.contributions.length > 0 ? (
                <div className="grid gap-3">
                  {user.contributions.map((ver) => (
                    <div
                      key={ver.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-violet-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-lg font-bold text-violet-600">
                          ♫
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{ver.song.title}</div>
                          <div className="text-sm text-gray-500">{ver.song.artist}</div>
                        </div>
                      </div>
                      <Badge
                        variant={ver.status === 'APPROVED' ? 'default' : 'secondary'}
                        className={
                          ver.status === 'APPROVED'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }
                      >
                        {ver.status === 'APPROVED' ? 'Onaylandı' : 'İnceleniyor'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white/50 py-12 text-center text-gray-500">
                  Henüz bir katkı yapmadınız.
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="settings"
              className="duration-500 animate-in fade-in-50 slide-in-from-bottom-4"
            >
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-8 border-b border-gray-100 pb-5">
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Profil Ayarları
                    </span>
                  </h2>
                  <p className="mt-1.5 text-sm font-medium text-muted-foreground">
                    Kişisel bilgilerinizi ve avatarınızı buradan güncelleyin.
                  </p>
                </div>
                <ProfileSettingsForm user={user} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
