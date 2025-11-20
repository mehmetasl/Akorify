import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- SİLİNEN FONKSİYONU GERİ EKLİYORUZ ---
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Boşlukları tire ile değiştir
    .replace(/[^\w\-]+/g, '') // Alfanümerik olmayan karakterleri sil
    .replace(/\-\-+/g, '-')   // Çoklu tireleri tek tire yap
    .replace(/^-+/, '')       // Baştaki tireleri sil
    .replace(/-+$/, '')       // Sondaki tireleri sil
}
