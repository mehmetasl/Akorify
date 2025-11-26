import { DefaultSession } from "next-auth"

// User tipini genişletiyoruz
declare module "next-auth" {
  interface User {
    role: string // Veya enum kullanıyorsan: "ADMIN" | "USER"
  }

  interface Session {
    user: {
      role: string
    } & DefaultSession["user"]
  }
}

// JWT tipini genişletiyoruz (auth.config.ts için)
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}