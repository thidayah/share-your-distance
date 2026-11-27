import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface RegistrationConfirmationProps {
  name: string;
  category: string;
  registration_number: string;
  amount: number;
  payment_url?: string;
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

export const RegistrationConfirmationV2 = ({
  name,
  category,
  registration_number,
  amount,
  payment_url,
}: RegistrationConfirmationProps) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <Html>
      <Head />
      <Preview>Your registration is saved. Complete payment to confirm your spot.</Preview>
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
              REGISTRATION
              <br />
              RECEIVED
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
              You&apos;re almost there.
            </Heading>
          </Section>

          <Section style={{ padding: '28px 36px 12px' }}>
            <Heading
              as="h2"
              style={{ margin: '0 0 12px', color: colors.ink, fontSize: '22px' }}
            >
              Hi {name},
            </Heading>
            <Text style={{ margin: 0, color: colors.muted, fontSize: '15px', lineHeight: '1.7' }}>
              Thanks for registering for Share Your Distance. Your place is reserved while your
              payment is pending. Complete the payment to confirm your registration.
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
              Registration details
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
            <Text style={{ margin: 0, color: colors.muted, fontSize: '12px' }}>
              Amount due
              <br />
              <strong style={{ color: colors.ink, fontSize: '17px' }}>{formattedAmount}</strong>
            </Text>
          </Section>

          <Section style={{ padding: '4px 36px 30px' }}>
            <Heading
              as="h3"
              style={{ margin: '0 0 8px', color: colors.ink, fontSize: '17px' }}
            >
              Complete your payment
            </Heading>
            <Text style={{ margin: '0 0 18px', color: colors.muted, fontSize: '14px', lineHeight: '1.6' }}>
              Finish checkout to secure your spot. Payment is available for 24 hours after
              registration.
            </Text>
            {payment_url && (
              <Link
                href={payment_url}
                style={{
                  display: 'inline-block',
                  padding: '13px 22px',
                  borderRadius: '999px',
                  backgroundColor: colors.lime,
                  color: colors.ink,
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                Continue to payment
              </Link>
            )}
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
