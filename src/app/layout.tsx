import type { Metadata } from "next";
// import { Geist, Geist_Mono, Ubuntu } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

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

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_APP_URL || "https://syd.runminders.com"
);
const siteOrigin = siteUrl.origin;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Share Your Distance Vol 4.0 — Sobat Sabtu",
  description:
    "Satu Tim. Empat Pelari. Satu Jarak. Share Your Distance Vol 4.0 bersama Sobat Sabtu di Bandung.",
  keywords: [
    "Share Your Distance",
    "Sobat Sabtu",
    "running event",
    "relay race",
    "lari estafet",
    "lari 2026",
    "Bandung",
    "4 x 600M",
    "community running"
  ],
  alternates: {
    canonical: siteOrigin,
  },
  openGraph: {
    title: "Share Your Distance Vol 4.0 — Sobat Sabtu",
    description:
      "Satu Tim. Empat Pelari. Satu Jarak. Share Your Distance Vol 4.0 bersama Sobat Sabtu di Bandung.",
    url: siteOrigin,
    siteName: "Share Your Distance",
    images: [
      {
        url: "/images/syd-vol-4.png",
        width: 512,
        height: 327,
        alt: "Share Your Distance Vol 4.0",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/syd-vol-4.png"],
  },
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
      <body className="">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
