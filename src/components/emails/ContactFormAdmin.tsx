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
} from "@react-email/components";

interface ContactFormAdminProps {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  sentAt?: Date;
}

export const ContactFormAdmin = ({
  name,
  email,
  category,
  subject,
  message,
  sentAt = new Date(),
}: ContactFormAdminProps) => {
  const formattedDate = sentAt.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Html>
      <Head />
      {/* <Preview>New contact message from {name}</Preview> */}
      <Tailwind>
        <Body className="font-ubuntu text-gray-800 leading-relaxed bg-gray-50 p-5">
          <Container className="max-w-xl mx-auto bg-gray-100 rounded-xl overflow-hidden">
            {/* Header */}
            <Section className=" bg-zinc-900 text-white text-left">
              <Heading className="text-4xl font-bold mb-1 mt-12 ml-10 tracking-[-3px]">
                New&nbsp;&nbsp;Contact&nbsp;&nbsp;Message
              </Heading>
              <Text className="text-sm opacity-80 mb-12 ml-10">
                Share Your Distance Contact Form
              </Text>
            </Section>

            {/* Content */}
            <Section className="mt-8">
              {/* From */}
              <div className="mb-4 px-4 py-2 mx-8 bg-white" style={{ borderLeft: '4px solid #10181b'}}>
                <Text className="font-bold text-zinc-800">From:</Text>
                <Text className="text-sm">
                  {name} ({email})
                </Text>
              </div>

              {/* Category */}
              <div className="mb-4 px-4 py-2 mx-8 bg-white" style={{ borderLeft: '4px solid #10181b'}}>
                <Text className="font-bold text-zinc-800">Category:</Text>
                <Text className="text-sm">{category}</Text>
              </div>

              {/* Subject */}
              <div className="mb-4 px-4 py-2 mx-8 bg-white" style={{ borderLeft: '4px solid #10181b'}}>
                <Text className="font-bold text-zinc-800">Subject:</Text>
                <Text className="text-sm">{subject}</Text>
              </div>

              {/* Message */}
              <div className="mb-4 px-4 py-2 pb-6 mx-8 bg-white" style={{ borderLeft: '4px solid #10181b'}}>
                <Text className="font-bold text-zinc-800 mb-1">Message:</Text>
                <div className="bg-zinc-100 p-3 pt-1 rounded-md">
                  {message.split("\n").map((line, i) => (
                    <Text key={i} className="mb-1 text-sm">
                      {line}
                    </Text>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 py-4 px-8 text-zinc-500" style={{ borderTop: '1px solid #d1d5dd'}}>
                <Text className=" text-xs">
                  This message was sent from the Share Your Distance contact form
                  on {formattedDate}.
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );

  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <style>
  //         body { font-family: Ubuntu, system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
  //         .container { max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 10px; overflow: hidden; }
  //         .header { background: linear-gradient(135deg, #08090b, #d4d4d8); color: white; padding: 30px; text-align: center; }
  //         .content { padding: 30px; }
  //         .field { margin-bottom: 20px; padding: 15px; background: white; border-left: 4px solid #9e9fa9; }
  //         .label { font-weight: bold; color: #71707c; display: block; margin-bottom: 5px; }
  //         .message-content { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; }
  //         .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="container">
  //         <div class="header">
  //           <h1>New Contact Message</h1>
  //           <p>Share Your Distance Contact Form</p>
  //         </div>
  //         <div class="content">
  //           <div class="field">
  //             <span class="label">From:</span>
  //             <div>${name} (${email})</div>
  //           </div>
  //           <div class="field">
  //             <span class="label">Category:</span>
  //             <div>${category}</div>
  //           </div>
  //           <div class="field">
  //             <span class="label">Subject:</span>
  //             <div>${subject}</div>
  //           </div>
  //           <div class="field">
  //             <span class="label">Message:</span>
  //             <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
  //           </div>
  //           <div class="footer">
  //             <p>This message was sent from the Share Your Distance contact form on ${new Date().toLocaleDateString('en-US', {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   hour: '2-digit',
  //   minute: '2-digit'
  // })}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </body>
  //   </html>
};
