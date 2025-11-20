import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Kullanıcıyı email ile bulan yardımcı fonksiyon
async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    return null;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // credentials tipini 'unknown' yapıyoruz ki Zod ile biz kontrol edelim
      async authorize(credentials) {
        // 1. Gelen veriyi doğrula
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        // 2. Veri formatı doğruysa
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await getUser(email);
          if (!user || !user.passwordHash) return null; // Kullanıcı yoksa veya şifresi yoksa (Google girişi vb.)

          // 3. Şifreyi karşılaştır
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) return user;
        }

        // Başarısız
        return null;
      },
    }),
  ],
});