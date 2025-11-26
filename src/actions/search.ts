"use server";

import { prisma } from "@/lib/prisma";

// Navbar'daki "Hızlı Arama" için hafifletilmiş fonksiyon
export async function searchQuickSongs(query: string) {
  if (!query || query.trim().length < 2) return [];

  try {
    const results = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { artist: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        artist: true,
        slug: true,
      },
      take: 5, // Sadece ilk 5 sonucu getir (Hız için)
    });

    return results;
  } catch (error) {
    console.error("Hızlı Arama Hatası:", error);
    return [];
  }
}