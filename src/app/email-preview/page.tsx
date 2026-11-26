import { render } from '@react-email/render';
import { PaymentSuccessful } from '@/components/emails/PaymentSuccesfull';
import { RegistrationConfirmation } from '@/components/emails/RegistrationConfirmation';

export default async function EmailPreview() {
  const [registrationEmail, paymentEmail] = await Promise.all([
    render(
      <RegistrationConfirmation
        name="Taufik Hidayah"
        category="Speed Race"
        registration_number="SYD26-0001"
        amount={125000}
        payment_url="https://midtrans.com"
      />,
    ),
    render(
      <PaymentSuccessful
        name="Taufik Hidayah"
        category="Speed Race"
        registration_number="SYD26-0001"
        amount={125000}
        payment_method="Bank transfer"
        payment_date={new Date().toISOString()}
      />,
    ),
  ]);

  return (
    <main style={{ margin: '0 auto', maxWidth: '760px', padding: '24px 16px 48px' }}>
      <section>
        <h1>Registration confirmation</h1>
        <iframe
          title="Registration confirmation email"
          srcDoc={registrationEmail}
          sandbox=""
          style={{ display: 'block', width: '100%', height: '920px', border: 0, background: '#f5f7fb' }}
        />
      </section>
      <section style={{ marginTop: '40px' }}>
        <h2>Payment successful</h2>
        <iframe
          title="Payment successful email"
          srcDoc={paymentEmail}
          sandbox=""
          style={{ display: 'block', width: '100%', height: '1120px', border: 0, background: '#f5f7fb' }}
        />
      </section>
    </main>
  );
}
