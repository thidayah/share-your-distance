import {
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Container,
  Text,
  Button,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
  message: string;
}

export const WelcomeEmail = ({ userName, message }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 py-10">
          <Container className="bg-white rounded-xl p-8 shadow-md">
            <Text className="text-xl font-bold mb-2 text-blue-500">Hello {userName},</Text>
            <Text className="text-sm mb-2 text-gray-400"> {message}</Text>
            <Text className="text-gray-700 mb-6">
              🎉 Welcome aboard! We're excited to have you join us.
            </Text>
            <Button
              href="https://yourapp.com"
              className="bg-blue-600 text-white px-4 py-2 rounded-md no-underline"
            >
              Go to Dashboard
            </Button>
            <Text className="text-xs text-gray-500 mt-6">
              — The YourApp Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
