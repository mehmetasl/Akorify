
"use server";

import { prisma } from "@/lib/prisma";

export const verifyEmail = async (token: string) => {
  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return { error: "Token bulunamadı!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token süresi dolmuş!" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return { error: "Kullanıcı bulunamadı!" };
  }

  // Kullanıcıyı onayla
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      email: existingToken.email // Email değişikliği durumları için güvenlik
    },
  });

  // Tokenı sil (Tek kullanımlık)
  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "E-posta başarıyla doğrulandı!" };
};