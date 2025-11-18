import { ContactFormAdmin } from "@/components/emails/ContactFormAdmin";
import { ContactFormUser } from "@/components/emails/ContactFormUser";
import { PaymentSuccessful } from "@/components/emails/PaymentSuccesfull";
import { RegistrationConfirmation } from "@/components/emails/RegistrationConfirmation";

export default function EmailPreview() {
   return (
    <PaymentSuccessful
      name="Taufik Hidayah"
      category="Speed Race"
      registration_number="SYD25-0001"
      bib_number="SPEED-0001"
      amount={125000}
      payment_method="bank_transfer"
      payment_date={new Date().toISOString()}
    />
  )

  // return (
  //   <RegistrationConfirmation
  //     name="Taufik Hidayah"
  //     category="Speed Race"
  //     registration_number="SYD25-0001"
  //     amount={125000}
  //     payment_url="https://midtrans.com"
  //   />
  // )
  // return (
  //   <ContactFormUser
  //     name="Taufik Hidayah"
  //     category="General Inquiry"
  //     subject="Test Message"
  //   />
  // );

  // return (
  //   <ContactFormAdmin
  //     name="Taufik Hidayah"
  //     email="taufik@example.com"
  //     category="General Inquiry"
  //     subject="Test Message"
  //     message={`Why do we use it? \n It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`}
  //   />
  // );
}
