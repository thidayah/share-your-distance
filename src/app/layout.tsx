import type { Metadata } from "next";
// import { Geist, Geist_Mono, Ubuntu } from "next/font/google";
// @ts-ignore
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const ubuntu = Ubuntu({
//   subsets: ["latin"],
//   weight: ["400", "500", "700"], // sesuaikan kebutuhan
//   variable: "--font-ubuntu",
// });

export const metadata: Metadata = {
  title: 'Share Your Distance - Running Race',
  description: 'End your year with meaningful steps. Join us on December 20, 2025 at Gedung Sate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body
    //     // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //     className={`${ubuntu.variable} antialiased font-sans`}
    //     // className={`antialiased`}
    //   >
    //     {children}
    //   </body>
    // </html>
    <html lang="en" 
    // className={ubuntu.variable}
    >
      <body className="">{children}</body>
    </html>
  );
}
