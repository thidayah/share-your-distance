// src/lib/email/contact-service.ts
import { ContactFormAdmin } from "@/components/emails/ContactFormAdmin";
import { ContactFormUser } from "@/components/emails/ContactFormUser";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

export const contactService = {
  // Send email to admin
  async sendToAdmin({ name, email, category, subject, message }: ContactFormData) {
    try {
      const { data, error } = await resend.emails.send({
        from: `Share Your Distance Contact <${process.env.RESEND_FROM}>`,
        to: ['hello@shareyourdistance.online'], // Default jika belum punya domain, hanya bisa email akun Resend ['muhamadt84@gmail.com']
        subject: `New Contact: ${subject}`,
        react: ContactFormAdmin({ name, email, category, subject, message }),
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending contact email to admin:', error);
      throw error;
    }
  },

  // Send confirmation email to user
  async sendToUser({ name, email, category, subject}: ContactFormData) {
    try {
      const { data, error } = await resend.emails.send({
        from: `Share Your Distance Contact <${process.env.RESEND_FROM}>`,
        to: [email], // Default jika belum punya domain, hanya bisa email akun Resend ['muhamadt84@gmail.com']
        subject: 'We Received Your Message - Share Your Distance',
        react: ContactFormUser({ name, category, subject }),
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending confirmation email to user:', error);
      throw error;
    }
  },
};