import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// 1. NextAuth yapılandırmasını başlat
const { auth } = NextAuth(authConfig);

// 2. Middleware fonksiyonunu dışa aktar
// NextAuth'un 'auth' fonksiyonu, isteği sarmalar ve 'req.auth' içinde oturum bilgisini verir
export default auth((req) => {
  // --- SENİN LOGLAMA KODUN BURADA ---
  const { pathname } = req.nextUrl;

  // Log page visits
  console.log(`[${new Date().toISOString()}] Page visit: ${pathname}`, {
    method: req.method,
    userAgent: req.headers.get('user-agent'),
    referer: req.headers.get('referer'),
    // İstersen buraya 'kullanıcı giriş yapmış mı' bilgisini de ekleyebilirsin:
    user: req.auth?.user?.email || "Guest" 
  });
  // ----------------------------------

  // Eğer 'auth.config.ts' dosyasında "authorized" callback'i false dönerse 
  // NextAuth otomatik olarak login'e yönlendirir veya 401 verir.
  // Eğer true dönerse veya kural yoksa buraya düşer ve devam ederiz.
  
  return NextResponse.next();
});

// 3. Config ayarı (Senin mevcut ayarınla NextAuth'un önerdiği ayar aynıdır)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};