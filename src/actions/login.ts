"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // 1. Verileri FormData'dan güvenli bir şekilde çekelim
    const email = formData.get("email");
    const password = formData.get("password");

    // 2. Giriş işlemini başlat
    // DİKKAT: Başarılı olursa Next.js burada bir "Hata" fırlatarak yönlendirme yapar.
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // Başarılı olursa ana sayfaya git
    });
    
  } catch (error) {
    // 3. KRİTİK NOKTA:
    // Eğer gelen hata "NEXT_REDIRECT" ise (yani giriş başarılıysa),
    // bu hatayı yakalama, fırlat gitsin ki sayfa yönlensin.
    if ((error as Error).message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    // 4. Gerçek giriş hatalarını yakala
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "E-posta veya şifre hatalı.";
        default:
          return "Giriş yapılamadı. Lütfen tekrar deneyin.";
      }
    }
    
    // Beklenmedik diğer hatalar
    throw error;
  }
}