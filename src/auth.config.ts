import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // Giriş sayfası yolu
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // Dashboard veya Admin paneli koruması (İlerisi için)
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Giriş yapmamışsa at
      }

      // --- DÜZELTME BURADA ---
      // Eğer kullanıcı giriş yapmışsa ve hala giriş/kayıt sayfasındaysa
      // onu ana sayfaya yönlendir.
      if (isLoggedIn) {
        if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
          return Response.redirect(new URL("/", nextUrl));
        }
      }

      return true;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
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
  providers: [], 
} satisfies NextAuthConfig;