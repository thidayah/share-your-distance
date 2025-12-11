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
  title: "Share Your Distance – Running Race 2025",
  description:
    "End your year with meaningful steps. Join the Share Your Distance running race on December 20, 2025 at Arei Flagship Store.",
  keywords: [
    "running event",
    "running race",
    "lari 2025",
    "fun run",
    "Arei",
    "Share Your Distance",
    "event lari desember",
    "community running"
  ],
  alternates: {
    canonical: "https://www.shareyourdistance.online/",
  },
  openGraph: {
    title: "Share Your Distance – Running Race 2025",
    description:
      "End your year with meaningful steps. Join the Share Your Distance running race on December 20, 2025 at Arei Flagship Store.",
    url: "https://www.shareyourdistance.online/",
    siteName: "Share Your Distance",
    images: [
      {
        url: "/images/share-your-distance.jpeg",
        width: 1200,
        height: 630,
        alt: "Share Your Distance Running Race 2025",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/share-your-distance.jpeg"],
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
      <body className="">{children}</body>
    </html>
  );
}
