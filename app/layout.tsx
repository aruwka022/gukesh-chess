// app/layout.tsx

import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Geist supports Latin + Cyrillic — important for Russian and partial Kazakh
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

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
      <body className="bg-ink text-cream font-body antialiased">
        {/* LanguageProvider wraps the entire app so every page and
            component can use the useTranslation() hook. */}
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}