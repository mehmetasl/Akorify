'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Form doğrulama şeması
const RegisterSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

export async function registerUser(formData: FormData) {
  // Form verilerini obje haline getir
  const rawData = {
    firstName: formData.get('first-name'),
    lastName: formData.get('last-name'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // Verileri doğrula (Zod ile)
  const validatedFields = RegisterSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: 'Bilgiler eksik veya hatalı. Lütfen kontrol edin.' }
  }

  const { email, password, firstName, lastName } = validatedFields.data

  // E-posta kontrolü
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'Bu e-posta adresi zaten kullanımda.' }
  }

  // Şifreleme
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        // Ad ve Soyadı birleştirip 'name' alanına yazıyoruz
        // (Eğer şemana 'name' eklediysen burası çalışır, eklemediysen sadece email ve passwordHash kalmalı)
        name: `${firstName} ${lastName}`,
        email,
        passwordHash: hashedPassword, // Şemandaki isim 'passwordHash' olduğu için
        role: 'USER', // Varsayılan rol
      },
    })

    return { success: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...' }
  } catch (error) {
    console.error('Kayıt Hatası:', error)
    return { error: 'Bir hata oluştu, lütfen tekrar deneyin.' }
  }
}
