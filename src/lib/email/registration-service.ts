// src/lib/email/registration-service.ts
import { PaymentSuccessful } from "@/components/emails/PaymentSuccesfull";
import { RegistrationConfirmation } from "@/components/emails/RegistrationConfirmation";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface RegistrationConfirmationProps {
  email: string;
  name: string;
  category: string;
  registration_number: string;
  amount: number;
  payment_url?: string;
}

export interface PaymentSuccessProps {
  email: string;
  name: string;
  category: string;
  registration_number: string;
  bib_number: string;
  amount: number;
  payment_date: string;
  payment_method: string;
}

export const registrationService = {
  async sendRegistrationConfirmation(item: RegistrationConfirmationProps) {
    try {
      const { data, error } = await resend.emails.send({
        from: `Share Your Distance Contact <${process.env.RESEND_FROM}>`,
        to: [item.email],
        subject: `Registration Confirmation - ${item.registration_number}`,
        react: RegistrationConfirmation(item),
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending registration confirmation:', error);
      throw error;
    }
  },

  async sendPaymentSuccess(item: PaymentSuccessProps) {
    try {
      const { data, error } = await resend.emails.send({
        from: `Share Your Distance Contact <${process.env.RESEND_FROM}>`,
        to: item.email,
        subject: `Payment Successful - ${item.registration_number}`,
        react: PaymentSuccessful(item),
      });

      if (error) {
        console.error('Error sending payment success email:', error);
        return { status: false, error };
      }

      return { status: true, data };
    } catch (error) {
      console.error('Error in sendPaymentSuccess:', error);
      return { status: false, error };
    }
  }

};