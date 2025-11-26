"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Şemayı biraz daha sıkılaştıralım (Trim ekledik)
const VersionSchema = z.object({
  content: z.string().trim().min(10).max(15000),
  title: z.string().trim().min(1).max(50),
  isPublic: z.boolean(),
});

export async function submitSongEdit(
  songId: string, 
  content: string,
  title: string = "Versiyon",
  isPublic: boolean = false
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Giriş yapmalısınız." };

  // 1. Doğrulama ve TEMİZLEME (Parsing)
  const validation = VersionSchema.safeParse({ content, title, isPublic });

  if (!validation.success) {
    return { error: "Veriler geçersiz: " + validation.error.errors[0].message };
  }

  // ⭐ ARTIK BU GÜVENLİ VERİYİ KULLANACAĞIZ ⭐
  const validData = validation.data;

  try {
    const status = validData.isPublic ? "PENDING" : "APPROVED";

    await prisma.songVersion.create({
      data: {
        songId,
        userId,
        // 👇 Ham verileri değil, Zod'dan geçenleri kullanıyoruz
        content: validData.content, 
        title: validData.title,
        isPublic: validData.isPublic,
        status,
      },
    });

    revalidatePath(`/songs/[slug]`);
    
    return { success: validData.isPublic ? "Onaya gönderildi." : "Listenize kaydedildi." };
    
  } catch (error) {
    console.error(error);
    return { error: "Veritabanı hatası." };
  }
}