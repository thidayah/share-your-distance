import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
} from "@react-email/components";

interface RegistrationConfirmationProps {
  name: string;
  category: string;
  registration_number: string;
  amount: number,
  payment_url?: string;
}

export const RegistrationConfirmation = ({
  name,
  category,
  registration_number,
  amount,
  payment_url
}: RegistrationConfirmationProps) => {
  return (
    <Html>
      <Head />
      {/* <Preview>Registration Confirmation</Preview> */}
      <Tailwind>
        <Body className="font-ubuntu text-gray-800 leading-relaxed bg-gray-50 p-5">
          <Container className="max-w-xl mx-auto bg-gray-100 rounded-xl overflow-hidden">
            {/* Header */}
            <Section className=" bg-zinc-900 text-white text-left">
              <Heading className="text-4xl font-bold mt-12 ml-10 tracking-[-3px]">
                Share&nbsp;&nbsp;Your&nbsp;&nbsp;Distance
              </Heading>
              <Text className="text-sm opacity-80 mb-12 ml-10">
                Registration Received!
              </Text>
            </Section>

            {/* Content */}
            <Section className="mt-2">
              <div className=" px-4 py-2 mx-4 ">
                <Text className="font-bold text-blue-700 text-2xl">Hi {name},</Text>
                <Text className="text-sm">
                  Thank you for registering for Share Your Distance! Your registration has been received and is pending payment.
                </Text>
              </div>

              {/* Message Summary */}
              <div className="mb-4 px-4 py-2 mx-8 bg-white" style={{ borderLeft: '4px solid #1147e6' }}>
                <Text className="font-bold text-blue-700 text-lg">Registration Details</Text>
                <Text className="text-sm">
                  <b>Registration Number:</b> {registration_number}
                </Text>
                <Text className="text-sm">
                  <b>Participant:</b> {name}
                </Text>
                <Text className="text-sm">
                  <b>Category:</b> {category}
                </Text>
                <Text className="text-sm">
                  <b>Amount Due:</b> IDR {amount.toLocaleString()}
                </Text>
              </div>

              {/* Complete payment */}
              <div className="mb-4 px-6 py-2 mx-8 text-white bg-zinc-700">
                <Text className="font-bold mb-1">Complete Your Payment</Text>
                <Text className="text-sm">To secure your spot, please complete your payment within <b>24 hours</b>.</Text>
                <a href={payment_url} target="_blank" className=" bg-green-700 px-6 py-3 rounded text-white text-sm mb-4 cursor-pointer">
                  Complete Payment Now
                </a>
                <div>&nbsp;</div>
              </div>

              {/* Footer */}
              <div className="mt-8 py-2 px-8 text-zinc-500" style={{ borderTop: '1px solid #d1d5dd' }}>
                <Text className="text-sm"><strong>Need help?</strong> Contact us at <Link href="mailto:hello@shareyourdistance.id">hello@shareyourdistance.id</Link></Text>
              </div>
              <div className=" px-8 text-zinc-500" >
                <Text className=" text-sm ">This is an automated message. Please do not reply to this email.</Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );

  // < !DOCTYPE html >
  //   <html>
  //     <head>
  //       <style>
  //         body { font-family: Ubuntu, system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
  //         .container { max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 10px; overflow: hidden; }
  //         .header { background: linear-gradient(135deg, #08090b, #d4d4d8); color: white; padding: 30px; text-align: center; }
  //         .content { padding: 30px; }
  //         .thank-you { font-size: 24px; color: #165dfd; margin-bottom: 20px; }
  //         .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #165dfd; }
  //         .response-time { background: #3f3f47; padding: 15px; margin: 20px 0; color: #ffffff }
  //         .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="container">
  //         <div class="header">
  //           <h1>Share Your Distance</h1>
  //           <p>Thank You for Reaching Out!</p>
  //         </div>
  //         <div class="content">
  //           <div class="thank-you">Hi ${name},</div>

  //           <p>We've successfully received your message and truly appreciate you taking the time to contact us.</p>

  //           <div class="info-box">
  //             <h3 style="margin-top: 0; color: #165dfd;">Message Summary</h3>
  //             <p><strong>Subject:</strong> ${subject}</p>
  //             <p><strong>Category:</strong> ${category}</p>
  //             <p><strong>Received:</strong> ${new Date().toLocaleDateString('en-US', { 
  //               weekday: 'long', 
  //               year: 'numeric', 
  //               month: 'long', 
  //               day: 'numeric',
  //               hour: '2-digit',
  //               minute: '2-digit'
  //             })}</p>
  //           </div>

  //           <div class="response-time">
  //             <h4 style="margin-top: 0;">What's Next?</h4>
  //             <p>Our team typically responds within <strong>24 hours</strong> during business days (Monday-Friday, 9AM-5PM WIB).</p>
  //           </div>

  //           <p>In the meantime, you might find quick answers in our <a href="https://shareyourdistance.id/faq" style="color: #165dfd; text-decoration: none; font-weight: bold;">FAQ section</a>.</p>

  //           <div class="footer">
  //             <p><strong>Best regards,</strong><br>
  //             Share Your Distance Team</p>
  //             <p style="font-size: 12px; margin-top: 20px;">
  //               This is an automated message. Please do not reply to this email.<br>
  //               Share Your Distance - December 20, 2025 - Gedung Sate, Bandung
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </body>
  //   </html>
};
