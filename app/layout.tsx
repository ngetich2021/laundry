// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PwaRegister from "@/components/site/pwa-register";
import { SITE } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}, Eldoret`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "laundry Eldoret",
    "dry cleaners Eldoret",
    "laundry services Eldoret",
    "duvet cleaning Eldoret",
    "ironing services Eldoret",
    "laundry pickup and delivery Eldoret",
    "curtain cleaning Eldoret",
    "Iten Road laundry",
    "Royal Laundry",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Laundry & Dry Cleaning",
  formatDetection: { telephone: true, email: true, address: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.png?v=2",
    apple: "/icons/apple-touch-icon.png?v=2",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.shortName,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: SITE.name,
    url: "/",
    title: `${SITE.name}, Eldoret`,
    description: SITE.description,
    images: [{ url: "/og/og-home.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}, Eldoret`,
    description: SITE.description,
    images: ["/og/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
