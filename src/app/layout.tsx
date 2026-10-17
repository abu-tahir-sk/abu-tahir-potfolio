import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Abu Tahir Sk — Full-Stack Web Developer",
    template: "%s | Abu Tahir Sk",
  },
  description:
    "Portfolio of Abu Tahir Sk, a Full-Stack Web Developer specializing in React, Next.js, TypeScript, Node.js, and PostgreSQL. Explore production web applications, SaaS case studies, and engineering background.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://abutahir.dev"),
  keywords: [
    "Abu Tahir Sk",
    "Full-Stack Web Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "DocuFlow",
    "Portfolio CMS",
  ],
  authors: [{ name: "Abu Tahir Sk", url: "https://github.com/abu-tahir-sk" }],
  creator: "Abu Tahir Sk",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abutahir.dev",
    title: "Abu Tahir Sk — Full-Stack Web Developer",
    description:
      "Full-Stack Web Developer building modern web applications, responsive interfaces, and digital products with React, Next.js, and PostgreSQL.",
    siteName: "Abu Tahir Sk Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abu Tahir Sk — Full-Stack Web Developer",
    description:
      "Full-Stack Web Developer building modern web applications with React, Next.js, and PostgreSQL.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#0B0B14] text-[#F5F5FA] font-sans antialiased selection:bg-[#6C63FF]/30 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
