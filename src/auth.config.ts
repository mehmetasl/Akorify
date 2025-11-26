import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // Giriş sayfası yolu
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role; // Kullanıcının rolünü al

      // --- 1. GÜVENLİK DUVARI (Admin ve Dashboard) ---
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      // Admin Paneli Koruması
      if (isOnAdmin) {
        // Giriş yapmamışsa -> Login sayfasına at (NextAuth bunu otomatik yapar false dönünce)
        if (!isLoggedIn) return false;

        // Giriş yapmış ama ADMIN değilse -> Ana sayfaya şutla (REDIRECT)
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
        
        // Hem giriş yapmış hem Admin -> Geç
        return true;
      }

      // Dashboard Koruması (Sadece giriş yapmış olmak yeterli)
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      // --- 2. YÖNLENDİRME (Login/Register Engeli) ---
      // Eğer kullanıcı giriş yapmışsa, tekrar login/register sayfasına girmesin
      if (isLoggedIn) {
        if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
          return Response.redirect(new URL("/", nextUrl));
        }
      }

      return true;
    },
    
    // Session ve JWT ayarların doğru, aynen koruyoruz
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user) {
         (session.user as any).emailVerified = token.emailVerified as Date | null;
      }
      if (session.user && token.role) {
        (session.user as any).role = token.role; 
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.emailVerified = (user as any).emailVerified; 
      }
      return token;
    }
  },
  providers: [], 
} satisfies NextAuthConfig;