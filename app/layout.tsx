// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";   // ← your original import (correct)
import "./globals.css";
import Nav from "@/components/Nav";
import Sticky from "@/components/Sticky";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ONLY THESE 3 LINES ARE NEW
export const metadata: Metadata = {
  title: "Royal laundry & dry cleaners",
  description: "created by kwenik developers",

  // THIS IS THE ONLY CHANGE YOU NEED
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <Nav />
          {children}
          <Sticky />
        </div>
      </body>
    </html>
  );
}