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

export const RegistrationConfirmationV2 = ({
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
              <Text className="text-sm opacity-80 pb-8 pl-10">
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
                <div>&nbsp;</div>
              </div>

              {/* Footer */}
              <div className="mt-8 py-2 px-8 text-zinc-500" style={{ borderTop: '1px solid #d1d5dd' }}>
                <Text className="text-sm"><strong>Need help?</strong> Contact us at <Link href="mailto:hello@shareyourdistance.online">hello@shareyourdistance.online</Link></Text>
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
};
