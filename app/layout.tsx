import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Yeseva_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const yesevaOne = Yeseva_One({
  variable: "--font-yeseva",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Amwal - Aplikasi Syariah & Kalkulator Zakat",
  description: "Bantu kalkulasi kewajiban zakat secara cepat, transparan, dan benar sesuai fiqih syariah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${yesevaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
