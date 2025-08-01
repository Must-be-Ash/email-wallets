import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { CDPProvider } from "@/components/cdp-provider";

const FigtreeFont = Figtree({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CDP embedded wallets",
  description: "Get wallet address on email signups",
  keywords: [
    "CDP",
    "Coinbase Developer Platform",
    "Embedded Wallets",
    "Crypto Wallets",
    "Email Signups",
    "Web3",
    "Blockchain",
  ],
  authors: [{ name: "must_be_ash" }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/logo.png' },
    ],
    other: [
      { 
        rel: 'android-chrome',
        url: '/android-chrome-192x192.png',
        sizes: '192x192'
      },
      { 
        rel: 'android-chrome',
        url: '/android-chrome-512x512.png',
        sizes: '512x512'
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "CDP embedded wallets",
    description: "Get wallet address on email signups",
    url: "https://emailwallets.com",
    siteName: "CDP Embedded Wallets",
    type: "website",
    images: [
      {
        url: "https://emailwallets.com/og.png",
        width: 1200,
        height: 630,
        alt: "CDP Embedded Wallets - Get wallet address on email signups",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CDP embedded wallets",
    description: "Get wallet address on email signups",
    images: ["https://emailwallets.com/og.png"],
  },
  metadataBase: new URL("https://emailwallets.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={FigtreeFont.className}>
        <CDPProvider>
          {children}
          <Toaster richColors position="top-center" />
          <Analytics />
        </CDPProvider>
      </body>
    </html>
  );
}
