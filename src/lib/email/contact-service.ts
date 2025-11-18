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
        from: 'Share Your Distance Contact <noreply@shareyourdistance.online>', // Default tester <onboarding@resend.dev>
        to: ['hello@shareyourdistance.online'], // Default tester ['muhamadt84@gmail.com']
        subject: `New Contact: ${subject}`,
        react: ContactFormAdmin({ name, email, category, subject, message }),
      });

      // const { data, error } = await resend.emails.send({
      //   // from: 'Share Your Distance Contact <noreply@shareyourdistance.online>',
      //   // to: ['hello@shareyourdistance.online'], // Ganti dengan email admin
      //   from: 'Share Your Distance Contact <onboarding@resend.dev>',
      //   to: ['muhamadt84@gmail.com'], // Default, hanya bisa email akun Resend
      //   subject: `New Contact: ${formData.subject}`,
      //   html: `
      //     <!DOCTYPE html>
      //     <html>
      //       <head>
      //         <style>
      //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      //           .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
      //           .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
      //           .field { margin-bottom: 15px; }
      //           .label { font-weight: bold; color: #f97316; }
      //           .message { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #f97316; }
      //         </style>
      //       </head>
      //       <body>
      //         <div class="container">
      //           <div class="header">
      //             <h1>📧 New Contact Message</h1>
      //             <p>Share Your Distance Contact Form</p>
      //           </div>
      //           <div class="content">
      //             <div class="field">
      //               <span class="label">Name:</span>
      //               <span>${formData.name}</span>
      //             </div>
      //             <div class="field">
      //               <span class="label">Email:</span>
      //               <span>${formData.email}</span>
      //             </div>
      //             <div class="field">
      //               <span class="label">Category:</span>
      //               <span>${formData.category}</span>
      //             </div>
      //             <div class="field">
      //               <span class="label">Subject:</span>
      //               <span>${formData.subject}</span>
      //             </div>
      //             <div class="field">
      //               <span class="label">Message:</span>
      //               <div class="message">${formData.message.replace(/\n/g, '<br>')}</div>
      //             </div>
      //             <div style="margin-top: 20px; padding: 15px; background: #e5e7eb; border-radius: 5px;">
      //               <small>This message was sent from the Share Your Distance contact form on ${new Date().toLocaleDateString('id-ID')}</small>
      //             </div>
      //           </div>
      //         </div>
      //       </body>
      //     </html>
      //   `,
      // });

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
        from: 'Share Your Distance <noreply@shareyourdistance.online>', // Default tester <onboarding@resend.dev>
        to: [email], // Default muhamadt84@gmail.com, hanya bisa email akun Resend
        subject: 'We Received Your Message - Share Your Distance',
        react: ContactFormUser({ name, category, subject }),
      });

      // const { data, error } = await resend.emails.send({
      //   // from: 'Share Your Distance <noreply@shareyourdistance.online>',
      //   from: 'Share Your Distance <onboarding@resend.dev>',
      //   to: [formData.email], // Default muhamadt84@gmail.com, hanya bisa email aku Resend
      //   subject: 'We Received Your Message - Share Your Distance',
      //   html: `
      //     <!DOCTYPE html>
      //     <html>
      //       <head>
      //         <style>
      //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      //           .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      //           .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
      //           .thank-you { font-size: 24px; color: #f97316; margin-bottom: 20px; }
      //           .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
      //           .response-time { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
      //           .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
      //         </style>
      //       </head>
      //       <body>
      //         <div class="container">
      //           <div class="header">
      //             <h1>🏃‍♂️ Share Your Distance</h1>
      //             <p>Thank You for Reaching Out!</p>
      //           </div>
      //           <div class="content">
      //             <div class="thank-you">Hi ${formData.name},</div>

      //             <p>We've successfully received your message and truly appreciate you taking the time to contact us.</p>

      //             <div class="info-box">
      //               <h3 style="margin-top: 0; color: #f97316;">📋 Message Summary</h3>
      //               <p><strong>Subject:</strong> ${formData.subject}</p>
      //               <p><strong>Category:</strong> ${formData.category}</p>
      //               <p><strong>Received:</strong> ${new Date().toLocaleDateString('id-ID', {
      //     weekday: 'long',
      //     year: 'numeric',
      //     month: 'long',
      //     day: 'numeric',
      //     hour: '2-digit',
      //     minute: '2-digit'
      //   })}</p>
      //             </div>

      //             <div class="response-time">
      //               <h4 style="margin-top: 0; color: #1e40af;">⏱️ What's Next?</h4>
      //               <p>Our team typically responds within <strong>24 hours</strong> during business days (Monday-Friday, 9AM-5PM WIB).</p>
      //             </div>

      //             <p>In the meantime, you might find quick answers in our <a href="https://shareyourdistance.com/faq" style="color: #f97316;">FAQ section</a>.</p>

      //             <div class="footer">
      //               <p><strong>Best regards,</strong><br>
      //               The Share Your Distance Team</p>
      //               <p style="font-size: 12px; margin-top: 20px;">
      //                 This is an automated message. Please do not reply to this email.<br>
      //                 Share Your Distance - December 20, 2025 - Gedung Sate, Bandung
      //               </p>
      //             </div>
      //           </div>
      //         </div>
      //       </body>
      //     </html>
      //   `,
      // });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending confirmation email to user:', error);
      throw error;
    }
  },
};