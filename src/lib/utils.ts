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


export function getCleanYoutubeUrl(url: string | null | undefined) {
  if (!url) return "";
  try {
    // Eğer linkte "v=" varsa onu bulup ayıralım
    if (url.includes("v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Short link (youtu.be/ID) ise
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return url;
  } catch (e) {
    return url;
  }
}
