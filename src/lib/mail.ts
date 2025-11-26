import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Proje URL'ini al (Localhost veya Vercel URL)
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  // Onay linki: http://localhost:3000/auth/new-verification?token=xyz
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev", // Kendi domainin yoksa bunu kullanabilirsin (Test için)
    to: email,
    subject: "Akorify - E-postanı Onayla",
    html: `<p>Merhaba, Akorify'a hoş geldin! <a href="${confirmLink}">Buraya tıklayarak</a> hesabını onayla.</p>`,
  });
};