"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// DÜZENLEMEYİ ONAYLA
export async function approveVersion(versionId: string) {
  const session = await auth();
  // Tip güvenliği (Role kontrolü)
  if ((session?.user as any)?.role !== "ADMIN") {
    return { error: "Yetkisiz işlem" };
  }

  try {
    // 1. Versiyonu bul
    const version = await prisma.songVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) return { error: "Versiyon bulunamadı" };

    // ❌ SİLİNEN KISIM: prisma.song.update(...) BURADAN KALDIRILDI.
    // Artık orijinal şarkı ezilmiyor.

    // 2. Sadece Versiyonun Statüsünü Güncelliyoruz
    await prisma.songVersion.update({
      where: { id: versionId },
      data: { status: "APPROVED" },
    });

    // 3. Sayfaları yenile (Yeni sekme görünsün diye)
    revalidatePath("/admin/versions");
    revalidatePath(`/songs`); 
    
    return { success: "Versiyon onaylandı! Ana şarkı değişmedi, yeni sekme eklendi." };

  } catch (error) {
    console.error(error);
    return { error: "İşlem başarısız." };
  }
}

// DÜZENLEMEYİ REDDET (Bu kısım doğruydu, aynen kalıyor)
export async function rejectVersion(versionId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return { error: "Yetkisiz işlem" };
  }

  try {
    await prisma.songVersion.update({
      where: { id: versionId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin/versions");
    return { success: "Düzenleme reddedildi." };
  } catch (error) {
    return { error: "İşlem başarısız." };
  }
}