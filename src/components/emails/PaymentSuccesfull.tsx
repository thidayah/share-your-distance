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

interface PaymentSuccessfulProps {
  name: string;
  category: string;
  registration_number: string;
  bib_number: string;
  amount: number,
  payment_method: string,
  payment_date: string,
}

export const PaymentSuccessful = ({
  name,
  category,
  registration_number,
  bib_number,
  amount,
  payment_method,
  payment_date,
}: PaymentSuccessfulProps) => {
  const paymentDate = new Date(payment_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return (
    <Html>
      <Head />
      {/* <Preview>Payment Successful</Preview> */}
      <Tailwind>
        <Body className="font-ubuntu text-gray-800 leading-relaxed bg-gray-50 p-5">
          <Container className="max-w-xl mx-auto bg-gray-100 rounded-xl overflow-hidden">
            {/* Header */}
            <Section className=" bg-zinc-900 text-white text-left">
              <Heading className="text-4xl font-bold mt-12 ml-10 tracking-[-3px]">
                Payment&nbsp;&nbsp;Confirmed
              </Heading>
              <Text className="text-sm opacity-80 mb-12 ml-10">
                Your payment has been successfully processed!
              </Text>
            </Section>

            {/* Content */}
            <Section className="mt-2">
              <div className=" px-4 py-2 mx-4 ">
                <Text className="font-bold text-blue-700 text-2xl">Hi {name},</Text>
                <Text className="text-sm">
                  Thank you for completing your payment. Your registration is now confirmed and you're officially part of <strong>Share Your Distance!</strong>
                </Text>
              </div>

              {/* Message Summary */}
              <div className="mb-4 px-4 py-2 mx-8 bg-white" style={{ borderLeft: '4px solid #1147e6' }}>
                <Text className="font-bold text-blue-700 text-lg">Payment Details</Text>
                <Text className="text-sm">
                  <b>Registration Number:</b> {registration_number}
                </Text>
                <Text className="text-sm">
                  <b>BIB Number:</b> {bib_number}
                </Text>
                <Text className="text-sm">
                  <b>Category:</b> {category}
                </Text>
                <Text className="text-sm">
                  <b>Amount Paid:</b> IDR {amount.toLocaleString()}
                </Text>
                <Text className="text-sm">
                  <b>Payment Method:</b> {payment_method}
                </Text>
                <Text className="text-sm">
                  <b>Payment Date:</b> {paymentDate}
                </Text>
                <Text className="text-sm">
                  <b>Status:</b> <span className=" text-green-600 font-bold">CONFIRMED</span>
                </Text>
              </div>

              {/* Next steps */}
              <div className="mb-4 px-6 py-2 mx-8 text-white bg-zinc-700">
                <Text className="font-bold mb-1">Next Steps</Text>
                <p className="text-sm">• Save this email as your payment proof</p>
                <p className="text-sm">• Your BIB number will be used on race day</p>
                <p className="text-sm">• Further instructions about race kit collection will be sent later</p>
                <p className="text-sm">• Keep training and prepare for the race!</p>
                <div>&nbsp;</div>
              </div>

              {/* Footer */}
              <div className="mt-8 py-2 px-8 text-zinc-500" style={{ borderTop: '1px solid #d1d5dd' }}>
                <Text className="text-sm">If you have any questions, please contact our support team <Link href="mailto:hello@shareyourdistance.id">hello@shareyourdistance.id</Link></Text>
              </div>
              <div className=" px-8 text-zinc-500" >
                <Text className=" text-sm ">See you at the starting line!</Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
