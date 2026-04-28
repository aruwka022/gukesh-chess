// app/layout.tsx

import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Editorial display serif — gives the platform its "premium magazine" feel
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Modern body font — clean, NOT Inter (overused)
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Mono for chess notation, timestamps, labels
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GukeshMode — Chess for the Calculator's Generation",
  description:
    "Chess training built on the methodology of the world's youngest undisputed champion. Deep calculation, elite time management, slow deliberate play.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="bg-ink text-cream font-body antialiased">{children}</body>
    </html>
  );
}