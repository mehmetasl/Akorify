"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  // İsim Validasyonu: En az 2 kelime olmalı (Ad + Soyad)
  name: z.string()
    .min(3, "İsim çok kısa.")
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: "Lütfen hem Adınızı hem de Soyadınızı giriniz.",
    }),
  
  bio: z.string().max(300, "Bio çok uzun (Maks 300 karakter).").optional(),
  location: z.string().max(50, "Konum bilgisi çok uzun.").optional(),
  instruments: z.string().optional(),
  image: z.string().url().optional(),
  socialLinks: z.string().optional(), // JSON string olarak gelecek
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum açmanız gerekiyor." };

  const rawData = {
    name: formData.get("name"),
    bio: formData.get("bio"),
    location: formData.get("location"),
    instruments: formData.get("instruments"),
    image: formData.get("image"),
    socialLinks: formData.get("socialLinks"),
  };

  const validation = ProfileSchema.safeParse(rawData);
  
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { name, bio, location, instruments, image, socialLinks } = validation.data;

  // Enstrümanları diziye çevir
  const instrumentsArray = instruments
    ? instruments.split(",").map(i => i.trim()).filter(i => i.length > 0)
    : [];

  // Sosyal Linkleri JSON'dan diziye çevir ve temizle
  let linksArray: string[] = [];
  try {
    if (socialLinks) {
      linksArray = JSON.parse(socialLinks).filter((l: string) => l.trim().length > 0);
    }
  } catch (e) {}

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        location,
        instruments: instrumentsArray,
        image,
        socialLinks: linksArray,
      },
    });

    revalidatePath("/profil");
    return { success: "Profil başarıyla güncellendi!" };
  } catch (error) {
    return { error: "Veritabanı hatası oluştu." };
  }
}