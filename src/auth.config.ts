import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // Giriş sayfamızın yolu bu olacak
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard"); // İleride dashboard yaparsak korumak için
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Giriş yapmamışsa dashboard'a giremez
      }
      return true;
    },
    // Session'a kullanıcı ID'sini ve Rolünü ekliyoruz
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      // Token'dan gelen rolü session'a ekle (Typescript kızabilir, şimdilik any)
      if (session.user && token.role) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    }
  },
  providers: [], // Providers'ı burada boş bırakıyoruz, auth.ts'de dolduracağız
} satisfies NextAuthConfig;