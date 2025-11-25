"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleRepertoire(songId: string) {
  // 1. Kullanıcı giriş yapmış mı?
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Lütfen önce giriş yapın.", isAdded: false };
  }

  try {
    // 2. Bu şarkı zaten listede mi?
    const existingEntry = await prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    if (existingEntry) {
      // --- VARSA SİL (Çıkar) ---
      await prisma.favorite.delete({
        where: { id: existingEntry.id },
      });
      revalidatePath("/songs/[slug]"); // Sayfayı güncelle
      return { success: true, isAdded: false, message: "Repertuardan çıkarıldı." };
    } else {
      // --- YOKSA EKLE ---
      await prisma.favorite.create({
        data: {
          userId,
          songId,
        },
      });
      revalidatePath("/songs/[slug]");
      return { success: true, isAdded: true, message: "Repertuara eklendi!" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Bir hata oluştu.", isAdded: false };
  }
}