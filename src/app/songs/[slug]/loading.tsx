import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-background pb-20 pt-8">
      <div className="container px-4 md:px-8">
        {/* 1. HEADER SKELETON (Başlık ve Butonlar) */}
        <div className="flex flex-col gap-6 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            {/* Şarkı Başlığı */}
            <div className="h-10 w-3/4 max-w-[400px] rounded-lg bg-gray-200 dark:bg-gray-800"></div>
            {/* Sanatçı İsmi */}
            <div className="h-5 w-1/3 max-w-[200px] rounded-md bg-gray-200/60 dark:bg-gray-800/60"></div>
          </div>

          {/* Sağ Üst Butonlar (Düzenle, Paylaş, Kalp) */}
          <div className="flex gap-3">
            <div className="h-9 w-24 rounded-md bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-9 w-24 rounded-md bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-9 w-32 rounded-md bg-indigo-100/50 dark:bg-indigo-900/20"></div>
          </div>
        </div>

        {/* 2. TOOLBAR SKELETON (Transpoze, Font, Video) */}
        <div className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Transpoze Kutusu */}
            <div className="h-10 w-32 rounded-md bg-gray-100 dark:bg-gray-800"></div>
            {/* Font Kutusu */}
            <div className="h-10 w-24 rounded-md bg-gray-100 dark:bg-gray-800"></div>
            <div className="ml-auto flex gap-2">
              <div className="h-9 w-24 rounded-md bg-gray-100 dark:bg-gray-800"></div>
              <div className="hidden h-9 w-9 rounded-md bg-gray-100 dark:bg-gray-800 md:block"></div>
            </div>
          </div>
        </div>

        {/* 3. AKOR ŞERİDİ SKELETON */}
        <div className="mb-8 mt-2 flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-16 rounded-md bg-indigo-50 dark:bg-indigo-950/30"></div>
          ))}
        </div>

        {/* 4. MAIN CONTENT (İki Sütunlu Yapı) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* SOL: Şarkı Sözleri */}
          <div className="space-y-4">
            {/* Yükleniyor İkonu ve Mesajı (Merkezde hafifçe görünsün) */}
            <div className="mb-6 flex items-center gap-3 text-indigo-600/80">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Akorlar yükleniyor...</span>
            </div>
            {/* Rastgele Uzunlukta Satırlar */}
            <div className="h-4 w-3/4 rounded bg-gray-200/50 dark:bg-gray-800/50"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200/50 dark:bg-gray-800/50"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200/50 dark:bg-gray-800/50"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200/50 dark:bg-gray-800/50"></div>
            <div className="h-8 w-full bg-transparent"></div> {/* Boşluk */}
            <div className="h-4 w-4/5 rounded bg-gray-200/50 dark:bg-gray-800/50"></div>
            <div className="h-4 w-3/5 rounded bg-gray-200/50 dark:bg-gray-800/50"></div>
            <div className="h-4 w-2/4 rounded bg-gray-200/50 dark:bg-gray-800/50"></div>
          </div>

          {/* SAĞ: Sidebar (Akor Kutuları) */}
          <div className="hidden space-y-6 lg:block">
            <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl border border-indigo-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
