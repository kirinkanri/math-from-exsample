import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./components/Footer";
import { Analytics } from '@vercel/analytics/react';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogicalTax - 税理士意思決定支援ツール",
  description: "税務に関する意思決定をサポートするプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
>

        <Providers>
          
  <main className="flex-1">
    {children}
  </main>
  <Footer />
</Providers>

     <Analytics />
      </body>
    </html>
  );
}
