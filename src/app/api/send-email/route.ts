import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// EXAMPLE
export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();
    const data = await resend.emails.send({
      // from: "Your App <noreply@yourdomain.com>", // domain harus sudah diverifikasi di Resend
      // to: "delivered@resend.dev"1
      from: "Test Your App <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      // html: `<p>${message}</p>`,
      react: WelcomeEmail({ userName: "Taufik", message: message }),
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
