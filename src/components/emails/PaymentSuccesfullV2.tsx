import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PaymentSuccessfulProps {
  name: string;
  category: string;
  registration_number: string;
  amount: number;
  payment_method: string;
  payment_date: string;
}

const colors = {
  ink: '#101b35',
  blue: '#2754ed',
  sky: '#88e8f3',
  lime: '#d8fa65',
  paper: '#f5f7fb',
  muted: '#65718a',
  line: '#dfe5ef',
};

export const PaymentSuccessfulV2 = ({
  name,
  category,
  registration_number,
  amount,
  payment_method,
  payment_date,
}: PaymentSuccessfulProps) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
  const formattedPaymentDate = new Date(payment_date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });

  return (
    <Html>
      <Head />
      <Preview>Payment confirmed. Your Share Your Distance registration is complete.</Preview>
      <Body
        style={{
          margin: 0,
          padding: '32px 16px',
          backgroundColor: colors.paper,
          color: colors.ink,
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            overflow: 'hidden',
            border: `1px solid ${colors.line}`,
            borderRadius: '20px',
            backgroundColor: '#ffffff',
          }}
        >
          <Section
            style={{
              padding: '32px 36px',
              backgroundColor: colors.ink,
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.17) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          >
            <Text
              style={{
                margin: '0 0 22px',
                color: colors.sky,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Share Your Distance
            </Text>
            <Text
              style={{
                margin: 0,
                color: colors.lime,
                fontSize: '34px',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-1.5px',
                textTransform: 'uppercase',
              }}
            >
              PAYMENT
              <br />
              CONFIRMED
            </Text>
            <Heading
              as="h1"
              style={{
                margin: '18px 0 0',
                color: '#ffffff',
                fontSize: '30px',
                lineHeight: '1.2',
                letterSpacing: '-1px',
              }}
            >
              You&apos;re in.
            </Heading>
          </Section>

          <Section style={{ padding: '28px 36px 12px' }}>
            <Heading
              as="h2"
              style={{ margin: '0 0 12px', color: colors.ink, fontSize: '22px' }}
            >
              Congratulations, {name}!
            </Heading>
            <Text style={{ margin: 0, color: colors.muted, fontSize: '15px', lineHeight: '1.7' }}>
              Your payment has been received and your registration for Share Your Distance is
              confirmed. We look forward to seeing you at the starting line.
            </Text>
          </Section>

          <Section
            style={{
              margin: '20px 36px',
              padding: '20px 22px',
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              backgroundColor: colors.paper,
            }}
          >
            <Text
              style={{
                margin: '0 0 16px',
                color: colors.blue,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Payment details
            </Text>
            <Text style={{ margin: '0 0 12px', color: colors.muted, fontSize: '12px' }}>
              Registration number
              <br />
              <strong style={{ color: colors.ink, fontSize: '15px' }}>{registration_number}</strong>
            </Text>
            <Text style={{ margin: '0 0 12px', color: colors.muted, fontSize: '12px' }}>
              Category
              <br />
              <strong style={{ color: colors.ink, fontSize: '15px' }}>{category}</strong>
            </Text>
            <Text style={{ margin: '0 0 12px', color: colors.muted, fontSize: '12px' }}>
              Amount paid
              <br />
              <strong style={{ color: colors.ink, fontSize: '17px' }}>{formattedAmount}</strong>
            </Text>
            <Text style={{ margin: '0 0 12px', color: colors.muted, fontSize: '12px' }}>
              Payment method
              <br />
              <strong style={{ color: colors.ink, fontSize: '15px' }}>{payment_method}</strong>
            </Text>
            <Text style={{ margin: 0, color: colors.muted, fontSize: '12px' }}>
              Payment date
              <br />
              <strong style={{ color: colors.ink, fontSize: '14px' }}>{formattedPaymentDate}</strong>
            </Text>
          </Section>

          <Section
            style={{
              margin: '20px 36px 28px',
              padding: '18px 22px',
              borderRadius: '14px',
              backgroundColor: colors.ink,
            }}
          >
            <Heading as="h3" style={{ margin: '0 0 10px', color: '#ffffff', fontSize: '16px' }}>
              What&apos;s next
            </Heading>
            <Text style={{ margin: '0 0 8px', color: '#e6ebf5', fontSize: '13px', lineHeight: '1.6' }}>
              1. Keep this email as your payment confirmation.
            </Text>
            <Text style={{ margin: '0 0 8px', color: '#e6ebf5', fontSize: '13px', lineHeight: '1.6' }}>
              2. Watch your inbox for race-day and race-kit updates.
            </Text>
            <Text style={{ margin: 0, color: '#e6ebf5', fontSize: '13px', lineHeight: '1.6' }}>
              3. Keep training. We&apos;ll see you at the start!
            </Text>
          </Section>

          <Section
            style={{
              padding: '20px 36px 24px',
              borderTop: `1px solid ${colors.line}`,
              backgroundColor: '#ffffff',
            }}
          >
            <Text style={{ margin: 0, color: colors.muted, fontSize: '11px', lineHeight: '1.6' }}>
              This is an automated message. Please do not reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
